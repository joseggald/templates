from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

class DatabaseConnection(ABC):
    @abstractmethod
    async def connect(self) -> None:
        pass
    
    @abstractmethod
    async def disconnect(self) -> None:
        pass
    
    @abstractmethod
    async def get_connection(self) -> Any:
        pass