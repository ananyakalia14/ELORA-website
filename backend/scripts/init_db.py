"""Initialize database schema from SQLAlchemy models.
Usage: python -m scripts.init_db
"""

import asyncio
from sqlalchemy import text
from app.db import engine
from app.models import Base


async def init_db():
    print("Connecting to database...")
    async with engine.begin() as conn:
        print("Creating tables if they do not exist...")
        await conn.run_sync(Base.metadata.create_all)
        
        # Ensure role column exists on users (safety migration)
        try:
            await conn.execute(
                text("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'customer'")
            )
        except Exception:
            pass

    print("Database tables initialized successfully!")


if __name__ == "__main__":
    asyncio.run(init_db())
