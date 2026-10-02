# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /build

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Python FastAPI Backend
FROM python:3.11-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code, seed data, and scripts
COPY backend/app/ ./app/
COPY backend/scripts/ ./scripts/
COPY backend/data/ ./data/
COPY backend/migrations/ ./migrations/

# Copy built frontend static dist and public files
COPY --from=frontend-builder /build/dist ./frontend/dist
COPY --from=frontend-builder /build/public ./frontend/public

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
