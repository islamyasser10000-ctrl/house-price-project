"""Pydantic schemas for the /predict endpoint.

Field names here mirror the feature set trained in notebooks/house_price_model.ipynb
(Section 4). If you change the features used in the notebook, update this schema and
app/services/preprocessing.py to match.
"""
from pydantic import BaseModel, Field, field_validator


class PredictionRequest(BaseModel):
    location: str = Field(..., min_length=1, description="Property location / locality name")
    carpet_area_sqft: float = Field(..., gt=0, description="Carpet area in square feet")
    floor_num: int = Field(..., ge=-1, le=200, description="Floor number (-1 = basement, 0 = ground)")
    bathroom: int = Field(..., ge=0, le=20)
    balcony: int = Field(..., ge=0, le=20)
    car_parking: int = Field(0, ge=0, le=20)
    furnishing: str = Field(..., description='"Furnished" | "Semi-Furnished" | "Unfurnished"')
    transaction: str = Field(..., description='"New Property" | "Resale"')
    ownership: str = Field(..., description='e.g. "Freehold", "Leasehold", "Power of Attorney"')
    facing: str = Field(..., description='e.g. "East", "West", "North", "South"')
    status: str = Field("Ready to Move", description='"Ready to Move" | "Under Construction"')

    @field_validator("location", "furnishing", "transaction", "ownership", "facing", "status")
    @classmethod
    def strip_strings(cls, v: str) -> str:
        return v.strip()

    model_config = {
        "json_schema_extra": {
            "example": {
                "location": "Whitefield",
                "carpet_area_sqft": 1200,
                "floor_num": 3,
                "bathroom": 2,
                "balcony": 1,
                "car_parking": 1,
                "furnishing": "Semi-Furnished",
                "transaction": "Resale",
                "ownership": "Freehold",
                "facing": "East",
                "status": "Ready to Move",
            }
        }
    }


class PredictionResponse(BaseModel):
    predicted_price: float = Field(..., description="Predicted price in Indian Rupees (₹)")


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
