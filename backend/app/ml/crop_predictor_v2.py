# import numpy as np
# import pandas as pd
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.preprocessing import LabelEncoder
# from sklearn.model_selection import cross_val_score
# import joblib
# import os
# from pathlib import Path


# class CropYieldPredictor:
#     """ML Model for predicting crop yields based on soil and environmental conditions"""

#     def __init__(self):
#         self.model = None
#         self.soil_encoder = LabelEncoder()
#         self.model_path = Path(__file__).parent / "models"
#         self.model_metrics = {}
#         self.feature_importance = {}

#         self.model_path.mkdir(exist_ok=True)

#         if not self._load_model():
#             self._train_model()

#     def _load_model(self) -> bool:
#         """Load bundled model artifacts, falling back to training when unavailable."""
#         model_file = self.model_path / "crop_yield_model.joblib"
#         encoder_file = self.model_path / "soil_encoder.joblib"

#         if not model_file.exists() or not encoder_file.exists():
#             return False

#         try:
#             self.model = joblib.load(model_file)
#             self.soil_encoder = joblib.load(encoder_file)
#             self.feature_importance = {
#                 feature: round(float(importance * 100), 2)
#                 for feature, importance in zip(
#                     ["soil_type", "pH", "rainfall_mm", "temperature_C", "latitude", "irrigation"],
#                     self.model.feature_importances_,
#                 )
#             }
#             self.model_metrics = {
#                 "r2_mean": 0.0,
#                 "r2_std": 0.0,
#                 "n_samples": 600,
#                 "n_features": 6,
#             }
#             return True
#         except Exception as e:
#             print(f"Could not load saved model; retraining: {e}")
#             return False

#     def _get_training_data(self) -> pd.DataFrame:
#         """Generate synthetic training data based on agricultural research"""
#         data = {
#             "soil_type": [],
#             "ph": [],
#             "rainfall_30": [],
#             "avg_temp_30": [],
#             "lat": [],
#             "irrigation": [],
#             "yield_kg_per_acre": [],
#         }

#         soil_configs = {
#             "Loamy": {"base_yield": 1800, "ph_optimal": 6.5, "water_retention": 0.8},
#             "Sandy": {"base_yield": 1200, "ph_optimal": 6.8, "water_retention": 0.4},
#             "Clayey": {"base_yield": 1600, "ph_optimal": 6.2, "water_retention": 0.9},
#             "Alluvial": {"base_yield": 2000, "ph_optimal": 7.0, "water_retention": 0.85},
#         }

#         np.random.seed(42)
#         samples_per_soil = 150

#         for soil_type, config in soil_configs.items():
#             for _ in range(samples_per_soil):
#                 ph = np.random.normal(config["ph_optimal"], 0.8)
#                 ph = np.clip(ph, 4.5, 9.0)

#                 rainfall = np.random.normal(800, 200)
#                 rainfall = np.clip(rainfall, 300, 2000)

#                 temp = np.random.normal(25, 4)
#                 temp = np.clip(temp, 15, 35)

#                 lat = np.random.uniform(8, 35)  # India latitude range
#                 irrigation = np.random.choice([0, 1], p=[0.3, 0.7])

#                 base_yield = config["base_yield"]

#                 ph_factor = 1.0 - abs(ph - config["ph_optimal"]) * 0.08
#                 ph_factor = max(ph_factor, 0.5)

#                 rainfall_factor = (
#                     min(rainfall / 800, 1.2)
#                     if rainfall < 1200
#                     else max(1.2 - (rainfall - 1200) / 1000, 0.7)
#                 )

#                 temp_factor = 1.0 if 20 <= temp <= 30 else 0.85

#                 water_factor = config["water_retention"] * rainfall_factor
#                 if irrigation:
#                     water_factor = min(water_factor * 1.3, 1.4)

#                 lat_factor = 1.0 + (25 - abs(lat - 20)) * 0.01

#                 yield_value = base_yield * ph_factor * water_factor * temp_factor * lat_factor
#                 yield_value *= np.random.normal(1.0, 0.15)
#                 yield_value = max(yield_value, 300)

#                 data["soil_type"].append(soil_type)
#                 data["ph"].append(round(ph, 2))
#                 data["rainfall_30"].append(round(rainfall, 1))
#                 data["avg_temp_30"].append(round(temp, 1))
#                 data["lat"].append(round(lat, 2))
#                 data["irrigation"].append(irrigation)
#                 data["yield_kg_per_acre"].append(round(yield_value, 2))

#         return pd.DataFrame(data)

#     def _train_model(self) -> None:
#         """Train the Random Forest model"""
#         df = self._get_training_data()

#         self.soil_encoder.fit(df["soil_type"])
#         df["soil_encoded"] = self.soil_encoder.transform(df["soil_type"])

#         X = df[["soil_encoded", "ph", "rainfall_30", "avg_temp_30", "lat", "irrigation"]]
#         y = df["yield_kg_per_acre"]

#         self.model = RandomForestRegressor(
#             n_estimators=100,
#             max_depth=15,
#             min_samples_split=5,
#             min_samples_leaf=2,
#             random_state=42,
#             n_jobs=-1,
#         )
#         self.model.fit(X, y)

#         # CV metrics
#         scores = cross_val_score(self.model, X, y, cv=5, scoring="r2")
#         self.model_metrics = {
#             "r2_mean": round(float(scores.mean()), 3),
#             "r2_std": round(float(scores.std()), 3),
#             "n_samples": int(len(X)),
#             "n_features": int(X.shape[1]),
#         }
#         print(
#             f"Model R² Score: {self.model_metrics['r2_mean']:.3f} "
#             f"(+/- {self.model_metrics['r2_std']:.3f})"
#         )

#         feature_names = ["soil_type", "pH", "rainfall_mm", "temperature_C", "latitude", "irrigation"]
#         importances = self.model.feature_importances_
#         self.feature_importance = {
#             feature: round(float(importance * 100), 2)
#             for feature, importance in zip(feature_names, importances)
#         }
#         print(f"Feature Importance: {self.feature_importance}")

#         model_file = self.model_path / "crop_yield_model.joblib"
#         encoder_file = self.model_path / "soil_encoder.joblib"
#         joblib.dump(self.model, model_file)
#         joblib.dump(self.soil_encoder, encoder_file)

#     def predict(
#         self,
#         soil_type: str,
#         ph: float,
#         rainfall_30: float,
#         avg_temp_30: float,
#         lat: float,
#         irrigation: bool,
#     ) -> float:
#         """Predict crop yield for given conditions"""
#         try:
#             soil_encoded = self.soil_encoder.transform([soil_type])[0]

#             features = np.array(
#                 [[soil_encoded, ph, rainfall_30, avg_temp_30, lat, int(irrigation)]]
#             )

#             prediction = self.model.predict(features)[0]
#             return max(round(float(prediction), 2), 0.0)
#         except Exception as e:
#             print(f"Prediction error: {e}")
#             return 1500.0

#     def predict_with_confidence(
#         self,
#         soil_type: str,
#         ph: float,
#         rainfall_30: float,
#         avg_temp_30: float,
#         lat: float,
#         irrigation: bool,
#     ) -> dict:
#         """Predict crop yield with confidence score and range"""
#         try:
#             soil_encoded = self.soil_encoder.transform([soil_type])[0]

#             features = np.array(
#                 [[soil_encoded, ph, rainfall_30, avg_temp_30, lat, int(irrigation)]]
#             )

#             tree_predictions = [tree.predict(features)[0] for tree in self.model.estimators_]

#             mean_pred = float(np.mean(tree_predictions))
#             std_pred = float(np.std(tree_predictions))

#             if mean_pred > 0:
#                 confidence = max(0.0, min(100.0, 100.0 * (1 - std_pred / mean_pred)))
#             else:
#                 confidence = 50.0

#             return {
#                 "prediction": round(max(mean_pred, 0.0), 2),
#                 "confidence": round(confidence, 2),
#                 "min_yield": round(max(mean_pred - std_pred, 0.0), 2),
#                 "max_yield": round(mean_pred + std_pred, 2),
#             }
#         except Exception as e:
#             print(f"Confidence prediction error: {e}")
#             return {
#                 "prediction": 1500.0,
#                 "confidence": 50.0,
#                 "min_yield": 1200.0,
#                 "max_yield": 1800.0,
#             }

#     def get_model_info(self) -> dict:
#         return {
#             "model_type": "Random Forest Regressor",
#             "n_estimators": 100,
#             "training_samples": 600,
#             "soil_types": ["Loamy", "Sandy", "Clayey", "Alluvial"],
#             "features": ["soil_type", "pH", "rainfall_mm", "temperature_C", "latitude", "irrigation"],
#             "metrics": self.model_metrics,
#             "feature_importance": self.feature_importance,
#         }

#     def get_feature_importance(self) -> dict:
#         return self.feature_importance


# _predictor = None


# def get_predictor() -> CropYieldPredictor:
#     global _predictor
#     if _predictor is None:
#         _predictor = CropYieldPredictor()
#     return _predictor


# def predict_yield(features: dict) -> float:
#     predictor = get_predictor()
#     return predictor.predict(
#         soil_type=features["soil_type"],
#         ph=features["ph"],
#         rainfall_30=features["rainfall_30"],
#         avg_temp_30=features["avg_temp_30"],
#         lat=features["lat"],
#         irrigation=features["irrigation"],
#     )



import pandas as pd
import joblib
from pathlib import Path

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score


class CropYieldPredictorV2:

    def __init__(self):

        self.crops = []
        self.model = None

        self.model_dir = Path(__file__).parent / "models"
        self.model_dir.mkdir(exist_ok=True)

        self.model_file = self.model_dir / "crop_yield_v2.joblib"

        if not self._load_model():
            self._train_model()

    def _load_model(self):

        if self.model_file.exists():

            self.model = joblib.load(self.model_file)

            df = pd.read_csv(
                Path(__file__).parent / "data" / "crop_yield.csv"
            )

            self.crops = sorted(
                df["Crop"].unique()
            )

            return True

        return False

    def _train_model(self):

        df = pd.read_csv(
            Path(__file__).parent / "data" / "crop_yield.csv"
        )

        features = [
            "Crop",
            "Crop_Year",
            "Season",
            "State",
            "Area",
            "Annual_Rainfall",
            "Fertilizer",
            "Pesticide",
        ]

        X = df[features]
        y = df["Yield"]

        categorical = [
            "Crop",
            "Season",
            "State",
        ]

        numeric = [
            "Crop_Year",
            "Area",
            "Annual_Rainfall",
            "Fertilizer",
            "Pesticide",
        ]

        preprocessor = ColumnTransformer(
            [
                (
                    "cat",
                    OneHotEncoder(handle_unknown="ignore"),
                    categorical,
                ),
                (
                    "num",
                    "passthrough",
                    numeric,
                ),
            ]
        )

        self.model = Pipeline(
            [
                ("preprocessor", preprocessor),
                (
                    "rf",
                    RandomForestRegressor(
                        n_estimators=200,
                        random_state=42,
                        n_jobs=-1,
                    ),
                ),
            ]
        )

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42,
        )

        self.model.fit(X_train, y_train)

        predictions = self.model.predict(X_test)

        print(
            "R2 Score:",
            r2_score(y_test, predictions)
        )

        joblib.dump(
            self.model,
            self.model_file
        )

        self.crops = sorted(
            df["Crop"].unique()
        )

    def predict_crop_yield(
        self,
        crop,
        crop_year,
        season,
        state,
        area,
        rainfall,
        fertilizer,
        pesticide,
    ):

        row = pd.DataFrame(
            [{
                "Crop": crop,
                "Crop_Year": crop_year,
                "Season": season,
                "State": state,
                "Area": area,
                "Annual_Rainfall": rainfall,
                "Fertilizer": fertilizer,
                "Pesticide": pesticide,
            }]
        )

        prediction = self.model.predict(row)[0]

        return round(float(prediction), 2)

    def get_all_crops(self):
        return self.crops


# Compatibility layer

CropYieldPredictor = CropYieldPredictorV2

_predictor = None


def get_predictor():
    global _predictor

    if _predictor is None:
        _predictor = CropYieldPredictorV2()

    return _predictor


def predict_yield(features: dict):

    predictor = get_predictor()

    return predictor.predict_crop_yield(
        crop=features["Crop"],
        crop_year=features["Crop_Year"],
        season=features["Season"],
        state=features["State"],
        area=features["Area"],
        rainfall=features["Annual_Rainfall"],
        fertilizer=features["Fertilizer"],
        pesticide=features["Pesticide"],
    )

