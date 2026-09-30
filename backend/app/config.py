"""OmniMart configuration — pydantic-settings reads .env automatically."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Postgres
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

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
