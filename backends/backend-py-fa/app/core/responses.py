from fastapi import status
from fastapi.responses import JSONResponse
from typing import Any, Optional
from .logger import logger

class ResponseModel:
    def __init__(
        self,
        status: str,
        message: str,
        data: Any = None,
        metadata: dict = None
    ):
        self.status = status
        self.message = message
        self.data = data
        self.metadata = metadata or {}
        
    def to_dict(self) -> dict:
        response = {
            "status": self.status,
            "message": self.message,
        }
        
        if self.data is not None:
            response["data"] = self.data
            
        if self.metadata:
            response["metadata"] = self.metadata
            
        return response

class ResponseHandler:
    @staticmethod
    def success(
        message: str,
        data: Any = None,
        metadata: dict = None,
        status_code: int = status.HTTP_200_OK
    ) -> JSONResponse:
        response = ResponseModel(
            status="success",
            message=message,
            data=data,
            metadata=metadata
        )
        
        logger.info(
            f"Success Response: {message}",
            extra={
                "status_code": status_code,
                "data": data,
                "metadata": metadata
            }
        )
        
        return JSONResponse(
            content=response.to_dict(),
            status_code=status_code
        )
    
    @staticmethod
    def error(
        message: str,
        data: Any = None,
        metadata: dict = None,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    ) -> JSONResponse:
        response = ResponseModel(
            status="error",
            message=message,
            data=data,
            metadata=metadata
        )
        
        logger.error(
            f"Error Response: {message}",
            extra={
                "status_code": status_code,
                "data": data,
                "metadata": metadata
            }
        )
        
        return JSONResponse(
            content=response.to_dict(),
            status_code=status_code
        )