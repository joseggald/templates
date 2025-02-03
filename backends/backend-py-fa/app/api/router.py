from fastapi import APIRouter
from app.core.responses import ResponseHandler

router = APIRouter()

@router.get("/test")
async def test_endpoint():
    return ResponseHandler.success(
        message="API is working correctly",
        data={"test": "successful"}
    )