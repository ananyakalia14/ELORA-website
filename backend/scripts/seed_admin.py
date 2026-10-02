"""Seed the admin user into PostgreSQL.
Usage: python -m scripts.seed_admin"""

import asyncio

from passlib.context import CryptContext
from sqlalchemy import select, text

from app.db import async_session
from app.models import User

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Default admin credentials
ADMIN_EMAIL = "admin@elora.com"
ADMIN_PASSWORD = "EloraAdmin2026!"
ADMIN_NAME = "Élora Admin"


async def seed_admin():
    async with async_session() as db:
        # Ensure role column exists (safe for existing DBs)
        try:
            await db.execute(
                text("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'customer'")
            )
            await db.commit()
        except Exception:
            await db.rollback()

        # Check if admin already exists
        result = await db.execute(select(User).where(User.email == ADMIN_EMAIL))
        existing = result.scalar_one_or_none()

        if existing:
            # Update to admin role if not already
            if existing.role != "admin":
                existing.role = "admin"
                await db.commit()
                print(f"Updated existing user '{ADMIN_EMAIL}' to admin role.")
            else:
                print(f"Admin user '{ADMIN_EMAIL}' already exists. Skipping.")
            return

        admin = User(
            email=ADMIN_EMAIL,
            password_hash=pwd_ctx.hash(ADMIN_PASSWORD),
            name=ADMIN_NAME,
            role="admin",
        )
        db.add(admin)
        await db.commit()
        print(f"Admin user seeded successfully!")
        print(f"  Email:    {ADMIN_EMAIL}")
        print(f"  Password: {ADMIN_PASSWORD}")
        print(f"  Role:     admin")


if __name__ == "__main__":
    asyncio.run(seed_admin())
