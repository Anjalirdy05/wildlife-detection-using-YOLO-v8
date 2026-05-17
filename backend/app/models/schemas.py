from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class AnimalClass(str, Enum):
    TIGER = "Tiger"
    ELEPHANT = "Elephant"
    LEOPARD = "Leopard"
    LION = "Lion"
    DEER = "Deer"
    ZEBRA = "Zebra"
    GIRAFFE = "Giraffe"
    WOLF = "Wolf"
    BEAR = "Bear"
    RHINOCEROS = "Rhinoceros"

DANGER_SPECIES = {AnimalClass.TIGER, AnimalClass.LEOPARD, AnimalClass.LION, AnimalClass.WOLF, AnimalClass.BEAR}

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class Detection(BaseModel):
    id: str
    animal: str
    confidence: float = Field(ge=0.0, le=1.0)
    camera_id: str
    camera_name: str
    location: str
    track_id: str
    bbox: BoundingBox
    timestamp: datetime
    is_danger: bool = False
    lat: Optional[float] = None
    lng: Optional[float] = None

class DetectionCreate(BaseModel):
    animal: str
    confidence: float
    camera_id: str
    bbox: BoundingBox

class Alert(BaseModel):
    id: str
    detection_id: str
    animal: str
    severity: str  # "critical", "warning", "info"
    camera_id: str
    location: str
    timestamp: datetime
    acknowledged: bool = False
    message: str

class Camera(BaseModel):
    id: str
    name: str
    location: str
    stream_url: str
    is_active: bool = True
    lat: float
    lng: float

class User(BaseModel):
    id: str
    name: str
    email: str
    role: str  # "admin", "ranger", "analyst"

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User
