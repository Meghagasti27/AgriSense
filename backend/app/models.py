from pydantic import BaseModel
from typing import List, Optional


class CropInput(BaseModel):
    soil_type: str
    pH: float
    rainfall_30: float
    avg_temp_30: float
    lat: float
    irrigation: bool = False


class CropRecommendation(BaseModel):
    crop: str
    estimated_yield_kg_per_acre: float
    estimated_profit_inr_per_acre: float
    risk: str
    confidence: Optional[float] = None
    min_yield: Optional[float] = None
    max_yield: Optional[float] = None


class RecommendResponse(BaseModel):
    recommendations: List[CropRecommendation]
