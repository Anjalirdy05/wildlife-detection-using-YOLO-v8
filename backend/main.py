from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import detections, cameras, alerts, auth, websocket
import uvicorn

app = FastAPI(
    title="WildEye API",
    description="Real-Time Wildlife Detection & Monitoring System",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "https://wildlife-detection-using-yolov8-rosy.vercel.app"
     ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(detections.router, prefix="/api/detections", tags=["Detections"])
app.include_router(cameras.router, prefix="/api/cameras", tags=["Cameras"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])

@app.get("/")
async def root():
    return {"status": "WildEye API v2.0 Online", "yolo": "v8"}

@app.get("/health")
async def health():
    return {"status": "healthy", "services": {"yolo": "active", "tracker": "active"}}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
