from fastapi import APIRouter, Query
from typing import List, Optional
import uuid, random
from datetime import datetime, timedelta

router = APIRouter()

ANIMALS = ["Tiger", "Elephant", "Leopard", "Lion", "Deer", "Zebra", "Giraffe", "Wolf", "Bear", "Rhinoceros"]
CAMERAS = [
    {"id": "CAM-001", "name": "North Perimeter", "location": "Sector A-1"},
    {"id": "CAM-002", "name": "Water Hole Alpha", "location": "Sector B-3"},
    {"id": "CAM-003", "name": "South Trail Gate", "location": "Sector C-2"},
]
DANGER = {"Tiger", "Leopard", "Lion", "Wolf", "Bear"}

def mock_detection(i: int = 0):
    animal = random.choice(ANIMALS)
    cam = random.choice(CAMERAS)
    return {
        "id": f"DET-{1000 + i}",
        "animal": animal,
        "confidence": random.randint(72, 99),
        "camera_id": cam["id"],
        "camera_name": cam["name"],
        "location": cam["location"],
        "track_id": f"TRK-{random.randint(1000, 9999)}",
        "is_danger": animal in DANGER,
        "timestamp": (datetime.now() - timedelta(minutes=i * 3)).isoformat(),
        "bbox": {"x": random.randint(50, 400), "y": random.randint(50, 200), "width": random.randint(80, 200), "height": random.randint(80, 200)},
        "lat": 28.6139 + random.uniform(-0.05, 0.05),
        "lng": 77.209 + random.uniform(-0.05, 0.05),
    }

@router.get("/")
async def list_detections(
    limit: int = Query(50, le=200),
    animal: Optional[str] = None,
    camera: Optional[str] = None,
    danger_only: bool = False,
):
    data = [mock_detection(i) for i in range(limit)]
    if animal:
        data = [d for d in data if d["animal"].lower() == animal.lower()]
    if camera:
        data = [d for d in data if d["camera_id"] == camera]
    if danger_only:
        data = [d for d in data if d["is_danger"]]
    return {"detections": data, "total": len(data)}

@router.get("/stats")
async def detection_stats():
    detections = [mock_detection(i) for i in range(100)]
    animal_counts = {}
    for d in detections:
        animal_counts[d["animal"]] = animal_counts.get(d["animal"], 0) + 1
    return {
        "total": len(detections),
        "danger": sum(1 for d in detections if d["is_danger"]),
        "by_animal": animal_counts,
        "avg_confidence": round(sum(d["confidence"] for d in detections) / len(detections)),
    }

@router.get("/{detection_id}")
async def get_detection(detection_id: str):
    return mock_detection(0)

@router.post("/")
async def create_detection(data: dict):
    return {"id": f"DET-{uuid.uuid4().hex[:8].upper()}", **data, "timestamp": datetime.now().isoformat()}
