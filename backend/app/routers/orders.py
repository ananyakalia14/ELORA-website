"""Orders router — checkout, order history, clickstream logging."""

from fastapi import APIRouter, Depends, HTTPException, Request, status, BackgroundTasks
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import ClickstreamEvent, Order, OrderItem, Payment, Product, User
from app.routers.auth import get_current_user
from app.schemas import CheckoutRequest, EventCreate, OrderOut
from app.services import cart_service, inventory_service

router = APIRouter(tags=["orders"])


@router.post("/checkout", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def checkout(
    body: CheckoutRequest,
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Atomic checkout: lock stock → create order → deduct stock → clear cart."""
    redis = request.app.state.redis
    cart = await cart_service.get_cart(redis, user.id)
    if not cart:
        raise HTTPException(status_code=400, detail="Cart is empty")

    product_ids = [int(pid) for pid in cart.keys()]
    result = await db.execute(select(Product).where(Product.id.in_(product_ids)))
    products = {p.id: p for p in result.scalars().all()}

    # Validate stock and acquire locks
    locked = []
    try:
        for pid_str, qty in cart.items():
            pid = int(pid_str)
            product = products.get(pid)
            if not product:
                raise HTTPException(status_code=400, detail=f"Product {pid} not found")
            if product.stock < qty:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")

            acquired = await inventory_service.acquire_stock_lock(redis, pid, user.id)
            if not acquired:
                raise HTTPException(status_code=409, detail=f"Could not reserve {product.name}")
            locked.append(pid)

        # Calculate total
        total = sum(float(products[int(pid)].price) * qty for pid, qty in cart.items())

        # Create order in a transaction
        order = Order(user_id=user.id, status="confirmed", total=round(total, 2))
        db.add(order)
        await db.flush()  # get order.id

        for pid_str, qty in cart.items():
            pid = int(pid_str)
            item = OrderItem(
                order_id=order.id,
                product_id=pid,
                quantity=qty,
                price=float(products[pid].price),
            )
            db.add(item)

            # Deduct stock
            products[pid].stock -= qty

        # Create payment record
        payment = Payment(
            order_id=order.id,
            method=body.payment_method,
            status="completed",
            amount=round(total, 2),
        )
        db.add(payment)

        await db.commit()
        await db.refresh(order)

        # Clear cart after successful checkout
        await cart_service.clear_cart(redis, user.id)

    finally:
        # Release all locks
        for pid in locked:
            await inventory_service.release_stock_lock(redis, pid, user.id)

    # Reload with items for response
    result = await db.execute(
        select(Order).where(Order.id == order.id)
    )
    order = result.scalar_one()
    items_result = await db.execute(
        select(OrderItem).where(OrderItem.order_id == order.id)
    )
    order_items = items_result.scalars().all()

    return OrderOut(
        id=order.id,
        user_id=order.user_id,
        status=order.status,
        total=float(order.total),
        created_at=order.created_at,
        items=[
            {"product_id": i.product_id, "quantity": i.quantity, "price": float(i.price)}
            for i in order_items
        ],
    )


@router.get("/orders", response_model=list[OrderOut])
async def order_history(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Order).where(Order.user_id == user.id).order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()
    out = []
    for order in orders:
        items_result = await db.execute(
            select(OrderItem).where(OrderItem.order_id == order.id)
        )
        items = items_result.scalars().all()
        out.append(OrderOut(
            id=order.id,
            user_id=order.user_id,
            status=order.status,
            total=float(order.total),
            created_at=order.created_at,
            items=[
                {"product_id": i.product_id, "quantity": i.quantity, "price": float(i.price)}
                for i in items
            ],
        ))
    return out


@router.post("/events", status_code=status.HTTP_201_CREATED)
async def log_event(
    body: EventCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Log a clickstream event. Debezium picks it up from WAL for Kafka/Fabric."""
    # ponytail: try to get user from token, but don't require it (anonymous browsing)
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
