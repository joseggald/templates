from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.logger import logger
from app.db import MongoDBConnection, MySQLConnection, PostgreSQLConnection

# Global connections storage
connections = {
    'mongo': {},
    'mysql': {},
    'postgres': {}
}

async def init_databases():
    """Initialize all database connections"""
    # Initialize MongoDB connections
    for conn_name, config in settings.MONGO_CONNECTIONS.items():
        if config['url']:
            try:
                connections['mongo'][conn_name] = MongoDBConnection(conn_name)
                await connections['mongo'][conn_name].connect()
                logger.info(f"✅ MongoDB connection initialized: {conn_name}")
            except Exception as e:
                logger.error(f"❌ Failed to initialize MongoDB {conn_name}: {str(e)}")

    # Initialize MySQL connections
    for conn_name, config in settings.MYSQL_CONNECTIONS.items():
        if config.host:
            try:
                connections['mysql'][conn_name] = MySQLConnection(conn_name, config.__dict__)
                await connections['mysql'][conn_name].connect()
                logger.info(f"✅ MySQL connection initialized: {conn_name}")
            except Exception as e:
                logger.error(f"❌ Failed to initialize MySQL {conn_name}: {str(e)}")

    # Initialize PostgreSQL connections
    for conn_name, config in settings.POSTGRES_CONNECTIONS.items():
        if config.host:
            try:
                connections['postgres'][conn_name] = PostgreSQLConnection(conn_name, config.__dict__)
                await connections['postgres'][conn_name].connect()
                logger.info(f"✅ PostgreSQL connection initialized: {conn_name}")
            except Exception as e:
                logger.error(f"❌ Failed to initialize PostgreSQL {conn_name}: {str(e)}")

async def close_databases():
    """Close all database connections"""
    # Close MongoDB connections
    for conn in connections['mongo'].values():
        await conn.disconnect()
    
    # Close MySQL connections
    for conn in connections['mysql'].values():
        await conn.disconnect()
    
    # Close PostgreSQL connections
    for conn in connections['postgres'].values():
        await conn.disconnect()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage the lifespan of the application"""
    logger.info("🚀 Starting application...")
    
    # Initialize all database connections
    await init_databases()
    
    yield
    
    # Cleanup
    logger.info("⏹️ Shutting down application...")
    await close_databases()