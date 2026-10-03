"""OmniMart — FastAPI entry point.
ponytail: one file, lifespan manages Redis + ES connections."""

from contextlib import asynccontextmanager
from pathlib import Path

import redis.asyncio as aioredis
from elasticsearch import AsyncElasticsearch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers import admin, auth, cart, orders, products, recommendations

# Detect frontend directory whether run from backend, monorepo root, or legacy layout
_base = Path(__file__).resolve().parent.parent
if (_base / "frontend").exists():
    FRONTEND_DIR = _base / "frontend"
elif (_base.parent / "frontend").exists():
    FRONTEND_DIR = _base.parent / "frontend"
elif (_base.parent / "src").exists():
    FRONTEND_DIR = _base.parent
elif (_base / "ELORA-website").exists():
    FRONTEND_DIR = _base / "ELORA-website"
else:
    FRONTEND_DIR = _base

FRONTEND_DIST = FRONTEND_DIR / "dist"
FRONTEND_PUBLIC = FRONTEND_DIR / "public"

print(f"[Élora] Frontend dir:    {FRONTEND_DIR}  (exists={FRONTEND_DIR.exists()})")
print(f"[Élora] Frontend dist:   {FRONTEND_DIST}  (exists={FRONTEND_DIST.exists()})")
print(f"[Élora] Frontend public: {FRONTEND_PUBLIC}  (exists={FRONTEND_PUBLIC.exists()})")
print(f"[Élora] index.html:      {FRONTEND_DIST / 'index.html'}  (exists={(FRONTEND_DIST / 'index.html').exists()})")



@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: connect Redis + ES with graceful fallback for local dev. Shutdown: close them."""
    try:
        app.state.redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    except Exception:
        app.state.redis = None

    try:
        app.state.es = AsyncElasticsearch(settings.elasticsearch_url)
        from app.services.search_service import ensure_index
        await ensure_index(app.state.es)
    except Exception:
        app.state.es = None

    # Auto-create all tables & auto-seed admin on startup
    try:
        from app.db import async_session, engine
        from app.models import Base, User, Product
        from sqlalchemy import select, text
        from passlib.context import CryptContext

        # 1. Ensure all database tables exist
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        # 2. Ensure role column & seed admin
        pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
        async with async_session() as db:
            try:
                await db.execute(
                    text("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'customer'")
                )
                await db.commit()
            except Exception:
                await db.rollback()

            result = await db.execute(select(User).where(User.email == "admin@elora.com"))
            if not result.scalar_one_or_none():
                admin_user = User(
                    email="admin@elora.com",
                    password_hash=pwd_ctx.hash("EloraAdmin2026!"),
                    name="Élora Admin",
                    role="admin",
                )
                db.add(admin_user)
                await db.commit()
    except Exception as e:
        print(f"[Startup Warning] Database initialization: {e}")

    yield

    if getattr(app.state, "redis", None):
        try:
            await app.state.redis.close()
        except Exception:
            pass
    if getattr(app.state, "es", None):
        try:
            await app.state.es.close()
        except Exception:
            pass


app = FastAPI(
    title="Élora Omnimart API",
    description="Luxury cosmetic e-commerce backend — real-time enterprise data engine",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(recommendations.router)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "frontend_built": (FRONTEND_DIST / "index.html").exists(),
        "redis_connected": getattr(app.state, "redis", None) is not None,
        "elasticsearch_connected": getattr(app.state, "es", None) is not None,
    }


# ── Frontend Static Assets & SPA Serving ─────────────────────────────────

if (FRONTEND_PUBLIC / "images").exists():
    app.mount("/images", StaticFiles(directory=str(FRONTEND_PUBLIC / "images")), name="frontend-images")

if (FRONTEND_PUBLIC / "videos").exists():
    app.mount("/videos", StaticFiles(directory=str(FRONTEND_PUBLIC / "videos")), name="frontend-videos")

if (FRONTEND_DIST / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="frontend-assets")


@app.get("/favicon.ico", include_in_schema=False)
async def favicon_ico():
    for fav in [FRONTEND_PUBLIC / "favicon.ico", FRONTEND_DIST / "favicon.ico"]:
        if fav.exists():
            return FileResponse(fav)
    return {"status": "not found"}


@app.get("/favicon.svg", include_in_schema=False)
async def favicon_svg():
    for fav in [FRONTEND_PUBLIC / "favicon.svg", FRONTEND_DIST / "favicon.svg"]:
        if fav.exists():
            return FileResponse(fav)
    return {"status": "not found"}


@app.get("/", include_in_schema=False)
async def root():
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {
        "message": "Élora Omnimart API is running.",
        "docs_url": "/docs",
        "health_url": "/health",
    }


@app.get("/{full_path:path}", include_in_schema=False)
async def catch_all(full_path: str):
    # 1. If physical static file exists in dist or public, serve it
    dist_file = FRONTEND_DIST / full_path
    if dist_file.is_file():
        return FileResponse(dist_file)

    public_file = FRONTEND_PUBLIC / full_path
    if public_file.is_file():
        return FileResponse(public_file)

    # 2. Otherwise serve frontend index.html for client-side routing
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return FileResponse(index_file)

    return {
        "message": f"Resource /{full_path} not found.",
        "docs_url": "/docs",
        "health_url": "/health",
    }
