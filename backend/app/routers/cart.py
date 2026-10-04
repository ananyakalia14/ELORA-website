"""Cart router — Redis-backed cart operations with guest & user support."""

from fastapi import APIRouter, Depends, HTTPException, Request
from jose import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.db import get_db
from app.models import Product
from app.schemas import CartItem, CartOut
from app.services import cart_service

router = APIRouter(prefix="/cart", tags=["cart"])


async def get_cart_user_id(request: Request) -> str:
    """Extract user ID from JWT if present, else fallback to session/guest ID."""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
            return f"user:{payload['sub']}"
        except Exception:
            pass

    guest_id = request.headers.get("X-Session-ID") or request.cookies.get("session_id")
    if not guest_id:
        guest_id = "guest_default"
    return f"guest:{guest_id}"


async def _resolve_product(db: AsyncSession, product_id: int | str) -> Product:
    pid_str = str(product_id).strip()
    if pid_str.isdigit():
        pid_int = int(pid_str)
        result = await db.execute(select(Product).where((Product.id == pid_int) | (Product.slug == pid_str)))
    else:
        result = await db.execute(select(Product).where(Product.slug == pid_str))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    return product


async def _cart_with_total(redis, user_id: str, db: AsyncSession) -> CartOut:
    """Get cart and compute total from current product prices."""
    items = await cart_service.get_cart(redis, user_id)
    if not items:
        return CartOut(items={}, total=0.0)

    # Some stored keys might be integer IDs or slugs
    int_ids = []
    slug_ids = []
    for pid in items.keys():
        if pid.isdigit():
            int_ids.append(int(pid))
        else:
            slug_ids.append(pid)

    stmt = select(Product).where((Product.id.in_(int_ids)) | (Product.slug.in_(slug_ids)))
    result = await db.execute(stmt)
    products = result.scalars().all()

    # Map by both id and slug
    product_map = {}
    for p in products:
        product_map[str(p.id)] = p
        if p.slug:
            product_map[p.slug] = p

    total = sum(
        float(product_map[str(pid)].price) * qty
        for pid, qty in items.items()
        if str(pid) in product_map
    )
    return CartOut(items=items, total=round(total, 2))


@router.get("", response_model=CartOut, include_in_schema=False)
@router.get("/", response_model=CartOut)
async def get_cart(
    request: Request,
    user_id: str = Depends(get_cart_user_id),
    db: AsyncSession = Depends(get_db),
):
    redis = getattr(request.app.state, "redis", None)
    return await _cart_with_total(redis, user_id, db)


@router.post("/add", response_model=CartOut)
async def add_to_cart(
    item: CartItem,
    request: Request,
    user_id: str = Depends(get_cart_user_id),
    db: AsyncSession = Depends(get_db),
):
    product = await _resolve_product(db, item.product_id)
    redis = getattr(request.app.state, "redis", None)
    # Store with slug if available, else id
    store_id = product.slug or str(product.id)
    await cart_service.add_item(redis, user_id, store_id, item.quantity)
    return await _cart_with_total(redis, user_id, db)


@router.put("/update", response_model=CartOut)
async def update_cart_item(
    item: CartItem,
    request: Request,
    user_id: str = Depends(get_cart_user_id),
    db: AsyncSession = Depends(get_db),
):
    product = await _resolve_product(db, item.product_id)
    redis = getattr(request.app.state, "redis", None)
    store_id = product.slug or str(product.id)
    await cart_service.update_item(redis, user_id, store_id, item.quantity)
    return await _cart_with_total(redis, user_id, db)


@router.delete("/{product_id}", response_model=CartOut)
async def remove_from_cart(
    product_id: str,
    request: Request,
    user_id: str = Depends(get_cart_user_id),
    db: AsyncSession = Depends(get_db),
):
    redis = getattr(request.app.state, "redis", None)
    await cart_service.remove_item(redis, user_id, product_id)
    return await _cart_with_total(redis, user_id, db)


@router.delete("/", status_code=204)
async def clear_cart(
    request: Request,
    user_id: str = Depends(get_cart_user_id),
):
    redis = getattr(request.app.state, "redis", None)
    await cart_service.clear_cart(redis, user_id)
