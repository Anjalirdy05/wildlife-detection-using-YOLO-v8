from fastapi import APIRouter, Query
from typing import Optional
import random, uuid
from datetime import datetime, timedelta

router = APIRouter()

ANIMALS_DANGER = [
    {"name": "Tiger", "emoji": "🐯"},
    {"name": "Leopard", "emoji": "🐆"},
    {"name": "Lion", "emoji": "🦁"},
    {"name": "Wolf", "emoji": "🐺"},
    {"name": "Bear", "emoji": "🐻"},
]
CAMERAS = ["CAM-001", "CAM-002", "CAM-003"]
LOCATIONS = ["Sector A-1", "Sector B-3", "Sector C-2"]

def mock_alert(i: int = 0):
    animal = random.choice(ANIMALS_DANGER)
    cam_i = random.randint(0, 2)
    return {
        "id": f"ALT-{2000 + i}",
        "detection_id": f"DET-{1000 + i}",
        "animal": animal["name"],
        "emoji": animal["emoji"],
        "severity": "critical" if random.random() > 0.3 else "warning",
        "camera_id": CAMERAS[cam_i],
        "location": LOCATIONS[cam_i],
        "timestamp": (datetime.now() - timedelta(minutes=i * 5)).isoformat(),
        "acknowledged": random.random() > 0.7,
        "confidence": random.randint(80, 99),
        "message": f"DANGER: {animal['name']} detected with high confidence",
    }

@router.get("/")
async def list_alerts(limit: int = Query(50), unacknowledged_only: bool = False):
    data = [mock_alert(i) for i in range(limit)]
    if unacknowledged_only:
        data = [a for a in data if not a["acknowledged"]]
    return {"alerts": data, "total": len(data)}

@router.put("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    return {"id": alert_id, "acknowledged": True, "ack_time": datetime.now().isoformat()}

@router.post("/test")
async def send_test_alert():
    return {"status": "Test alert sent", "id": f"ALT-{uuid.uuid4().hex[:8].upper()}"}
