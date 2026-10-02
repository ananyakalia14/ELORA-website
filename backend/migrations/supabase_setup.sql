-- ==============================================================================
-- OmniMart / Élora — Supabase Complete Schema Initialization
-- Run this directly inside your Supabase project: SQL Editor -> New query -> Run
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    role          VARCHAR(20) NOT NULL DEFAULT 'customer', -- 'customer', 'admin'
    skin_type     VARCHAR(50),                             -- 'oily', 'dry', 'combination', 'sensitive', 'normal'
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PRODUCTS TABLE (Fully aligned with Élora Luxury Catalog & SQLAlchemy model)
CREATE TABLE IF NOT EXISTS products (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(500) NOT NULL,
    brand           VARCHAR(255) NOT NULL,
    category        VARCHAR(100) NOT NULL,
    shade           VARCHAR(100),
    price           NUMERIC(10,2) NOT NULL CHECK (price > 0),
    stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url       TEXT,
    description     TEXT,
    slug            VARCHAR(100) UNIQUE,
    subtitle        VARCHAR(255),
    volume          VARCHAR(100),
    rating          NUMERIC(3,2),
    reviews_count   INTEGER DEFAULT 0,
    badge           VARCHAR(100),
    is_hero         BOOLEAN NOT NULL DEFAULT FALSE,
    secondary_image TEXT,
    details         JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status     VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
    total      NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id         SERIAL PRIMARY KEY,
    order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity   INTEGER NOT NULL CHECK (quantity > 0),
    price      NUMERIC(10,2) NOT NULL CHECK (price > 0)
);

-- 5. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id         SERIAL PRIMARY KEY,
    order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    method     VARCHAR(50) NOT NULL, -- 'card', 'upi', 'cod'
    status     VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    amount     NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CLICKSTREAM EVENTS TABLE (Real-time analytics & CDC for Fabric)
CREATE TABLE IF NOT EXISTS clickstream_events (
    id         BIGSERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- 'page_view', 'add_to_cart', 'search_action', 'wishlist', 'remove_from_cart'
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    metadata   JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_clickstream_user_id ON clickstream_events(user_id);
CREATE INDEX IF NOT EXISTS idx_clickstream_created_at ON clickstream_events(created_at);
CREATE INDEX IF NOT EXISTS idx_clickstream_event_type ON clickstream_events(event_type);

-- 8. DEFAULT ADMIN SEED
-- Email: admin@elora.com | Password: EloraAdmin2026!
INSERT INTO users (email, password_hash, name, role)
VALUES (
    'admin@elora.com',
    '$2b$12$aYoEbXWU1i1Y9woIX828Gu4TTUXFBewhqe3VsvUzZq.xYRyX/sT.G',
    'Élora Admin',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- 9. (OPTIONAL) Enable Supabase Realtime for instant frontend synchronization
-- ALTER PUBLICATION supabase_realtime ADD TABLE products, orders, clickstream_events;
