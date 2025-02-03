from motor.motor_asyncio import AsyncIOMotorClient
from typing import Dict, Optional
from core.config import settings
from core.logger import logger
from .base import DatabaseConnection

class MongoDBConnection(DatabaseConnection):
    def __init__(self, connection_name: str):
        self.connection_name = connection_name
        self.connection_config = settings.MONGO_CONNECTIONS.get(connection_name)
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None

    async def connect(self) -> None:
        try:
            if self.connection_config and self.connection_config['url']:
                self.client = AsyncIOMotorClient(self.connection_config['url'])
                self.db = self.client[self.connection_config['db_name']]
                logger.info(f"Connected to MongoDB {self.connection_name}")
        except Exception as e:
            logger.error(f"MongoDB {self.connection_name} connection error: {str(e)}")
            raise e

    async def disconnect(self) -> None:
        if self.client:
            self.client.close()
            logger.info(f"Disconnected from MongoDB {self.connection_name}")

    async def get_connection(self):
        if not self.db:
            await self.connect()
        return self.db