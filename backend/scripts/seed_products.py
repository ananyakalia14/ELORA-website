"""Seed cosmetic & Élora products into PostgreSQL from JSON fixtures.
Usage: python -m scripts.seed_products"""

import asyncio
import json
from pathlib import Path

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import async_session, engine
from app.models import Product

ELORA_DATA_FILE = Path(__file__).parent.parent / "data" / "elora_products.json"
COSMETIC_DATA_FILE = Path(__file__).parent.parent / "data" / "cosmetic_products.json"


async def seed():
    async with async_session() as db:
        # Check if already seeded
        result = await db.execute(text("SELECT COUNT(*) FROM products"))
        count = result.scalar()
        if count > 0:
            print(f"Database already contains {count} products. Skipping seed.")
            return

        total_inserted = 0

        # 1. Seed Élora products
        if ELORA_DATA_FILE.exists():
            elora_products = json.loads(ELORA_DATA_FILE.read_text(encoding="utf-8"))
            print(f"Seeding {len(elora_products)} Élora brand products...")
            for p in elora_products:
                details = {
                    "variants": p.get("variants", []),
                    "key_actives": p.get("key_actives", []),
                    "clinical_metrics": p.get("clinical_metrics", []),
                    "texture": p.get("texture"),
                    "ritual": p.get("ritual"),
                }
                product = Product(
                    id=p.get("id"),
                    slug=p.get("slug"),
                    name=p["name"],
                    brand=p.get("brand", "Élora"),
                    category=p["category"],
                    shade=p.get("shade"),
                    subtitle=p.get("subtitle"),
                    price=float(p["price"]),
                    stock=int(p.get("stock", 100)),
                    volume=p.get("volume"),
                    rating=float(p["rating"]) if p.get("rating") else None,
                    reviews_count=int(p.get("reviews_count", 0)),
                    badge=p.get("badge"),
                    is_hero=bool(p.get("is_hero", False)),
                    image_url=p.get("image_url"),
                    secondary_image=p.get("secondary_image"),
                    description=p.get("description"),
                    details=details,
                )
                db.add(product)
                total_inserted += 1

            await db.commit()
            # Advance the postgres sequence past the inserted IDs
            await db.execute(text("SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))"))
            await db.commit()

        # 2. Seed generic cosmetic products
        if COSMETIC_DATA_FILE.exists():
            cosmetic_products = json.loads(COSMETIC_DATA_FILE.read_text(encoding="utf-8"))
            print(f"Seeding {len(cosmetic_products)} general cosmetic products...")
            for p in cosmetic_products:
                product = Product(
                    name=p["name"],
                    brand=p["brand"],
                    category=p["category"],
                    shade=p.get("shade"),
                    price=float(p["price"]),
                    stock=int(p.get("stock", 50)),
                    image_url=p.get("image_url"),
                    description=p.get("description"),
                )
                db.add(product)
                total_inserted += 1

            await db.commit()

        print(f"Done — total {total_inserted} products seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
