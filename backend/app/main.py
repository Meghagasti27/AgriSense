from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routes.recommend import router as recommend_router
from app.routes.health import router as health_router
from app.auth import verify_clerk_token
app = FastAPI(title="SmartCrop Advisor - Backend")

# CORS (allow frontend to talk to backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health_router, prefix="/api")
app.include_router(recommend_router, prefix="/api")

@app.get("/")
def root():
    return {"status": "ok", "message": "backend working"}

@app.get("/protected")
def protected_route(session = Depends(verify_clerk_token)):
    print ("Session details : ", session)
    return {"status": 200, "data": session}
