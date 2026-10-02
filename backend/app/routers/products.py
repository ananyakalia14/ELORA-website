"""Products router — CRUD + Elasticsearch search + autocomplete."""

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import Product
from app.schemas import ProductOut, ProductSearch
from app.services import search_service

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=list[ProductOut])
async def list_products(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
):
    """List products from PG (no search query)."""
    offset = (page - 1) * size
    result = await db.execute(
        select(Product).order_by(Product.id).offset(offset).limit(size)
    )
    return result.scalars().all()


@router.get("/search", response_model=list[ProductOut])
async def search_products_get(
    request: Request,
    db: AsyncSession = Depends(get_db),
    query: str = Query("", alias="q"),
    category: str | None = None,
    brand: str | None = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
):
    """GET-based search for frontend convenience."""
    return await _do_search(request, db, ProductSearch(query=query, category=category, brand=brand, page=page, size=size))


@router.post("/search", response_model=list[ProductOut])
async def search_products(body: ProductSearch, request: Request, db: AsyncSession = Depends(get_db)):
    """Full-text search via Elasticsearch with DB fallback."""
    return await _do_search(request, db, body)


async def _do_search(request: Request, db: AsyncSession, body: ProductSearch) -> list[ProductOut]:
    try:
        if hasattr(request.app.state, "es"):
            results = await search_service.search_products(
                request.app.state.es,
                query=body.query,
                brand=body.brand,
                category=body.category,
                shade=body.shade,
                min_price=body.min_price,
                max_price=body.max_price,
                page=body.page,
                size=body.size,
            )
            if results:
                return results
    except Exception:
        pass

    # Database search fallback
    stmt = select(Product)
    if body.query:
        search_term = f"%{body.query}%"
        stmt = stmt.where(
            (Product.name.ilike(search_term))
            | (Product.description.ilike(search_term))
            | (Product.category.ilike(search_term))
            | (Product.brand.ilike(search_term))
        )
    if body.category:
        stmt = stmt.where(Product.category.ilike(f"%{body.category}%"))
    if body.brand:
        stmt = stmt.where(Product.brand.ilike(f"%{body.brand}%"))
    if body.min_price is not None:
        stmt = stmt.where(Product.price >= body.min_price)
    if body.max_price is not None:
        stmt = stmt.where(Product.price <= body.max_price)

    offset = (body.page - 1) * body.size
    stmt = stmt.order_by(Product.id).offset(offset).limit(body.size)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/suggest/{prefix}")
async def autocomplete(prefix: str, request: Request, db: AsyncSession = Depends(get_db)):
    """Autocomplete product names with DB fallback."""
    try:
        if hasattr(request.app.state, "es"):
            suggestions = await search_service.autocomplete(request.app.state.es, prefix)
            if suggestions:
                return {"suggestions": suggestions}
    except Exception:
        pass

    result = await db.execute(
        select(Product.name).where(Product.name.ilike(f"%{prefix}%")).limit(5)
    )
    return {"suggestions": [row[0] for row in result.all()]}


@router.get("/{identifier}", response_model=ProductOut)
async def get_product(identifier: str, db: AsyncSession = Depends(get_db)):
    """Fetch product by integer id or string slug (e.g. 'hero-serum')."""
    if identifier.isdigit():
        pid = int(identifier)
        stmt = select(Product).where((Product.id == pid) | (Product.slug == identifier))
    else:
        stmt = select(Product).where(Product.slug == identifier)

    result = await db.execute(stmt)
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
