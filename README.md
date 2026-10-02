# Élora — Luxury Boutique E-Commerce Monorepo

Enterprise cosmetic e-commerce platform combining a boutique editorial React frontend with an asynchronous FastAPI backend, PostgreSQL, Redis, Elasticsearch, and real-time streaming analytics.

---

## 📁 Repository Structure

```
├── frontend/             # Élora Client (React 19 + Vite 8 + Three.js)
│   ├── src/              # Components, styles, 3D canvases, and app logic
│   ├── public/           # Static assets, media, editorial images
│   ├── package.json      # Frontend dependencies & scripts
│   └── vite.config.js    # Vite configuration
│
├── backend/              # OmniMart API (FastAPI + Async SQLAlchemy)
│   ├── app/              # FastAPI application (routers, models, services)
│   ├── connectors/       # Debezium CDC Postgres connector configs
│   ├── data/             # Product catalogs & seed data
│   ├── docs/             # Architecture & Microsoft Fabric guides
│   ├── fabric/           # Fabric KQL queries, Lakehouse notebooks, & ALS ML
│   ├── migrations/       # SQL database migrations
│   ├── scripts/          # Product seeding, indexing & embedding sync scripts
│   ├── docker-compose.yml# Local infrastructure (Postgres, Redis, ES, Redpanda)
│   └── requirements.txt  # Python backend dependencies
│
└── README.md             # Project documentation
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# (Optional) Start local Docker infrastructure (Redis, Elasticsearch, etc.)
docker-compose up -d

# Install Python dependencies
pip install -r requirements.txt

# Start the API server
uvicorn app.main:app --reload --port 8000
```

* API Docs (Swagger UI): **http://127.0.0.1:8000/docs**
* Health Check: **http://127.0.0.1:8000/health**

### 2. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

* Web App: **http://localhost:5173/**

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite 8, Three.js (3D product shaders/anatomy), Lucide Icons
* **Backend**: FastAPI, Async SQLAlchemy, Asyncpg, Pydantic v2
* **Database & Cache**: PostgreSQL (Supabase / local), Redis 7
* **Search Engine**: Elasticsearch 8 (full-text search, fuzzy prefix autocomplete)
* **Real-Time & Analytics**: Debezium CDC, Redpanda (Kafka), Microsoft Fabric Lakehouse (KQL + Spark)
