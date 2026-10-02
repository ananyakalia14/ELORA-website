"""Recommendations router — serve pre-computed ALS recs + real-time offer."""

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import Product, User
from app.routers.auth import get_current_user
from app.schemas import ProductOut, RecommendationOut
from app.services import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("/", response_model=RecommendationOut)
async def get_recommendations(
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    cart_value: float = Query(0.0, description="Current cart total for offer scoring"),
    time_on_page: float = Query(0.0, description="Seconds on current page"),
):
    """Return personalized product recommendations + optional real-time offer."""
    redis = request.app.state.redis

    # Get recommended product IDs from ALS embeddings
    rec_ids = await recommendation_service.get_recommendations(redis, user.id)

    if rec_ids:
        result = await db.execute(select(Product).where(Product.id.in_(rec_ids)))
        products = result.scalars().all()
        # Preserve ranking order
        product_map = {p.id: p for p in products}
        ordered = [product_map[pid] for pid in rec_ids if pid in product_map]
    else:
        # ponytail: fallback to popular products when no embeddings yet
        result = await db.execute(select(Product).order_by(Product.id).limit(10))
        ordered = result.scalars().all()

    # Compute offer
    # ponytail: user_score is average recommendation score, simplified to 0.5 default
    offer = recommendation_service.compute_offer(
        user_score=0.5, cart_value=cart_value, time_on_page=time_on_page
    )

    return RecommendationOut(products=ordered, offer=offer)
