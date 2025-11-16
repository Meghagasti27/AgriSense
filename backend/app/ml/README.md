# AgriSense ML Module

## Overview
This module contains the machine learning model for predicting crop yields based on soil and environmental conditions.

## Model Architecture
- **Algorithm**: Random Forest Regressor
- **Features**: 6 input features
  - Soil Type (encoded: Loamy, Sandy, Clayey, Alluvial)
  - pH Level (4.5 - 9.0)
  - Rainfall in last 30 days (mm)
  - Average Temperature in last 30 days (°C)
  - Latitude
  - Irrigation (boolean)
- **Output**: Predicted yield in kg per acre

## Training Data
The model is trained on synthetic but realistic data:
- 600 samples (150 per soil type)
- Based on agricultural research and real-world crop yield factors
- Considers:
  - Optimal pH ranges for different soil types
  - Water retention characteristics
  - Temperature effects on growth
  - Irrigation impact
  - Geographic factors (latitude)

## Model Performance
The Random Forest model:
- Uses 100 estimators
- Max depth of 15
- Handles non-linear relationships between features
- Provides robust predictions across different conditions

## Files
- `crop_predictor.py`: Main ML model implementation
- `model_stub.py`: API interface (imports from crop_predictor)
- `__init__.py`: Package initialization
- `models/`: Directory for saved models (auto-created, gitignored)
  - `crop_yield_model.joblib`: Trained Random Forest model
  - `soil_encoder.joblib`: Label encoder for soil types

## Usage

### Direct Import
```python
from app.ml import predict_yield

features = {
    'soil_type': 'Loamy',
    'ph': 6.5,
    'rainfall_30': 800,
    'avg_temp_30': 25,
    'lat': 20.5,
    'irrigation': True
}

yield_prediction = predict_yield(features)
print(f"Predicted yield: {yield_prediction} kg/acre")
```

### Via API
The model is integrated into the FastAPI backend:
```bash
POST /api/recommend
Content-Type: application/json

{
  "soil_type": "Loamy",
  "ph": 6.5,
  "rainfall_30": 800,
  "avg_temp_30": 25,
  "lat": 20.5,
  "irrigation": true
}
```

## Supported Soil Types
1. **Loamy**: Best overall, high water retention (base yield: 1800 kg/acre)
2. **Alluvial**: Nutrient-rich, excellent for crops (base yield: 2000 kg/acre)
3. **Clayey**: Good retention, slower drainage (base yield: 1600 kg/acre)
4. **Sandy**: Lower retention, needs more irrigation (base yield: 1200 kg/acre)

## Model Updates
To retrain the model with new data:
```python
from app.ml import CropYieldPredictor

predictor = CropYieldPredictor()
# Model automatically trains on initialization
```

## Future Enhancements
- [ ] Add historical weather data integration
- [ ] Implement crop-specific models
- [ ] Add disease prediction
- [ ] Include soil nutrient analysis
- [ ] Support for multiple crops simultaneously
- [ ] Time-series forecasting for seasonal planning
