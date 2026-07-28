"""Builds the one-row DataFrame that the exported model's pipeline expects.

Because the notebook exports a full scikit-learn Pipeline (ColumnTransformer +
regressor), no manual encoding happens here — we only need to (a) use the exact
column names seen during training, and (b) map unknown locations to "other", the
same bucket used for long-tail locations at training time.
"""
import pandas as pd

from app.schemas.prediction import PredictionRequest

# Must match numeric_features + categorical_features in the training notebook (Section 4).
NUMERIC_COLUMNS = ["carpet_area_sqft", "floor_num", "bathroom", "balcony", "car_parking"]
CATEGORICAL_COLUMNS = ["location_grouped", "Furnishing", "Transaction", "Ownership", "facing", "Status"]


def build_input_dataframe(request: PredictionRequest, allowed_locations: set[str]) -> pd.DataFrame:
    """Convert a PredictionRequest into a single-row DataFrame ready for `pipeline.predict()`."""
    location_grouped = request.location if request.location in allowed_locations else "other"

    row = {
        "carpet_area_sqft": request.carpet_area_sqft,
        "floor_num": request.floor_num,
        "bathroom": request.bathroom,
        "balcony": request.balcony,
        "car_parking": request.car_parking,
        "location_grouped": location_grouped,
        "Furnishing": request.furnishing,
        "Transaction": request.transaction,
        "Ownership": request.ownership,
        "facing": request.facing,
        "Status": request.status,
    }

    return pd.DataFrame([row], columns=NUMERIC_COLUMNS + CATEGORICAL_COLUMNS)
