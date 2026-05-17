from fastapi import APIRouter

router = APIRouter()

CAMERAS = [
    {"id": "CAM-001", "name": "North Perimeter", "location": "Sector A-1", "stream_url": "rtsp://cam1.wildeye.local/stream", "is_active": True, "lat": 28.6139, "lng": 77.2090},
    {"id": "CAM-002", "name": "Water Hole Alpha", "location": "Sector B-3", "stream_url": "rtsp://cam2.wildeye.local/stream", "is_active": True, "lat": 28.6200, "lng": 77.2150},
    {"id": "CAM-003", "name": "South Trail Gate", "location": "Sector C-2", "stream_url": "rtsp://cam3.wildeye.local/stream", "is_active": True, "lat": 28.6080, "lng": 77.2010},
]

@router.get("/")
async def list_cameras():
    return {"cameras": CAMERAS, "total": len(CAMERAS), "active": sum(1 for c in CAMERAS if c["is_active"])}

@router.get("/{camera_id}")
async def get_camera(camera_id: str):
    cam = next((c for c in CAMERAS if c["id"] == camera_id), None)
    if not cam:
        from fastapi import HTTPException
        raise HTTPException(404, "Camera not found")
    return cam

@router.put("/{camera_id}")
async def update_camera(camera_id: str, data: dict):
    return {"id": camera_id, "updated": True, **data}
