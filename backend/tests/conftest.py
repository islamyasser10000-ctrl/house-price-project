"""Shared pytest fixtures.

Tests must run without the real, large trained model artifact present. Instead, we
train a tiny dummy pipeline with the exact same column structure the real notebook
produces, and inject it directly into app.state — this exercises the full
request -> preprocessing -> pipeline.predict() -> response path without depending on
Kaggle data or a multi-hundred-MB pickle being checked into the repo.
"""
from pathlib import Path

import pandas as pd
import pytest
from fastapi.testclient import TestClient
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from app.main import app
from app.services.inference import ModelService
from app.services.preprocessing import CATEGORICAL_COLUMNS, NUMERIC_COLUMNS


def _build_dummy_pipeline() -> Pipeline:
    preprocessor = ColumnTransformer([
        ("num", Pipeline([
            ("impute", SimpleImputer(strategy="median")),
            ("scale", StandardScaler()),
        ]), NUMERIC_COLUMNS),
        ("cat", Pipeline([
            ("impute", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]), CATEGORICAL_COLUMNS),
    ])
    pipeline = Pipeline([("prep", preprocessor), ("reg", LinearRegression())])

    X = pd.DataFrame({
        "carpet_area_sqft": [800, 1200, 1500, 2000],
        "floor_num": [0, 2, 4, 10],
        "bathroom": [1, 2, 2, 3],
        "balcony": [0, 1, 1, 2],
        "car_parking": [0, 1, 1, 2],
        "location_grouped": ["other", "Whitefield", "Whitefield", "other"],
        "Furnishing": ["Unfurnished", "Semi-Furnished", "Furnished", "Furnished"],
        "Transaction": ["Resale", "New Property", "Resale", "New Property"],
        "Ownership": ["Freehold", "Freehold", "Leasehold", "Freehold"],
        "facing": ["East", "West", "North", "South"],
        "Status": ["Ready to Move", "Ready to Move", "Under Construction", "Ready to Move"],
    })
    y = pd.Series([4_000_000, 7_000_000, 9_000_000, 15_000_000])
    pipeline.fit(X, y)
    return pipeline


@pytest.fixture
def client():
    """A TestClient whose model_service has been swapped for a fast dummy model."""
    dummy_service = ModelService(model_path=Path("unused"), locations_path=Path("unused"))
    dummy_service._model = _build_dummy_pipeline()
    dummy_service._allowed_locations = {"Whitefield"}

    with TestClient(app) as test_client:
        test_client.app.state.model_service = dummy_service
        yield test_client
