from pydantic_settings import BaseSettings
from pydantic import BaseModel
from typing import Optional, Dict
import os

class DBConfig(BaseModel):
    host: Optional[str] = None
    port: Optional[int] = None
    user: Optional[str] = None
    password: Optional[str] = None
    database: Optional[str] = None

class MongoConfig(BaseModel):
    url: Optional[str] = None
    db_name: str = 'db_arqui2'

class Settings(BaseSettings):
    # Server Settings
    PORT: int = 3000
    ENVIRONMENT: str = 'development'
    
    # MongoDB Configuration
    MONGO_URL: Optional[str] = None
    MONGO_DB_NAME: str = 'db_arqui2'
    
    # PostgreSQL Configuration
    PG_HOST: Optional[str] = None
    PG_PORT: int = 5432
    PG_USER: Optional[str] = None
    PG_PASSWORD: Optional[str] = None
    PG_DATABASE: Optional[str] = None
    
    # MySQL Configuration
    MYSQL_HOST: Optional[str] = None
    MYSQL_PORT: int = 3306
    MYSQL_USER: Optional[str] = None
    MYSQL_PASSWORD: Optional[str] = None
    MYSQL_DATABASE: Optional[str] = None
    
    # JWT Settings
    JWT_SECRET: str = ''
    JWT_EXPIRES_IN: str = '1d'
    JWT_REFRESH_EXPIRY: str = '7d'
    
    # Security Settings
    SALT_ROUNDS: int = 10
    PASSWORD_MIN_LENGTH: int = 8
    PASSWORD_MAX_LENGTH: int = 50
    
    class Config:
        env_file = ".env"
    
    @property
    def mongo_config(self) -> Dict[str, MongoConfig]:
        return {
            'default': MongoConfig(
                url=self.MONGO_URL,
                db_name=self.MONGO_DB_NAME
            )
        }
    
    @property
    def postgres_config(self) -> Dict[str, DBConfig]:
        return {
            'default': DBConfig(
                host=self.PG_HOST,
                port=self.PG_PORT,
                user=self.PG_USER,
                password=self.PG_PASSWORD,
                database=self.PG_DATABASE
            )
        }
    
    @property
    def mysql_config(self) -> Dict[str, DBConfig]:
        return {
            'default': DBConfig(
                host=self.MYSQL_HOST,
                port=self.MYSQL_PORT,
                user=self.MYSQL_USER,
                password=self.MYSQL_PASSWORD,
                database=self.MYSQL_DATABASE
            )
        }

settings = Settings()