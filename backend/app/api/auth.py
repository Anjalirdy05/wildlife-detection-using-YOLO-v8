from fastapi import APIRouter, HTTPException, status
from app.models.schemas import LoginRequest, TokenResponse, User
import uuid

router = APIRouter()

MOCK_USERS = [
    {"id": "usr-001", "name": "Admin User", "email": "admin@wildeye.ai", "password": "admin123", "role": "admin"},
    {"id": "usr-002", "name": "Field Ranger", "email": "ranger@wildeye.ai", "password": "ranger123", "role": "ranger"},
]

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    user = next((u for u in MOCK_USERS if u["email"] == req.email and u["password"] == req.password), None)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return TokenResponse(
        access_token=f"mock_jwt_{uuid.uuid4().hex}",
        user=User(id=user["id"], name=user["name"], email=user["email"], role=user["role"])
    )

@router.post("/signup")
async def signup(req: dict):
    return {
        "access_token": f"mock_jwt_{uuid.uuid4().hex}",
        "user": {"id": str(uuid.uuid4()), "name": req.get("name"), "email": req.get("email"), "role": "ranger"}
    }

@router.get("/me")
async def me():
    return {"user": MOCK_USERS[0]}
