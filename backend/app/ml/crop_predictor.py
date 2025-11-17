import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import cross_val_score
import joblib
import os
from pathlib import Path

class CropYieldPredictor:
    """ML Model for predicting crop yields based on soil and environmental conditions"""
    
    def __init__(self):
        self.model = None
        self.soil_encoder = LabelEncoder()
        self.model_path = Path(__file__).parent / 'models'
        self.model_metrics = {}
        self.feature_importance = {}
        
        self.model_path.mkdir(exist_ok=True)
        
        # Initialize with training data
        self._train_model()
    
    def _get_training_data(self):
        """Generate synthetic training data based on agricultural research"""
        # Realistic crop yield data based on soil types and conditions
        data = {
            'soil_type': [],
            'ph': [],
            'rainfall_30': [],
            'avg_temp_30': [],
            'lat': [],
            'irrigation': [],
            'yield_kg_per_acre': []
        }
        
        # Soil type characteristics
        soil_configs = {
            'Loamy': {'base_yield': 1800, 'ph_optimal': 6.5, 'water_retention': 0.8},
            'Sandy': {'base_yield': 1200, 'ph_optimal': 6.8, 'water_retention': 0.4},
            'Clayey': {'base_yield': 1600, 'ph_optimal': 6.2, 'water_retention': 0.9},
            'Alluvial': {'base_yield': 2000, 'ph_optimal': 7.0, 'water_retention': 0.85}
        }
        
        # Generate diverse training samples
        np.random.seed(42)
        samples_per_soil = 150
        
        for soil_type, config in soil_configs.items():
            for _ in range(samples_per_soil):
                # Environmental factors
                ph = np.random.normal(config['ph_optimal'], 0.8)
                ph = np.clip(ph, 4.5, 9.0)
                
                rainfall = np.random.normal(800, 200)
                rainfall = np.clip(rainfall, 300, 2000)
                
                temp = np.random.normal(25, 4)
                temp = np.clip(temp, 15, 35)
                
                lat = np.random.uniform(8, 35)  # India latitude range
                irrigation = np.random.choice([0, 1], p=[0.3, 0.7])
                
                # Calculate yield with realistic factors
                base_yield = config['base_yield']
                
                # pH factor (optimal range 6.0-7.5)
                ph_factor = 1.0 - abs(ph - config['ph_optimal']) * 0.08
                ph_factor = max(ph_factor, 0.5)
                
                # Rainfall factor
                rainfall_factor = min(rainfall / 800, 1.2) if rainfall < 1200 else max(1.2 - (rainfall - 1200) / 1000, 0.7)
                
                # Temperature factor (optimal 20-30°C)
                temp_factor = 1.0 if 20 <= temp <= 30 else 0.85
                
                # Water availability factor
                water_factor = config['water_retention'] * rainfall_factor
                if irrigation:
                    water_factor = min(water_factor * 1.3, 1.4)
                
                # Latitude factor (affects growing season)
                lat_factor = 1.0 + (25 - abs(lat - 20)) * 0.01
                
                # Calculate final yield with some randomness
                yield_value = base_yield * ph_factor * water_factor * temp_factor * lat_factor
                yield_value *= np.random.normal(1.0, 0.15)  # Add realistic variance
                yield_value = max(yield_value, 300)  # Minimum viable yield
                
                data['soil_type'].append(soil_type)
                data['ph'].append(round(ph, 2))
                data['rainfall_30'].append(round(rainfall, 1))
                data['avg_temp_30'].append(round(temp, 1))
                data['lat'].append(round(lat, 2))
                data['irrigation'].append(irrigation)
                data['yield_kg_per_acre'].append(round(yield_value, 2))
        
        return pd.DataFrame(data)
    
    def _train_model(self):
        """Train the Random Forest model"""
        # Get training data
        df = self._get_training_data()
        
        # Encode soil types
        self.soil_encoder.fit(df['soil_type'])
        df['soil_encoded'] = self.soil_encoder.transform(df['soil_type'])
        
        # Prepare features and target
        X = df[['soil_encoded', 'ph', 'rainfall_30', 'avg_temp_30', 'lat', 'irrigation']]
        y = df['yield_kg_per_acre']
        
        # Train Random Forest model
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        self.model.fit(X, y)

                # Calculate cross-validation scores
        scores = cross_val_score(self.model, X, y, cv=5, scoring='r2')
        self.model_metrics = {
            'r2_mean': round(scores.mean(), 3),
            'r2_std': round(scores.std(), 3),
            'n_samples': len(X),
            'n_features': X.shape[1]
        }
        print(f"Model R² Score: {self.model_metrics['r2_mean']:.3f} (+/- {self.model_metrics['r2_std']:.3f})")
        
        # Calculate feature importance
        feature_names = ['soil_type', 'pH', 'rainfall_mm', 'temperature_C', 'latitude', 'irrigation']
        importances = self.model.feature_importances_
        self.feature_importance = {
            feature: round(importance * 100, 2)
            for feature, importance in zip(feature_names, importances)
        }
        print(f"Feature Importance: {self.feature_importance}")
        
        # Save model
        model_file = self.model_path / 'crop_yield_model.joblib'
        encoder_file = self.model_path / 'soil_encoder.joblib'
        joblib.dump(self.model, model_file)
        joblib.dump(self.soil_encoder, encoder_file)
    
    def predict(self, soil_type: str, ph: float, rainfall_30: float, 
                avg_temp_30: float, lat: float, irrigation: bool) -> float:
        """Predict crop yield for given conditions"""
        try:
            # Encode soil type
            soil_encoded = self.soil_encoder.transform([soil_type])[0]
            
            # Prepare features
            features = np.array([[
                soil_encoded,
                ph,
                rainfall_30,
                avg_temp_30,
                lat,
                int(irrigation)
            ]])
            
            # Make prediction
            prediction = self.model.predict(features)[0]
            
            return max(round(prediction, 2), 0)  # Ensure non-negative
            
        except Exception as e:
            print(f"Prediction error: {e}")
            return 1500.0  # Return reasonable default

    def predict_with_confidence(self, soil_type: str, ph: float, rainfall_30: float,
                                avg_temp_30: float, lat: float, irrigation: bool) -> dict:
        """Predict crop yield with confidence score"""
        try:
            # Encode soil type
            soil_encoded = self.soil_encoder.transform([soil_type])[0]
            
            # Prepare features
            features = np.array([[
                soil_encoded,
                ph,
                rainfall_30,
                avg_temp_30,
                lat,
                int(irrigation)
            ]])
            
            # Get predictions from all trees in the forest
            tree_predictions = [tree.predict(features)[0] for tree in self.model.estimators_]
            
            mean_pred = np.mean(tree_predictions)
            std_pred = np.std(tree_predictions)
            
            # Calculate confidence (0-100%)
            # Lower std deviation = higher confidence
            if mean_pred > 0:
                confidence = max(0, min(100, 100 * (1 - std_pred / mean_pred)))
            else:
                confidence = 50.0
            
            return {
                "prediction": round(max(mean_pred, 0), 2),
                "confidence": round(confidence, 2),
                "min_yield": round(max(mean_pred - std_pred, 0), 2),
                "max_yield": round(mean_pred + std_pred, 2)
            }
            
        except Exception as e:
            print(f"Confidence prediction error: {e}")
            return {
                "prediction": 1500.0,
                "confidence": 50.0,
                "min_yield": 1200.0,
                "max_yield": 1800.0
            }
    
    def get_model_info(self) -> dict:
        """Get ML model information"""
        return {
            "model_type": "Random Forest Regressor",
            "n_estimators": 100,
            "training_samples": 600,
            "soil_types": ["Loamy", "Sandy", "Clayey", "Alluvial"],
            "features": ["soil_type", "pH", "rainfall_mm", "temperature_C", "latitude", "irrigation"],
            "metrics": self.model_metrics,
            "feature_importance": self.feature_importance
        }
    
    def get_feature_importance(self) -> dict:
        """Get importance of each feature"""
        return self.feature_importance

# Global predictor instance
_predictor = None

def get_predictor() -> CropYieldPredictor:
    """Get or create the global predictor instance"""
    global _predictor
    if _predictor is None:
        _predictor = CropYieldPredictor()
    return _predictor

def predict_yield(features: dict) -> float:
    """Main prediction function called by the API"""
    predictor = get_predictor()
    
    return predictor.predict(
        soil_type=features['soil_type'],
        ph=features['ph'],
        rainfall_30=features['rainfall_30'],
        avg_temp_30=features['avg_temp_30'],
        lat=features['lat'],
        irrigation=features['irrigation']
    )
