"""Pydantic request/response schemas — all in one file.
ponytail: split when this exceeds ~300 lines."""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ── Auth ──────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=1)
    skin_type: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    skin_type: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Products ──────────────────────────────────────────────────────────────

class ProductOut(BaseModel):
    id: int
    name: str
    brand: str
    category: str
    shade: str | None = None
    price: float
    stock: int
    image_url: str | None = None
    description: str | None = None
    slug: str | None = None
    subtitle: str | None = None
    volume: str | None = None
    rating: float | None = None
    reviews_count: int | None = None
    badge: str | None = None
    is_hero: bool = False
    secondary_image: str | None = None
    details: dict | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ProductSearch(BaseModel):
    query: str = ""
    brand: str | None = None
    category: str | None = None
    shade: str | None = None
    min_price: float | None = None
    max_price: float | None = None
    page: int = 1
    size: int = 20


# ── Cart ──────────────────────────────────────────────────────────────────

class CartItem(BaseModel):
    product_id: int | str
    quantity: int = Field(ge=1)


class CartOut(BaseModel):
    items: dict[str, int]  # {product_id: quantity}
    total: float = 0.0


# ── Orders ────────────────────────────────────────────────────────────────

class OrderItemOut(BaseModel):
    product_id: int
    quantity: int
    price: float

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: int
    user_id: int
    status: str
    total: float
    created_at: datetime
    items: list[OrderItemOut] = []

    model_config = {"from_attributes": True}


class CheckoutRequest(BaseModel):
    payment_method: str = "card"  # card, upi, cod


# ── Clickstream ───────────────────────────────────────────────────────────

class EventCreate(BaseModel):
    event_type: str  # page_view, add_to_cart, search_action, wishlist
    product_id: int | None = None
    metadata: dict = {}


# ── Recommendations ──────────────────────────────────────────────────────

class OfferOut(BaseModel):
    discount_pct: int
    expires_minutes: int


class RecommendationOut(BaseModel):
    products: list[ProductOut]
    offer: OfferOut | None = None
