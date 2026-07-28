// Mirrors backend/app/schemas/prediction.py — keep these in sync.

export interface PredictionRequest {
  location: string;
  carpet_area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  car_parking: number;
  furnishing: string;
  transaction: string;
  ownership: string;
  facing: string;
  status: string;
}

export interface PredictionResponse {
  predicted_price: number;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}

export const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"] as const;
export const TRANSACTION_OPTIONS = ["New Property", "Resale"] as const;
export const OWNERSHIP_OPTIONS = ["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"] as const;
export const FACING_OPTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"] as const;
export const STATUS_OPTIONS = ["Ready to Move", "Under Construction"] as const;
