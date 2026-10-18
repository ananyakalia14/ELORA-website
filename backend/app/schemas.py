"""Pydantic request/response schemas — all in one file.
ponytail: split when this exceeds ~300 lines."""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ── Auth ──────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: str = Field(min_length=3)
    password: str = Field(min_length=6)
    name: str = Field(min_length=1)
    skin_type: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    role: str = "customer"
    skin_type: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str = "customer"


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

class CheckoutItem(BaseModel):
    id: str | int | None = None
    product_id: str | int | None = None
    name: str | None = None
    price: float | None = None
    quantity: int = 1
    image: str | None = None
    variantName: str | None = None


class CheckoutRequest(BaseModel):
    payment_method: str = "card"  # card, klarna, cod
    items: list[CheckoutItem] = []
    email: str | None = None
    firstName: str | None = None
    lastName: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    zipCode: str | None = None
    country: str | None = None
    phone: str | None = None
    shippingMethod: str | None = "standard"
    order_number: str | None = None


class OrderItemOut(BaseModel):
    id: int | None = None
    product_id: int | None = None
    name: str | None = None
    quantity: int
    price: float
    image: str | None = None
    variantName: str | None = None
    shade: str | None = None

    model_config = {"from_attributes": True}


class TrackingMilestone(BaseModel):
    title: str
    detail: str
    timestamp: str
    completed: bool
    current: bool


class OrderTrackingInfo(BaseModel):
    order_id: int | str
    order_number: str
    tracking_number: str
    carrier: str
    status: str
    created_at: datetime
    estimated_delivery: str
    shipping_address: str | None = None
    customer_name: str | None = None
    customer_email: str | None = None
    total: float
    items: list[OrderItemOut] = []
    milestones: list[TrackingMilestone] = []


class OrderOut(BaseModel):
    id: int
    order_number: str | None = None
    tracking_number: str | None = None
    carrier: str | None = "Élora White-Glove Atelier Courier"
    estimated_delivery: str | None = None
    user_id: int
    status: str
    total: float
    created_at: datetime
    shipping_address: str | None = None
    customer_name: str | None = None
    items: list[OrderItemOut] = []

    model_config = {"from_attributes": True}


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


# ── Admin Dashboard ──────────────────────────────────────────────────────

class AdminDashboardStats(BaseModel):
    total_users: int
    total_products: int
    total_orders: int
    total_revenue: float
    pending_orders: int
    confirmed_orders: int
    shipped_orders: int
    delivered_orders: int
    cancelled_orders: int
    low_stock_count: int
    recent_signups_24h: int
    avg_order_value: float


class AdminUserOut(BaseModel):
    id: int
    email: str
    name: str
    role: str
    skin_type: str | None
    created_at: datetime
    order_count: int = 0
    total_spent: float = 0.0

    model_config = {"from_attributes": True}


class AdminUserUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    skin_type: str | None = None


class AdminProductCreate(BaseModel):
    name: str
    brand: str = "Élora"
    category: str
    shade: str | None = None
    price: float = Field(gt=0)
    stock: int = Field(ge=0, default=0)
    image_url: str | None = None
    description: str | None = None
    slug: str | None = None
    subtitle: str | None = None
    volume: str | None = None
    badge: str | None = None
    is_hero: bool = False


class AdminProductUpdate(BaseModel):
    name: str | None = None
    brand: str | None = None
    category: str | None = None
    shade: str | None = None
    price: float | None = Field(default=None, gt=0)
    stock: int | None = Field(default=None, ge=0)
    image_url: str | None = None
    description: str | None = None
    slug: str | None = None
    subtitle: str | None = None
    volume: str | None = None
    badge: str | None = None
    is_hero: bool | None = None


class AdminOrderUpdate(BaseModel):
    status: str  # pending, confirmed, shipped, delivered, cancelled


class RevenuePoint(BaseModel):
    date: str
    revenue: float
    order_count: int
