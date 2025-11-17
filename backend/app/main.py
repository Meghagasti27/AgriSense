from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.recommend import router as recommend_router
from app.routes.health import router as health_router
from dotenv import load_dotenv
load_dotenv()

import os
print("DEBUG: Loaded API KEY =", os.getenv("OPENWEATHER_API_KEY"))

app = FastAPI(title="SmartCrop Advisor - Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api")
app.include_router(recommend_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "message": "backend working"}
