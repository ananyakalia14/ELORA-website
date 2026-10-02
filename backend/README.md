# OmniMart — Real-Time Enterprise E-Commerce Backend

Cosmetic e-commerce backend with PostgreSQL, Redis, Elasticsearch, CDC streaming via Kafka, and Microsoft Fabric integration.

## Quick Start

```bash
# 1. Start infrastructure
docker-compose up -d

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Seed products into PostgreSQL
python -m scripts.seed_products

# 4. Index products into Elasticsearch
python -m scripts.index_products

# 5. Start the API
uvicorn app.main:app --reload --port 8000

# 6. (Optional) Register Debezium CDC connector
curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d @connectors/debezium-postgres.json
```

## API Docs

Once running, visit: **http://localhost:8000/docs** (Swagger UI)

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login (returns JWT) |
| GET | `/auth/me` | Yes | Current user profile |
| GET | `/products/` | No | List products (paginated) |
| GET | `/products/{id}` | No | Get product by ID |
| POST | `/products/search` | No | Full-text search with filters |
| GET | `/products/suggest/{prefix}` | No | Autocomplete |
| GET | `/cart/` | Yes | View cart |
| POST | `/cart/add` | Yes | Add item to cart |
| PUT | `/cart/update` | Yes | Update item quantity |
| DELETE | `/cart/{product_id}` | Yes | Remove item |
| DELETE | `/cart/` | Yes | Clear cart |
| POST | `/checkout` | Yes | Place order |
| GET | `/orders` | Yes | Order history |
| POST | `/events` | No | Log clickstream event |
| GET | `/recommendations/` | Yes | Personalized recommendations |
| GET | `/health` | No | Health check |

## Architecture

```
FastAPI monolith → PostgreSQL (orders/users)
                 → Redis (cart/sessions/locks)
                 → Elasticsearch (product search)
                 → Debezium CDC → Kafka → Fabric
```

## Tech Stack

- **API**: FastAPI + async SQLAlchemy + asyncpg
- **Auth**: JWT (python-jose) + bcrypt (passlib)
- **Database**: PostgreSQL 16
- **Cache/Cart**: Redis 7
- **Search**: Elasticsearch 8
- **Streaming**: Redpanda (Kafka-compatible) + Debezium CDC
- **Infra**: Docker Compose
