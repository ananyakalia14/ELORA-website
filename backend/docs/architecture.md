# OmniMart — Architecture Document

## Overview

OmniMart is a cosmetic e-commerce backend that combines a high-throughput FastAPI monolith with a Microsoft Fabric Medallion data estate and real-time ML-driven personalization.

## Design Principles

- **Ponytail philosophy**: Simplest solution that works. One service, not many. Stdlib before dependencies. No abstractions nobody asked for.
- **3 databases, 1 service**: PostgreSQL (ACID transactions), Redis (cache/locks/embeddings), Elasticsearch (product search). One FastAPI monolith serves all endpoints.
- **CDC-first streaming**: All operational changes flow to Kafka via Debezium WAL capture, then into Fabric for analytics.

## System Architecture

```
[ Browser ] ──► [ FastAPI Monolith :8000 ]
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
  [ PostgreSQL ]  [ Redis ]   [ Elasticsearch ]
  :5432           :6379        :9200
  Orders/Users    Cart/Locks   Product Search
  Clickstream     Sessions     Autocomplete
  Payments        Embeddings   Faceted Filters
        │
  [ Debezium :8083 ]
        │
  [ Redpanda/Kafka :19092 ]
        │                │
        ▼                ▼
  ┌─────────────────────────────────────────┐
  │          MICROSOFT FABRIC               │
  │                                         │
  │  ┌─ Real-Time Intelligence ──────────┐  │
  │  │  Eventstream → Eventhouse (KQL)   │  │
  │  │  Data Activator (alerts)          │  │
  │  └──────────────────────────────────-┘  │
  │                                         │
  │  ┌─ Medallion Lakehouse ─────────────┐  │
  │  │  Bronze: Raw CDC Delta tables     │  │
  │  │  Silver: Deduped, schema-enforced │  │
  │  │  Gold: Star schema (facts+dims)   │  │
  │  └──────────────────────────────────-┘  │
  │                                         │
  │  ┌─ ML Engine ──────────────────────-┐  │
  │  │  PySpark ALS (MLflow tracked)     │  │
  │  │  User/Item embeddings → Redis     │  │
  │  └──────────────────────────────────-┘  │
  │                                         │
  │  Power BI DirectLake Dashboards         │
  └─────────────────────────────────────────┘
```

## Component Details

### API Layer (FastAPI)

| Router | Endpoints | Backend |
|--------|-----------|---------|
| `/auth` | register, login, me | PostgreSQL + JWT |
| `/products` | list, get, search, autocomplete | PostgreSQL + Elasticsearch |
| `/cart` | get, add, update, remove, clear | Redis hash per user |
| `/checkout` | place order | PG transaction + Redis locks |
| `/orders` | history | PostgreSQL |
| `/events` | log clickstream | PostgreSQL (CDC pickup) |
| `/recommendations` | personalized recs + offers | Redis embeddings + dot-product |

### Database Roles

| Database | Role | Key Design Decisions |
|----------|------|---------------------|
| **PostgreSQL 16** | OLTP primary store | ACID orders, WAL-level=logical for CDC, `clickstream_events` for Debezium capture |
| **Redis 7** | Cache + coordination | Hash-per-user cart (7-day TTL), `SET NX` stock locks (30s TTL), ALS embedding vectors |
| **Elasticsearch 8** | Search engine | `multi_match` with fuzziness, `completion` suggester for autocomplete, keyword filters for brand/category/shade |

### CDC Pipeline

1. PostgreSQL WAL changes captured by **Debezium Connect**
2. Events published to **Redpanda** topics (`omnimart.public.{table}`)
3. **Fabric Eventstream** consumes topics
4. Clickstream routed to **Eventhouse (KQL)** for real-time queries
5. All topics land in **Bronze layer** as raw Delta tables

### Medallion Lakehouse

| Layer | Format | Transform Logic |
|-------|--------|----------------|
| **Bronze** | Raw Delta, append-only | Original CDC JSON preserved |
| **Silver** | Delta, schema-enforced | Deduplicated by key (row_number window), timestamp cast, SCD Type 1 upsert |
| **Gold** | Delta, star schema | `fact_orders`, `fact_clickstream`, `dim_user`, `dim_product`, `dim_date` |

### ML Recommendation Engine

- **Model**: PySpark ALS (implicit preferences) trained on Gold interaction data
- **Feedback signals**: purchase (5x), add_to_cart (3x), page_view (1x), log-dampened
- **Serving**: User/item embedding vectors exported to Redis, dot-product scoring in FastAPI at request time
- **Offers**: Simplified propensity score (weighted sum of user affinity, cart value, session urgency) → 10% discount if > 0.7 threshold
- **Tracking**: MLflow experiment tracking inside Fabric

### Power BI

- **Mode**: DirectLake (reads Gold Delta tables from OneLake — no import, no DirectQuery)
- **Pages**: Executive (revenue/AOV/volume), Real-Time (KQL tiles), Product (category/funnel)
- **RLS**: `WHERE seller_id = USERPRINCIPALNAME()` filter on semantic model

## Security

| Layer | Mechanism |
|-------|-----------|
| API auth | JWT (HS256) + bcrypt password hashing |
| CORS | Configured in FastAPI middleware (lock down origins in prod) |
| DB credentials | Environment variables via `.env` |
| Stock integrity | Redis distributed lock (`SET NX EX 30`) + PG transaction |
| Fabric RBAC | Workspace identity + role assignments |
| Power BI RLS | Row-level security on semantic model |

## Deployment

### Local Development

```bash
docker-compose up -d     # PG, Redis, ES, Redpanda, Debezium
pip install -r requirements.txt
python -m scripts.seed_products
python -m scripts.index_products
uvicorn app.main:app --reload --port 8000
```

### Register CDC Connector

```bash
curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d @connectors/debezium-postgres.json
```

### Fabric Notebooks

Run in order inside a Fabric workspace:
1. `fabric/notebooks/bronze_to_silver.py`
2. `fabric/notebooks/silver_to_gold.py`
3. `fabric/ml/train_als.py`

Orchestrate with a Fabric Data Factory pipeline (three chained notebook activities).

## What Was Intentionally Deferred

| Deferred | Upgrade path |
|----------|-------------|
| Cassandra for clickstream | Add when write throughput > 50k events/sec |
| Microservices split | Extract when a module needs independent scaling |
| SCD Type 2 dimensions | Add when historical tracking is required |
| Vector/semantic search | Add when BM25 + filters fail on search quality benchmarks |
| Neural recommendation model | Add when ALS recall is insufficient in A/B tests |
| Dedicated inference endpoint | Deploy when in-process scoring p99 > 100ms |
