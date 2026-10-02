"""Seed realistic customer accounts and orders for the Élora Admin Dashboard."""

import asyncio
from datetime import datetime, timedelta, timezone
import random

from passlib.context import CryptContext
from sqlalchemy import select

from app.db import async_session
from app.models import Order, OrderItem, Payment, Product, User

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

DEMO_USERS = [
    {
        "name": "Camille Laurent",
        "email": "camille.laurent@paris.fr",
        "role": "customer",
        "skin_type": "combination",
    },
    {
        "name": "Sienna Vance",
        "email": "sienna.vance@vogue.co.uk",
        "role": "customer",
        "skin_type": "dry",
    },
    {
        "name": "Aria Chen",
        "email": "aria.chen@elitemodel.com",
        "role": "customer",
        "skin_type": "sensitive",
    },
    {
        "name": "Elena Rostova",
        "email": "elena.rostova@milano.it",
        "role": "customer",
        "skin_type": "normal",
    },
    {
        "name": "Marcus Sterling",
        "email": "marcus.sterling@gentleman.org",
        "role": "customer",
        "skin_type": "oily",
    },
]


async def seed_demo():
    async with async_session() as db:
        # Get some products to create orders with
        prod_result = await db.execute(select(Product).limit(15))
        products = prod_result.scalars().all()
        if not products:
            print("No products found to seed orders with!")
            return

        created_users = []
        for u in DEMO_USERS:
            existing = (await db.execute(select(User).where(User.email == u["email"]))).scalar_one_or_none()
            if not existing:
                new_user = User(
                    name=u["name"],
                    email=u["email"],
                    password_hash=pwd_ctx.hash("Customer123!"),
                    role=u["role"],
                    skin_type=u["skin_type"],
                )
                db.add(new_user)
                await db.flush()
                created_users.append(new_user)
            else:
                created_users.append(existing)

        # Check existing orders
        orders_exist = (await db.execute(select(Order).limit(1))).scalar_one_or_none()
        if not orders_exist:
            statuses = ["delivered", "delivered", "shipped", "confirmed", "pending", "pending"]
            now = datetime.now(timezone.utc)

            for i, status in enumerate(statuses):
                user = created_users[i % len(created_users)]
                chosen_products = random.sample(products, k=random.randint(1, 3))
                total = sum(float(p.price) for p in chosen_products)

                order_date = now - timedelta(days=random.randint(0, 14), hours=random.randint(1, 23))

                order = Order(
                    user_id=user.id,
                    status=status,
                    total=total,
                    created_at=order_date,
                )
                db.add(order)
                await db.flush()

                for p in chosen_products:
                    item = OrderItem(
                        order_id=order.id,
                        product_id=p.id,
                        quantity=1,
                        price=float(p.price),
                    )
                    db.add(item)

                payment = Payment(
                    order_id=order.id,
                    amount=total,
                    method="stripe",
                    status="succeeded" if status != "cancelled" else "failed",
                )
                db.add(payment)

            await db.commit()
            print(f"Seeded {len(created_users)} demo customers and {len(statuses)} orders.")
        else:
            print("Orders already exist. Skipping demo orders.")


if __name__ == "__main__":
    asyncio.run(seed_demo())
