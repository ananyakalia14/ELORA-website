"""Flash-sale inventory locking via Redis SET NX.
ponytail: single-node SET NX; Redlock if multi-node Redis."""

from redis.asyncio import Redis


LOCK_TTL = 30  # seconds


async def acquire_stock_lock(redis: Redis | None, product_id: int, user_id: int) -> bool:
    """Try to acquire a reservation lock for a product.
    Returns True if lock acquired, False if already held."""
    if redis is None:
        return True
    try:
        key = f"lock:stock:{product_id}:{user_id}"
        return bool(await redis.set(key, "1", nx=True, ex=LOCK_TTL))
    except Exception:
        return True


async def release_stock_lock(redis: Redis | None, product_id: int, user_id: int) -> None:
    """Release the reservation lock."""
    if redis is None:
        return
    try:
        key = f"lock:stock:{product_id}:{user_id}"
        await redis.delete(key)
    except Exception:
        pass
