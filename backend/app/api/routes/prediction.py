"""Prediction and health-check routes."""
import logging

from fastapi import APIRouter, HTTPException, Request

from app.schemas.prediction import HealthResponse, PredictionRequest, PredictionResponse
from app.services.inference import ModelNotLoadedError

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["health"])
def health(request: Request) -> HealthResponse:
    model_service = request.app.state.model_service
    return HealthResponse(status="ok", model_loaded=model_service.is_loaded)


@router.post("/predict", response_model=PredictionResponse, tags=["prediction"])
def predict(payload: PredictionRequest, request: Request) -> PredictionResponse:
    model_service = request.app.state.model_service
    try:
        predicted_price = model_service.predict(payload)
    except ModelNotLoadedError as exc:
        logger.error("Prediction attempted before model was loaded: %s", exc)
        raise HTTPException(status_code=503, detail="Model is not loaded yet. Try again shortly.") from exc
    except Exception as exc:  # noqa: BLE001 - convert any unexpected inference error into a 500
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="Failed to compute a prediction.") from exc

    return PredictionResponse(predicted_price=predicted_price)
