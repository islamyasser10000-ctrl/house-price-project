"""FastAPI application entrypoint.

Run with:  uvicorn app.main:app --reload
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.prediction import router as prediction_router
from app.core.config import get_settings
from app.services.inference import ModelService
from app.utils.logging_config import configure_logging

settings = get_settings()
configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: load the model once and attach it to app.state so routes can reuse it.
    model_service = ModelService(
        model_path=settings.resolved_model_path,
        locations_path=settings.resolved_locations_path,
    )
    try:
        model_service.load()
    except FileNotFoundError as exc:
        # Don't crash the whole app — /health will report model_loaded=false and
        # /predict will return a 503 until the model file is put in place.
        logger.error(str(exc))

    app.state.model_service = model_service
    yield
    # Shutdown: nothing to clean up for an in-memory model.


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router)
