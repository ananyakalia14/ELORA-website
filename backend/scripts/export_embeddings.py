"""Export ALS embeddings from Fabric Delta tables to Redis.
Run locally or as a Fabric notebook after train_als.py completes.

Usage (local, reading from exported parquet/csv):
    python -m scripts.export_embeddings --user-file user_factors.parquet --item-file item_factors.parquet

Usage (Fabric notebook):
    Run the cells below after train_als.py has written to Tables/ml/embeddings/
"""

import argparse
import asyncio
import json
import sys

import redis.asyncio as aioredis


async def export_to_redis(
    redis_url: str,
    user_factors: list[tuple[int, list[float]]],
    item_factors: list[tuple[int, list[float]]],
):
    """Push embedding vectors to Redis as JSON strings.
    Keys: emb:user:{id}, emb:item:{id}"""

    r = aioredis.from_url(redis_url, decode_responses=True)

    pipe = r.pipeline()
    for user_id, embedding in user_factors:
        pipe.set(f"emb:user:{user_id}", json.dumps(embedding))
    for product_id, embedding in item_factors:
        pipe.set(f"emb:item:{product_id}", json.dumps(embedding))
    await pipe.execute()

    print(f"Exported {len(user_factors)} user + {len(item_factors)} item embeddings to Redis")
    await r.close()


def load_from_parquet(path: str) -> list[tuple[int, list[float]]]:
    """Load (id, embedding) pairs from a parquet file."""
    # ponytail: pandas for local file reading; PySpark handles this in Fabric
    import pandas as pd
    df = pd.read_parquet(path)
    id_col = "user_id" if "user_id" in df.columns else "product_id"
    return [(int(row[id_col]), list(row["embedding"])) for _, row in df.iterrows()]


def load_from_csv(path: str) -> list[tuple[int, list[float]]]:
    """Load (id, embedding) pairs from CSV with JSON embedding column."""
    import csv
    results = []
    with open(path) as f:
        reader = csv.DictReader(f)
        for row in reader:
            id_col = "user_id" if "user_id" in row else "product_id"
            results.append((int(row[id_col]), json.loads(row["embedding"])))
    return results


async def main():
    parser = argparse.ArgumentParser(description="Export ALS embeddings to Redis")
    parser.add_argument("--redis-url", default="redis://localhost:6379/0")
    parser.add_argument("--user-file", required=True, help="Path to user_factors parquet/csv")
    parser.add_argument("--item-file", required=True, help="Path to item_factors parquet/csv")
    args = parser.parse_args()

    load_fn = load_from_parquet if args.user_file.endswith(".parquet") else load_from_csv

    user_factors = load_fn(args.user_file)
    item_factors = load_fn(args.item_file)

    await export_to_redis(args.redis_url, user_factors, item_factors)


# ── Fabric Notebook Version ──────────────────────────────────────────────
# Uncomment below when running inside a Fabric PySpark notebook:
#
# EMBEDDINGS_PATH = "Tables/ml/embeddings"
# REDIS_URL = "redis://<your-redis-host>:6379/0"
#
# user_df = spark.read.format("delta").load(f"{EMBEDDINGS_PATH}/user_factors")
# item_df = spark.read.format("delta").load(f"{EMBEDDINGS_PATH}/item_factors")
#
# user_factors = [(row.user_id, list(row.embedding)) for row in user_df.collect()]
# item_factors = [(row.product_id, list(row.embedding)) for row in item_df.collect()]
#
# import asyncio
# asyncio.run(export_to_redis(REDIS_URL, user_factors, item_factors))


if __name__ == "__main__":
    asyncio.run(main())
