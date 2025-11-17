from fastapi import APIRouter, HTTPException, Depends
from app.models import CropInput, RecommendResponse, CropRecommendation
from app.ml.crop_predictor import predict_yield   # use actual model, get_predictor
from app.auth import verify_clerk_token

router = APIRouter()

@router.post("/recommend", response_model=RecommendResponse)
def recommend(input: CropInput, session=Depends(verify_clerk_token)):
    """
    - Validates inputs
    - Verifies Clerk token first
    - Returns crop recommendations
    """

    # extract userId if needed
    user_id = session.get("user_id")

    # 1 Basic validations
    if not input.soil_type:
        raise HTTPException(status_code=400, detail="Soil type is required")

    if input.pH < 0 or input.pH > 14:
        raise HTTPException(status_code=400, detail="Invalid pH value")

    if input.rainfall_30 < 0:
        raise HTTPException(status_code=400, detail="Rainfall cannot be negative")

    # 2 Crop mapping logic
    crop_map = {
        "Loamy": ["Maize", "Soybean", "Potato"],
        "Alluvial": ["Rice", "Wheat", "Sugarcane"],
        "Sandy": ["Millet", "Groundnut", "Sesame"],
        "Clayey": ["Rice", "Cotton", "Mustard"]
    }

    candidates = crop_map.get(input.soil_type, ["Maize", "Wheat", "Rice"])
    results = []

    # 3 Prediction with error safety
    try:
        for crop in candidates:
            # FIX: send full feature set that model needs
            features = {
                "soil_type": input.soil_type,
                "pH": input.pH,
                "rainfall": input.rainfall_30,
                "avg_temp": input.avg_temp_30,
                "crop": crop
            }

            est_yield = predict_yield(features)
            est_profit = est_yield * 10  # placeholder

            results.append(
                CropRecommendation(
                    crop=crop,
                    estimated_yield_kg_per_acre=est_yield,
                    estimated_profit_inr_per_acre=est_profit,
                    risk="low"
                )
            )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

    return RecommendResponse(recommendations=results)


@router.get("/model-info")
def get_model_info():
    """
    Get ML model information including metrics and feature importance
    """
    try:
        predictor = get_predictor()
        return predictor.get_model_info()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get model info: {str(e)}"
        )
