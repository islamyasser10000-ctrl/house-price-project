"""Loads the exported model artifact once and exposes a predict() method.

The model is loaded once at application startup (see app/main.py's lifespan handler)
rather than on every request, since deserializing a pickle is relatively expensive.
"""
import json
import logging
from pathlib import Path
from typing import Any

import joblib

from app.schemas.prediction import PredictionRequest
from app.services.preprocessing import build_input_dataframe

logger = logging.getLogger(__name__)


class ModelNotLoadedError(RuntimeError):
    """Raised when a prediction is requested before the model has been loaded."""


class ModelService:
    def __init__(self, model_path: Path, locations_path: Path):
        self._model_path = model_path
        self._locations_path = locations_path
        self._model: Any | None = None
        self._allowed_locations: set[str] = set()

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def load(self) -> None:
        if not self._model_path.exists():
            raise FileNotFoundError(
                f"Model file not found at {self._model_path}. "
                "Copy house_price.pkl from the notebook's output into backend/models/."
            )
        logger.info("Loading model from %s", self._model_path)
        self._model = joblib.load(self._model_path)

        if self._locations_path.exists():
            with open(self._locations_path) as f:
                self._allowed_locations = set(json.load(f))
            logger.info("Loaded %d allowed locations", len(self._allowed_locations))
        else:
            logger.warning(
                "Locations file not found at %s — all locations will map to 'other'.",
                self._locations_path,
            )

    def predict(self, request: PredictionRequest) -> float:
        if self._model is None:
            raise ModelNotLoadedError("Model has not been loaded yet.")

        input_df = build_input_dataframe(request, self._allowed_locations)
        prediction = self._model.predict(input_df)
        return float(prediction[0])
