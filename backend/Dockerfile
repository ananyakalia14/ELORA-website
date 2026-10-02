# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /build

COPY ELORA-website/package*.json ./
RUN npm ci

COPY ELORA-website/ ./
RUN npm run build

# Stage 2: Python FastAPI Backend
FROM python:3.11-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code, seed data, and scripts
COPY app/ ./app/
COPY scripts/ ./scripts/
COPY data/ ./data/
COPY migrations/ ./migrations/

# Copy built frontend static dist and public files
COPY --from=frontend-builder /build/dist ./ELORA-website/dist
COPY --from=frontend-builder /build/public ./ELORA-website/public

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
