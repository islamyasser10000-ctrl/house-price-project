"""Application configuration, loaded from environment variables / .env file."""
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "House Price Prediction API"
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    model_path: str = "models/house_price.pkl"
    locations_path: str = "models/locations.json"

    # Comma-separated list of allowed origins, e.g. "http://localhost:5173,http://localhost:3000"
    cors_origins: str = "http://localhost:5173"

    log_level: str = "INFO"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def resolved_model_path(self) -> Path:
        return BACKEND_ROOT / self.model_path

    @property
    def resolved_locations_path(self) -> Path:
        return BACKEND_ROOT / self.locations_path


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance, so the .env file is only parsed once."""
    return Settings()
