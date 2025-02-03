from .base import DatabaseConnection
from app.core.logger import logger
import aiomysql
from typing import Optional, Dict

class MySQLConnection(DatabaseConnection):
    def __init__(self, connection_name: str, config: Dict):
        self.connection_name = connection_name
        self.config = config
        self.pool: Optional[aiomysql.Pool] = None

    async def connect(self) -> None:
        try:
            self.pool = await aiomysql.create_pool(
                host=self.config.get('host'),
                port=int(self.config.get('port', 3306)),
                user=self.config.get('user'),
                password=self.config.get('password'),
                db=self.config.get('database'),
                autocommit=True
            )
            logger.info(f"Connected to MySQL database: {self.connection_name}")
        except Exception as e:
            logger.error(f"MySQL connection error ({self.connection_name}): {str(e)}")
            raise e

    async def disconnect(self) -> None:
        if self.pool:
            self.pool.close()
            await self.pool.wait_closed()
            logger.info(f"Disconnected from MySQL: {self.connection_name}")

    async def get_connection(self) -> aiomysql.Connection:
        if not self.pool:
            await self.connect()
        return await self.pool.acquire()

    async def test_connection(self) -> bool:
        try:
            async with self.pool.acquire() as conn:
                async with conn.cursor() as cur:
                    await cur.execute("SELECT 1")
                    return True
        except Exception as e:
            logger.error(f"MySQL test connection failed ({self.connection_name}): {str(e)}")
            return False