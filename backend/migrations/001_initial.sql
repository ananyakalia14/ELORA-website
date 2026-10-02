-- OmniMart Initial Schema
-- ponytail: one migration file; add Alembic when schema changes become frequent

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    role        VARCHAR(20) NOT NULL DEFAULT 'customer',  -- customer, admin
    skin_type   VARCHAR(50),  -- oily, dry, combination, sensitive, normal
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(500) NOT NULL,
    brand       VARCHAR(255) NOT NULL,
    category    VARCHAR(100) NOT NULL,  -- foundation, lipstick, skincare, eyeshadow, etc.
    shade       VARCHAR(100),
    price       NUMERIC(10,2) NOT NULL CHECK (price > 0),
    stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url   TEXT,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    status      VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, confirmed, shipped, delivered, cancelled
    total       NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  INTEGER NOT NULL REFERENCES products(id),
    quantity    INTEGER NOT NULL CHECK (quantity > 0),
    price       NUMERIC(10,2) NOT NULL CHECK (price > 0)
);

CREATE TABLE payments (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER NOT NULL REFERENCES orders(id),
    method      VARCHAR(50) NOT NULL,  -- card, upi, cod
    status      VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, completed, failed, refunded
    amount      NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ponytail: clickstream in PG for CDC pickup; skip Cassandra until write throughput > 50k events/sec
CREATE TABLE clickstream_events (
    id          BIGSERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id),
    event_type  VARCHAR(50) NOT NULL,  -- page_view, add_to_cart, search_action, wishlist, remove_from_cart
    product_id  INTEGER REFERENCES products(id),
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_clickstream_user_id ON clickstream_events(user_id);
CREATE INDEX idx_clickstream_created_at ON clickstream_events(created_at);
CREATE INDEX idx_clickstream_event_type ON clickstream_events(event_type);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);

-- Publication for Debezium CDC
ALTER SYSTEM SET wal_level = 'logical';
CREATE PUBLICATION omnimart_pub FOR TABLE users, products, orders, order_items, payments, clickstream_events;
