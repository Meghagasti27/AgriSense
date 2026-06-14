import numpy as np
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
            self.model_file,
        )

        self.crops = sorted(
            df["Crop"].unique()
        )

    def get_all_crops(self):
        return self.crops

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

        rf = self.model.named_steps["rf"]

        transformed_row = (
            self.model.named_steps["preprocessor"]
            .transform(row)
        )

        tree_predictions = [
            tree.predict(transformed_row)[0]
            for tree in rf.estimators_
        ]

        mean_pred = float(np.mean(tree_predictions))
        std_pred = float(np.std(tree_predictions))

        confidence = max(
            0,
            min(
                100,
                100 * (1 - (std_pred / mean_pred))
            )
        )

        return {
            "yield": round(float(prediction), 2),
            "confidence": round(confidence, 2),
            "min_yield": round(
                max(mean_pred - std_pred, 0),
                2,
            ),
            "max_yield": round(
                mean_pred + std_pred,
                2,
            ),
        }


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