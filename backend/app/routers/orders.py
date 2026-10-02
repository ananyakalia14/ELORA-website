"""Orders router — checkout, order history, tracking, clickstream logging."""

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db import get_db
from app.models import ClickstreamEvent, Order, OrderItem, Payment, Product, User
from app.routers.auth import get_current_user
from app.schemas import (
    CheckoutRequest,
    EventCreate,
    OrderOut,
    OrderItemOut,
    OrderTrackingInfo,
    TrackingMilestone,
)
from app.services import cart_service, inventory_service

router = APIRouter(tags=["orders"])


def _format_order_number(order_id: int) -> str:
    return f"EL-{10420 + order_id}"


def _format_tracking_number(order_id: int) -> str:
    return f"EL-TRK-{78290 + order_id}"


def _generate_milestones(order: Order, created_at: datetime) -> list[TrackingMilestone]:
    st = (order.status or "confirmed").lower()
    t0 = created_at.strftime("%b %d, %Y • %I:%M %p")
    t1 = (created_at + timedelta(minutes=45)).strftime("%b %d, %Y • %I:%M %p")
    t2 = (created_at + timedelta(hours=3)).strftime("%b %d, %Y • %I:%M %p")
    t3 = (created_at + timedelta(hours=8)).strftime("%b %d, %Y • %I:%M %p")
    t4 = (created_at + timedelta(days=2)).strftime("%b %d, %Y (Estimated)")

    is_confirmed = True
    is_formulating = st in ["processing", "formulating", "shipped", "delivered", "confirmed"]
    is_packaged = st in ["packaged", "shipped", "delivered"]
    is_shipped = st in ["shipped", "delivered"]
    is_delivered = st == "delivered"

    return [
        TrackingMilestone(
            title="Order Placed & Authorized",
            detail="Payment authorized securely. Order entered into Élora Atelier allocation queue.",
            timestamp=t0,
            completed=is_confirmed,
            current=st == "confirmed",
        ),
        TrackingMilestone(
            title="Atelier Formulation & Cold-Pressing",
            detail="Botanical actives and French Alpine Rose stem cells extracted and verified.",
            timestamp=t1,
            completed=is_formulating,
            current=st in ["processing", "formulating"],
        ),
        TrackingMilestone(
            title="Hand-Sealing & Custom Wax Emblem",
            detail="Inspection passed. Flacon sealed in linen sleeve with complimentary samples.",
            timestamp=t2,
            completed=is_packaged,
            current=st == "packaged",
        ),
        TrackingMilestone(
            title="Courier Handover & Departure",
            detail="Dispatched with Élora White-Glove Temperature-Controlled Botanical Transit.",
            timestamp=t3,
            completed=is_shipped,
            current=st == "shipped",
        ),
        TrackingMilestone(
            title="White-Glove Delivery to Destination",
            detail="Signature contactless handoff to your verified delivery address.",
            timestamp=t4,
            completed=is_delivered,
            current=st == "delivered",
        ),
    ]


async def _resolve_user_from_request(
    request: Request,
    body: CheckoutRequest,
    db: AsyncSession,
) -> User:
    """Extract authenticated user if Bearer token is provided, or find/create customer by email."""
    # 1. Try JWT Auth
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            from jose import jwt
            from app.config import settings
            payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
            user_id = int(payload.get("sub"))
            res = await db.execute(select(User).where(User.id == user_id))
            user = res.scalar_one_or_none()
            if user:
                return user
        except Exception:
            pass

    # 2. Look up by email from checkout form
    customer_email = (body.email or "").strip().lower()
    if customer_email:
        res = await db.execute(select(User).where(User.email == customer_email))
        user = res.scalar_one_or_none()
        if user:
            return user

        # Create guest customer user
        full_name = f"{body.firstName or ''} {body.lastName or ''}".strip() or "Élora Client"
        new_user = User(
            email=customer_email,
            name=full_name,
            password_hash="guest_checkout_account",
            role="customer",
        )
        db.add(new_user)
        await db.flush()
        return new_user

    # 3. Fallback to default demo user / admin
    res = await db.execute(select(User).order_by(User.id.asc()).limit(1))
    user = res.scalar_one_or_none()
    if not user:
        user = User(
            email="client@elora.com",
            name="Élora Client",
            password_hash="guest_checkout_account",
            role="customer",
        )
        db.add(user)
        await db.flush()
    return user


@router.post("/checkout", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def checkout(
    body: CheckoutRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Universal checkout: Supports direct frontend cart payloads and server-side Redis carts."""
    user = await _resolve_user_from_request(request, body, db)

    # Fetch all database products for lookup
    prod_res = await db.execute(select(Product))
    all_products = prod_res.scalars().all()
    product_map_by_id = {p.id: p for p in all_products}
    first_product_id = all_products[0].id if all_products else 1

    # Name/slug lookup
    product_map_by_name = {}
    for p in all_products:
        if p.name:
            product_map_by_name[p.name.lower()] = p
        if p.slug:
            product_map_by_name[p.slug.lower()] = p

    processed_items = []
    total = 0.0

    # Case A: Frontend sent explicit items in body
    if body.items and len(body.items) > 0:
        for it in body.items:
            qty = max(1, it.quantity)
            price = float(it.price) if (it.price is not None and it.price > 0) else 0.0

            # Match database product
            matched_prod = None
            if it.product_id is not None:
                try:
                    pid_int = int(it.product_id)
                    matched_prod = product_map_by_id.get(pid_int)
                except (ValueError, TypeError):
                    pass

            if not matched_prod and it.id is not None:
                try:
                    pid_int = int(it.id)
                    matched_prod = product_map_by_id.get(pid_int)
                except (ValueError, TypeError):
                    matched_prod = product_map_by_name.get(str(it.id).lower())

            if not matched_prod and it.name:
                item_name_lower = it.name.lower()
                for p_name_lower, p_obj in product_map_by_name.items():
                    if p_name_lower in item_name_lower or item_name_lower in p_name_lower:
                        matched_prod = p_obj
                        break

            final_product_id = matched_prod.id if matched_prod else first_product_id
            if price == 0.0 and matched_prod:
                price = float(matched_prod.price)
            if price == 0.0:
                price = 98.0

            item_total = price * qty
            total += item_total

            # Deduct stock if matching product
            if matched_prod and matched_prod.stock >= qty:
                matched_prod.stock -= qty

            processed_items.append({
                "product_id": final_product_id,
                "name": it.name or (matched_prod.name if matched_prod else "Élora Botanical Ritual"),
                "quantity": qty,
                "price": price,
                "image": it.image or (matched_prod.image_url if matched_prod else None),
                "variantName": it.variantName,
            })

    # Case B: Fallback to Redis Cart
    else:
        redis = getattr(request.app.state, "redis", None)
        cart = await cart_service.get_cart(redis, user.id) if redis else {}
        if not cart:
            raise HTTPException(status_code=400, detail="Cart is empty")

        for pid_str, qty in cart.items():
            pid = int(pid_str)
            product = product_map_by_id.get(pid)
            if not product:
                continue
            price = float(product.price)
            total += price * qty
            if product.stock >= qty:
                product.stock -= qty

            processed_items.append({
                "product_id": pid,
                "name": product.name,
                "quantity": qty,
                "price": price,
                "image": product.image_url,
                "variantName": None,
            })

        if redis:
            await cart_service.clear_cart(redis, user.id)

    if not processed_items:
        raise HTTPException(status_code=400, detail="No items to checkout")

    # Create Order
    order = Order(
        user_id=user.id,
        status="confirmed",
        total=round(total, 2),
    )
    db.add(order)
    await db.flush()

    # Create Order Items
    order_items_out = []
    for it in processed_items:
        db_item = OrderItem(
            order_id=order.id,
            product_id=it["product_id"],
            quantity=it["quantity"],
            price=it["price"],
        )
        db.add(db_item)
        order_items_out.append(
            OrderItemOut(
                product_id=it["product_id"],
                name=it["name"],
                quantity=it["quantity"],
                price=it["price"],
                image=it["image"],
                variantName=it.get("variantName"),
            )
        )

    # Create Payment
    payment = Payment(
        order_id=order.id,
        method=body.payment_method or "card",
        status="completed",
        amount=round(total, 2),
    )
    db.add(payment)

    await db.commit()
    await db.refresh(order)

    # Build response with formatted details
    shipping_addr = (
        f"{body.address or ''}, {body.city or ''} {body.state or ''} {body.zipCode or ''}, {body.country or ''}"
    ).strip(", ")

    cust_name = f"{body.firstName or ''} {body.lastName or ''}".strip() or user.name or user.email
    order_num = body.order_number or _format_order_number(order.id)
    tracking_num = _format_tracking_number(order.id)
    est_delivery = (order.created_at + timedelta(days=3)).strftime("%A, %B %d, %Y")

    return OrderOut(
        id=order.id,
        order_number=order_num,
        tracking_number=tracking_num,
        carrier="Élora White-Glove Atelier Courier",
        estimated_delivery=est_delivery,
        user_id=order.user_id,
        status=order.status,
        total=float(order.total),
        created_at=order.created_at,
        shipping_address=shipping_addr or "742 Evergreen Terrace, Beverly Hills CA 90210",
        customer_name=cust_name,
        items=order_items_out,
    )


@router.get("/orders", response_model=list[OrderOut])
async def order_history(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Fetch order history for the authenticated user with enriched product details."""
    result = await db.execute(
        select(Order)
        .where(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
    )
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
            prod_shade = prod.shade if prod else None
            items_out.append(
                OrderItemOut(
                    id=item.id,
                    product_id=item.product_id,
                    name=prod_name,
                    quantity=item.quantity,
                    price=float(item.price),
                    image=prod_img,
                    shade=prod_shade,
                )
            )

        est_delivery = (order.created_at + timedelta(days=3)).strftime("%A, %B %d, %Y")

        out.append(
            OrderOut(
                id=order.id,
                order_number=_format_order_number(order.id),
                tracking_number=_format_tracking_number(order.id),
                carrier="Élora White-Glove Atelier Courier",
                estimated_delivery=est_delivery,
                user_id=order.user_id,
                status=order.status,
                total=float(order.total),
                created_at=order.created_at,
                customer_name=user.name or user.email,
                items=items_out,
            )
        )
    return out


@router.get("/orders/track/{order_id_or_number}", response_model=OrderTrackingInfo)
async def track_order(
    order_id_or_number: str,
    email: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Public order tracking endpoint: Look up any order by ID, Order # (e.g. EL-10425), or Tracking #."""
    query = select(Order).outerjoin(User, Order.user_id == User.id)

    clean_param = order_id_or_number.strip().upper()
    order = None

    # 1. Direct Integer ID
    if clean_param.isdigit():
        res = await db.execute(query.where(Order.id == int(clean_param)))
        order = res.scalar_one_or_none()

    # 2. Match "EL-XXXXX" format
    if not order and clean_param.startswith("EL-") and not clean_param.startswith("EL-TRK-"):
        num_str = clean_param.replace("EL-", "")
        if num_str.isdigit():
            order_id_calc = int(num_str) - 10420
            if order_id_calc > 0:
                res = await db.execute(query.where(Order.id == order_id_calc))
                order = res.scalar_one_or_none()

    # 3. Match "EL-TRK-XXXXX" format
    if not order and clean_param.startswith("EL-TRK-"):
        num_str = clean_param.replace("EL-TRK-", "")
        if num_str.isdigit():
            order_id_calc = int(num_str) - 78290
            if order_id_calc > 0:
                res = await db.execute(query.where(Order.id == order_id_calc))
                order = res.scalar_one_or_none()

    # 4. Fallback lookup by email
    if not order and email:
        res = await db.execute(
            query.where(User.email.ilike(email.strip())).order_by(Order.created_at.desc()).limit(1)
        )
        order = res.scalar_one_or_none()

    # 5. Fallback to the latest order in DB for demo if invalid
    if not order:
        res = await db.execute(query.order_by(Order.created_at.desc()).limit(1))
        order = res.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Fetch items
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

    # Fetch user
    user_res = await db.execute(select(User).where(User.id == order.user_id))
    order_user = user_res.scalar_one_or_none()
    cust_name = order_user.name if order_user else "Élora VIP Client"
    cust_email = order_user.email if order_user else "client@elora.com"

    order_num = _format_order_number(order.id)
    tracking_num = _format_tracking_number(order.id)
    est_delivery = (order.created_at + timedelta(days=3)).strftime("%A, %B %d, %Y")
    milestones = _generate_milestones(order, order.created_at)

    return OrderTrackingInfo(
        order_id=order.id,
        order_number=order_num,
        tracking_number=tracking_num,
        carrier="Élora White-Glove Atelier Courier",
        status=order.status.capitalize(),
        created_at=order.created_at,
        estimated_delivery=est_delivery,
        shipping_address="742 Evergreen Terrace, Beverly Hills, CA 90210, United States",
        customer_name=cust_name,
        customer_email=cust_email,
        total=float(order.total),
        items=items_out,
        milestones=milestones,
    )


@router.get("/orders/{order_id}", response_model=OrderOut)
async def get_order_by_id(
    order_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve single order by integer ID."""
    res = await db.execute(select(Order).where(Order.id == order_id))
    order = res.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

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

    user_res = await db.execute(select(User).where(User.id == order.user_id))
    user = user_res.scalar_one_or_none()

    est_delivery = (order.created_at + timedelta(days=3)).strftime("%A, %B %d, %Y")

    return OrderOut(
        id=order.id,
        order_number=_format_order_number(order.id),
        tracking_number=_format_tracking_number(order.id),
        carrier="Élora White-Glove Atelier Courier",
        estimated_delivery=est_delivery,
        user_id=order.user_id,
        status=order.status,
        total=float(order.total),
        created_at=order.created_at,
        customer_name=user.name if user else "Élora Client",
        items=items_out,
    )


@router.post("/events", status_code=status.HTTP_201_CREATED)
async def log_event(
    body: EventCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Log a clickstream event. Debezium picks it up from WAL for Kafka/Fabric."""
    try:
        from app.routers.auth import oauth2_scheme, get_current_user
        token = await oauth2_scheme(request)
        user = await get_current_user(token, db)
    except Exception:
        user = None

    event = ClickstreamEvent(
        user_id=user.id if user else None,
        event_type=body.event_type,
        product_id=body.product_id,
        event_metadata=body.metadata,
    )
    db.add(event)
    await db.commit()
    return {"status": "logged"}
