"""OmniMart configuration — pydantic-settings reads .env automatically."""

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Direct cloud database URL (e.g. from Neon, Supabase, Railway, Render)
    database_url_raw: str | None = Field(default=None, validation_alias="DATABASE_URL")

    # Postgres individual parameters (fallback)
    postgres_user: str = "omnimart"
    postgres_password: str = "omnimart_dev"
    postgres_db: str = "omnimart"
    postgres_host: str = "localhost"
    postgres_port: int = 5432

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Elasticsearch
    elasticsearch_url: str = "http://localhost:9200"

    # Kafka
    kafka_bootstrap: str = "localhost:19092"

    # JWT
    jwt_secret: str = "dev-secret-key-change-in-prod"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    # CORS
    cors_origins: str = Field(
        default="https://elora-sigma-seven.vercel.app,http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000",
        validation_alias="CORS_ORIGINS",
    )

    @property
    def allowed_cors_origins(self) -> list[str]:
        defaults = [
            "https://elora-sigma-seven.vercel.app",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
        ]
        if self.cors_origins:
            for item in self.cors_origins.split(","):
                clean = item.strip().rstrip("/")
                if clean and clean not in defaults:
                    defaults.append(clean)
        return defaults

    @property
    def database_url(self) -> str:
        if self.database_url_raw:
            url = self.database_url_raw
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            return url

        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
