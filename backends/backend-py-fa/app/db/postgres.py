from .base import DatabaseConnection
from app.core.logger import logger
import asyncpg
from typing import Optional, Dict

class PostgreSQLConnection(DatabaseConnection):
    def __init__(self, connection_name: str, config: Dict):
        self.connection_name = connection_name
        self.config = config
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self) -> None:
        try:
            self.pool = await asyncpg.create_pool(
                host=self.config.get('host'),
                port=int(self.config.get('port', 5432)),
                user=self.config.get('user'),
                password=self.config.get('password'),
                database=self.config.get('database')
            )
            logger.info(f"Connected to PostgreSQL database: {self.connection_name}")
        except Exception as e:
            logger.error(f"PostgreSQL connection error ({self.connection_name}): {str(e)}")
            raise e

    async def disconnect(self) -> None:
        if self.pool:
            await self.pool.close()
            logger.info(f"Disconnected from PostgreSQL: {self.connection_name}")

    async def get_connection(self) -> asyncpg.Pool:
        if not self.pool:
            await self.connect()
        return self.pool

    async def test_connection(self) -> bool:
        try:
            async with self.pool.acquire() as conn:
                await conn.execute("SELECT 1")
                return True
        except Exception as e:
            logger.error(f"PostgreSQL test connection failed ({self.connection_name}): {str(e)}")
            return False