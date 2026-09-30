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
from app.routers import auth, cart, orders, products, recommendations

# Detect frontend directory whether run from ELORA-website/backend or repo root
_base = Path(__file__).resolve().parent.parent
if (_base.parent / "src").exists():
    FRONTEND_DIR = _base.parent
elif (_base / "ELORA-website").exists():
    FRONTEND_DIR = _base / "ELORA-website"
else:
    FRONTEND_DIR = _base

FRONTEND_DIST = FRONTEND_DIR / "dist"
FRONTEND_PUBLIC = FRONTEND_DIR / "public"


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
    allow_origins=["*"],  # ponytail: lock down in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        "message": "Élora Omnimart API is running. Frontend draft has not been built to dist yet.",
        "docs_url": "/docs",
        "health_url": "/health",
    }
