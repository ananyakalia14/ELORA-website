"""Recommendation service — ALS embeddings from Redis, dot-product scoring.
ponytail: in-process scoring; deploy dedicated inference endpoint when p99 > 100ms."""

import json

from redis.asyncio import Redis


async def get_recommendations(redis: Redis, user_id: int, top_n: int = 10) -> list[int]:
    """Return top-N product IDs by ALS embedding similarity.
    Falls back to empty list if embeddings aren't loaded yet."""
    user_vec_raw = await redis.get(f"emb:user:{user_id}")
    if not user_vec_raw:
        return []

    user_vec = json.loads(user_vec_raw)

    # ponytail: brute-force dot product over all item vectors;
    # add ANN index (FAISS/Redis VSS) when catalog exceeds ~10k items
    scores = []
    cursor = "0"
    while cursor:
        cursor, keys = await redis.scan(cursor=cursor, match="emb:item:*", count=200)
        if keys:
            values = await redis.mget(keys)
            for key, val in zip(keys, values):
                if val is None:
                    continue
                item_vec = json.loads(val)
                score = sum(u * v for u, v in zip(user_vec, item_vec))
                item_id = int(key.decode().split(":")[-1]) if isinstance(key, bytes) else int(key.split(":")[-1])
                scores.append((item_id, score))

    scores.sort(key=lambda x: -x[1])
    return [s[0] for s in scores[:top_n]]


def compute_offer(user_score: float, cart_value: float, time_on_page: float) -> dict | None:
    """Simplified propensity scoring with hardcoded weights.
    ponytail: logistic-style score; replace with trained model when A/B data justifies it."""
    urgency = min(time_on_page / 300, 1.0)  # normalize to 5-min cap
    propensity = user_score * 0.6 + (cart_value / 100) * 0.2 + urgency * 0.2
    if propensity > 0.7:
        return {"discount_pct": 10, "expires_minutes": 15}
    return None
