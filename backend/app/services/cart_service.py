"""Redis-backed shopping cart with in-memory fallback.
ponytail: hash per user with TTL; no cart microservice."""

from redis.asyncio import Redis

CART_TTL = 7 * 24 * 3600  # 7 days
_MEMORY_CARTS: dict[str, dict[str, int]] = {}


def _key(user_id: int | str) -> str:
    return f"cart:{user_id}"


async def get_cart(redis: Redis | None, user_id: int | str) -> dict[str, int]:
    """Return {product_id: quantity} for a user."""
    k = _key(user_id)
    if redis is not None:
        try:
            raw = await redis.hgetall(k)
            return {k: int(v) for k, v in raw.items()}
        except Exception:
            pass
    return dict(_MEMORY_CARTS.get(k, {}))


async def add_item(redis: Redis | None, user_id: int | str, product_id: int, quantity: int = 1) -> dict[str, int]:
    """Add or increment an item in the cart."""
    k = _key(user_id)
    if redis is not None:
        try:
            await redis.hincrby(k, str(product_id), quantity)
            await redis.expire(k, CART_TTL)
            return await get_cart(redis, user_id)
        except Exception:
            pass

    cart = _MEMORY_CARTS.setdefault(k, {})
    cart[str(product_id)] = cart.get(str(product_id), 0) + quantity
    return dict(cart)


async def remove_item(redis: Redis | None, user_id: int | str, product_id: int) -> dict[str, int]:
    """Remove an item entirely from the cart."""
    k = _key(user_id)
    if redis is not None:
        try:
            await redis.hdel(k, str(product_id))
            return await get_cart(redis, user_id)
        except Exception:
            pass

    cart = _MEMORY_CARTS.setdefault(k, {})
    cart.pop(str(product_id), None)
    return dict(cart)


async def update_item(redis: Redis | None, user_id: int | str, product_id: int, quantity: int) -> dict[str, int]:
    """Set exact quantity for an item. Removes if quantity <= 0."""
    k = _key(user_id)
    if redis is not None:
        try:
            if quantity <= 0:
                await redis.hdel(k, str(product_id))
            else:
                await redis.hset(k, str(product_id), quantity)
                await redis.expire(k, CART_TTL)
            return await get_cart(redis, user_id)
        except Exception:
            pass

    cart = _MEMORY_CARTS.setdefault(k, {})
    if quantity <= 0:
        cart.pop(str(product_id), None)
    else:
        cart[str(product_id)] = quantity
    return dict(cart)


async def clear_cart(redis: Redis | None, user_id: int | str) -> None:
    """Delete the entire cart."""
    k = _key(user_id)
    if redis is not None:
        try:
            await redis.delete(k)
        except Exception:
            pass
    _MEMORY_CARTS.pop(k, None)
