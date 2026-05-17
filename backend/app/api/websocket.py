from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict
import asyncio
import json
import uuid
import random
from datetime import datetime

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        self.active_connections.pop(client_id, None)

    async def broadcast(self, message: dict):
        dead = []
        for cid, ws in self.active_connections.items():
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(cid)
        for cid in dead:
            self.disconnect(cid)

    async def send_personal(self, client_id: str, message: dict):
        ws = self.active_connections.get(client_id)
        if ws:
            try:
                await ws.send_json(message)
            except Exception:
                self.disconnect(client_id)

manager = ConnectionManager()

ANIMALS_SIM = [
    {"name": "Tiger", "danger": True, "emoji": "🐯"},
    {"name": "Elephant", "danger": False, "emoji": "🐘"},
    {"name": "Leopard", "danger": True, "emoji": "🐆"},
    {"name": "Lion", "danger": True, "emoji": "🦁"},
    {"name": "Deer", "danger": False, "emoji": "🦌"},
    {"name": "Zebra", "danger": False, "emoji": "🦓"},
    {"name": "Giraffe", "danger": False, "emoji": "🦒"},
    {"name": "Wolf", "danger": True, "emoji": "🐺"},
    {"name": "Bear", "danger": True, "emoji": "🐻"},
]

CAMERAS_SIM = [
    {"id": "CAM-001", "name": "North Perimeter", "location": "Sector A-1"},
    {"id": "CAM-002", "name": "Water Hole Alpha", "location": "Sector B-3"},
    {"id": "CAM-003", "name": "South Trail Gate", "location": "Sector C-2"},
]

def generate_detection_event():
    animal = random.choice(ANIMALS_SIM)
    camera = random.choice(CAMERAS_SIM)
    return {
        "type": "detection",
        "data": {
            "id": f"DET-{uuid.uuid4().hex[:8].upper()}",
            "animal": animal["name"],
            "emoji": animal["emoji"],
            "danger": animal["danger"],
            "confidence": random.randint(72, 99),
            "camera": camera["id"],
            "cameraName": camera["name"],
            "location": camera["location"],
            "trackId": f"TRK-{random.randint(1000, 9999)}",
            "timestamp": datetime.now().isoformat(),
            "bbox": {
                "x": random.randint(50, 500),
                "y": random.randint(50, 250),
                "w": random.randint(80, 200),
                "h": random.randint(80, 200),
            }
        }
    }

@router.websocket("/detections")
async def detection_stream(websocket: WebSocket):
    client_id = str(uuid.uuid4())
    await manager.connect(websocket, client_id)
    try:
        # Send welcome
        await websocket.send_json({"type": "connected", "client_id": client_id, "message": "WildEye stream connected"})

        # Start streaming detections
        while True:
            # Listen for client messages (non-blocking)
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=0.1)
                msg = json.loads(data)
                if msg.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
            except asyncio.TimeoutError:
                pass
            except Exception:
                break

            # Send detection every 4-8 seconds
            await asyncio.sleep(random.uniform(4, 8))
            event = generate_detection_event()
            await websocket.send_json(event)

    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/alerts")
async def alert_stream(websocket: WebSocket):
    client_id = str(uuid.uuid4())
    await manager.connect(websocket, client_id)
    try:
        await websocket.send_json({"type": "connected", "message": "Alert stream connected"})
        while True:
            await asyncio.sleep(random.uniform(8, 20))
            det = generate_detection_event()
            if det["data"]["danger"]:
                await websocket.send_json({
                    "type": "alert",
                    "severity": "critical",
                    "data": det["data"],
                    "message": f"DANGER: {det['data']['animal']} detected at {det['data']['cameraName']}"
                })
    except WebSocketDisconnect:
        manager.disconnect(client_id)
