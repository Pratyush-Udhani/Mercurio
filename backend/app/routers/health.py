# app/api/routers/health.py
from fastapi import APIRouter
from app.models.health import HealthResponse

router = APIRouter(
    prefix="/health",
    tags=["health"],
)

@router.get("", response_model=HealthResponse)
async def health_check():
    """
    Simple health check endpoint.
    Returns HTTP 200 with { "status": "OK" }.
    """
    return HealthResponse(status="OK")

