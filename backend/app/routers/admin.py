"""Admin router — dashboard stats, user/product/order management.
Only accessible to users with role='admin'."""

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select, case, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import Order, OrderItem, Payment, Product, User
from app.routers.auth import get_current_user
from app.schemas import (
    AdminDashboardStats,
    AdminOrderUpdate,
    AdminProductCreate,
    AdminProductUpdate,
    AdminUserOut,
    AdminUserUpdate,
    OrderOut,
    OrderItemOut,
    ProductOut,
    RevenuePoint,
)

router = APIRouter(prefix="/admin", tags=["admin"])


async def require_admin(user: User = Depends(get_current_user)) -> User:
    """Dependency — ensures the authenticated user is an admin."""
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user


# ── Dashboard Stats ──────────────────────────────────────────────────────

@router.get("/stats", response_model=AdminDashboardStats)
async def dashboard_stats(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Aggregate dashboard statistics for the admin overview."""
    # Total counts
    users_count = (await db.execute(select(func.count(User.id)))).scalar() or 0
    products_count = (await db.execute(select(func.count(Product.id)))).scalar() or 0
    orders_count = (await db.execute(select(func.count(Order.id)))).scalar() or 0

    # Revenue
    revenue_result = await db.execute(select(func.coalesce(func.sum(Order.total), 0)))
    total_revenue = float(revenue_result.scalar())

    # Order status breakdown
    status_counts = await db.execute(
        select(Order.status, func.count(Order.id)).group_by(Order.status)
    )
    status_map = {row[0]: row[1] for row in status_counts.all()}

    # Low stock products (stock < 20)
    low_stock = (
        await db.execute(select(func.count(Product.id)).where(Product.stock < 20))
    ).scalar() or 0

    # Recent signups in last 24h
    yesterday = datetime.now(timezone.utc) - timedelta(hours=24)
    recent_signups = (
        await db.execute(
            select(func.count(User.id)).where(User.created_at >= yesterday)
        )
    ).scalar() or 0

    # Average order value
    avg_order = (
        await db.execute(select(func.coalesce(func.avg(Order.total), 0)))
    ).scalar()

    return AdminDashboardStats(
        total_users=users_count,
        total_products=products_count,
        total_orders=orders_count,
        total_revenue=round(total_revenue, 2),
        pending_orders=status_map.get("pending", 0),
        confirmed_orders=status_map.get("confirmed", 0),
        shipped_orders=status_map.get("shipped", 0),
        delivered_orders=status_map.get("delivered", 0),
        cancelled_orders=status_map.get("cancelled", 0),
        low_stock_count=low_stock,
        recent_signups_24h=recent_signups,
        avg_order_value=round(float(avg_order), 2),
    )


# ── Revenue Chart ────────────────────────────────────────────────────────

@router.get("/revenue", response_model=list[RevenuePoint])
async def revenue_chart(
    days: int = 30,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Daily revenue breakdown for charting."""
    since = datetime.now(timezone.utc) - timedelta(days=days)
    result = await db.execute(
        select(
            func.date_trunc("day", Order.created_at).label("day"),
            func.coalesce(func.sum(Order.total), 0).label("revenue"),
            func.count(Order.id).label("order_count"),
        )
        .where(Order.created_at >= since)
        .group_by("day")
        .order_by("day")
    )
    rows = result.all()
    return [
        RevenuePoint(
            date=row.day.strftime("%Y-%m-%d") if row.day else "",
            revenue=round(float(row.revenue), 2),
            order_count=row.order_count,
        )
        for row in rows
    ]


# ── User Management ─────────────────────────────────────────────────────

@router.get("/users", response_model=list[AdminUserOut])
async def list_users(
    page: int = 1,
    size: int = 50,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all users with their order stats."""
    offset = (page - 1) * size
    result = await db.execute(
        select(User).order_by(User.created_at.desc()).offset(offset).limit(size)
    )
    users = result.scalars().all()

    out = []
    for u in users:
        # Get order stats for each user
        order_stats = await db.execute(
            select(
                func.count(Order.id).label("order_count"),
                func.coalesce(func.sum(Order.total), 0).label("total_spent"),
            ).where(Order.user_id == u.id)
        )
        stats = order_stats.one()
        out.append(
            AdminUserOut(
                id=u.id,
                email=u.email,
                name=u.name,
                role=u.role,
                skin_type=u.skin_type,
                created_at=u.created_at,
                order_count=stats.order_count,
                total_spent=round(float(stats.total_spent), 2),
            )
        )
    return out


@router.put("/users/{user_id}", response_model=AdminUserOut)
async def update_user(
    user_id: int,
    body: AdminUserUpdate,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update a user's role, name, or skin_type."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if body.name is not None:
        user.name = body.name
    if body.role is not None:
        if body.role not in ("admin", "customer"):
            raise HTTPException(status_code=400, detail="Role must be 'admin' or 'customer'")
        user.role = body.role
    if body.skin_type is not None:
        user.skin_type = body.skin_type

    await db.commit()
    await db.refresh(user)

    order_stats = await db.execute(
        select(
            func.count(Order.id).label("order_count"),
            func.coalesce(func.sum(Order.total), 0).label("total_spent"),
        ).where(Order.user_id == user.id)
    )
    stats = order_stats.one()

    return AdminUserOut(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        skin_type=user.skin_type,
        created_at=user.created_at,
        order_count=stats.order_count,
        total_spent=round(float(stats.total_spent), 2),
    )


@router.delete("/users/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete a user (cannot delete self)."""
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()


# ── Product Management ───────────────────────────────────────────────────

@router.get("/products", response_model=list[ProductOut])
async def admin_list_products(
    page: int = 1,
    size: int = 50,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all products for admin management."""
    offset = (page - 1) * size
    result = await db.execute(
        select(Product).order_by(Product.id).offset(offset).limit(size)
    )
    return result.scalars().all()


@router.post("/products", response_model=ProductOut, status_code=201)
async def create_product(
    body: AdminProductCreate,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Create a new product."""
    product = Product(
        name=body.name,
        brand=body.brand,
        category=body.category,
        shade=body.shade,
        price=body.price,
        stock=body.stock,
        image_url=body.image_url,
        description=body.description,
        slug=body.slug,
        subtitle=body.subtitle,
        volume=body.volume,
        badge=body.badge,
        is_hero=body.is_hero,
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


@router.put("/products/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: int,
    body: AdminProductUpdate,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing product."""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    await db.commit()
    await db.refresh(product)
    return product


@router.delete("/products/{product_id}", status_code=204)
async def delete_product(
    product_id: int,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete a product."""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    await db.delete(product)
    await db.commit()


# ── Order Management ─────────────────────────────────────────────────────

@router.get("/orders", response_model=list[OrderOut])
async def admin_list_orders(
    status_filter: str | None = None,
    page: int = 1,
    size: int = 50,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all orders with optional status filter."""
    stmt = select(Order).order_by(Order.created_at.desc())
    if status_filter:
        norm_filter = status_filter.strip().lower()
        if norm_filter in ("dispatch", "dispatched"):
            norm_filter = "shipped"
        stmt = stmt.where(Order.status == norm_filter)
    offset = (page - 1) * size
    stmt = stmt.offset(offset).limit(size)

    result = await db.execute(stmt)
    orders = result.scalars().all()

    out = []
    for order in orders:
        items_result = await db.execute(
            select(OrderItem, Product)
            .outerjoin(Product, OrderItem.product_id == Product.id)
            .where(OrderItem.order_id == order.id)
        )
        rows = items_result.all()

        items_out = []
        for item, prod in rows:
            prod_name = prod.name if prod else "Élora Botanical Ritual"
            prod_img = prod.image_url if prod else "/images/elora-hero-serum.jpg"
            items_out.append(
                OrderItemOut(
                    id=item.id,
                    product_id=item.product_id,
                    name=prod_name,
                    quantity=item.quantity,
                    price=float(item.price),
                    image=prod_img,
                )
            )

        out.append(
            OrderOut(
                id=order.id,
                order_number=f"EL-{10420 + order.id}",
                tracking_number=f"EL-TRK-{78290 + order.id}",
                carrier="Élora White-Glove Atelier Courier",
                user_id=order.user_id,
                status=order.status,
                total=float(order.total),
                created_at=order.created_at,
                items=items_out,
            )
        )
    return out


@router.put("/orders/{order_id}", response_model=OrderOut)
async def update_order_status(
    order_id: int,
    body: AdminOrderUpdate,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update an order's status and dispatch tracking state."""
    raw_status = (body.status or "").strip().lower()

    # Normalize common dispatch synonyms
    status_alias = {
        "dispatch": "shipped",
        "dispatched": "shipped",
        "in_transit": "shipped",
        "out_for_delivery": "shipped",
        "complete": "delivered",
        "completed": "delivered",
        "cancel": "cancelled",
        "canceled": "cancelled",
        "processing": "confirmed",
        "formulating": "confirmed",
        "packaged": "confirmed",
    }
    final_status = status_alias.get(raw_status, raw_status)

    valid_statuses = {"pending", "confirmed", "shipped", "delivered", "cancelled"}
    if final_status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Status must be one of: {', '.join(sorted(valid_statuses))}",
        )

    # Allow direct PK lookup or lookup by EL-10420 calculated offset
    result = await db.execute(
        select(Order).where(
            or_(
                Order.id == order_id,
                Order.id == (order_id - 10420) if order_id >= 10420 else False,
            )
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = final_status
    await db.commit()
    await db.refresh(order)

    items_result = await db.execute(
        select(OrderItem, Product)
        .outerjoin(Product, OrderItem.product_id == Product.id)
        .where(OrderItem.order_id == order.id)
    )
    rows = items_result.all()

    items_out = []
    for item, prod in rows:
        prod_name = prod.name if prod else "Élora Botanical Ritual"
        prod_img = prod.image_url if prod else "/images/elora-hero-serum.jpg"
        items_out.append(
            OrderItemOut(
                id=item.id,
                product_id=item.product_id,
                name=prod_name,
                quantity=item.quantity,
                price=float(item.price),
                image=prod_img,
            )
        )

    return OrderOut(
        id=order.id,
        order_number=f"EL-{10420 + order.id}",
        tracking_number=f"EL-TRK-{78290 + order.id}",
        carrier="Élora White-Glove Atelier Courier",
        user_id=order.user_id,
        status=order.status,
        total=float(order.total),
        created_at=order.created_at,
        items=items_out,
    )
