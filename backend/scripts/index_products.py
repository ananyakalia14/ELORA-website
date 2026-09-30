"""Index all products from PostgreSQL into Elasticsearch.
Usage: python -m scripts.index_products"""

import asyncio

from elasticsearch import AsyncElasticsearch
from sqlalchemy import select

from app.config import settings
from app.db import async_session
from app.models import Product
from app.services.search_service import INDEX, PRODUCTS_MAPPING, ensure_index


async def index_all():
    es = AsyncElasticsearch(settings.elasticsearch_url)

    try:
        # Recreate index
        if await es.indices.exists(index=INDEX):
            await es.indices.delete(index=INDEX)
        await es.indices.create(index=INDEX, body=PRODUCTS_MAPPING)
        print(f"Created index '{INDEX}'")

        # Fetch all products from PG
        async with async_session() as db:
            result = await db.execute(select(Product))
            products = result.scalars().all()

        if not products:
            print("No products in database. Run seed_products first.")
            return

        # Bulk index
        actions = []
        for p in products:
            actions.append({"index": {"_index": INDEX, "_id": p.id}})
            actions.append({
                "id": p.id,
                "name": p.name,
                "brand": p.brand,
                "category": p.category,
                "shade": p.shade,
                "price": float(p.price),
                "stock": p.stock,
                "image_url": p.image_url,
                "description": p.description,
            })

        await es.bulk(body=actions, refresh=True)
        print(f"Indexed {len(products)} products into Elasticsearch.")

    finally:
        await es.close()


if __name__ == "__main__":
    asyncio.run(index_all())
