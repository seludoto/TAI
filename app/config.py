from pydantic_settings import BaseSettings
from typing import List, Optional, Union
from pydantic import field_validator, model_validator, Field
import os
import json

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./tai.db"
    
    # Redis (optional - set to empty string if not available)
    REDIS_URL: str = "redis://localhost:6379"
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AI Provider Configuration
    AI_PROVIDER: str = "ollama"  # 'ollama' or 'digitalocean'
    
    # Ollama (Local LLM)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "mistral"  # Can be 'llama2', 'mistral', 'codellama', etc.
    
    # DigitalOcean GenAI
    DIGITALOCEAN_API_KEY: str = ""  # Set in .env file
    DIGITALOCEAN_MODEL: str = "meta-llama/llama-3.1-8b-instruct"  # or other available models
    
    # CORS - Simple string list, no complex parsing
    ALLOWED_ORIGINS: str = "*"
    
    # App settings
    APP_NAME: str = "TAI Developer Assistant"
    DEBUG: bool = True
    
    @model_validator(mode='after')
    def parse_cors_origins(self):
        # Convert ALLOWED_ORIGINS to list for use in FastAPI
        if isinstance(self.ALLOWED_ORIGINS, str):
            if self.ALLOWED_ORIGINS == "*":
                # Allow all origins (for testing)
                self.ALLOWED_ORIGINS = ["*"]
            else:
                # Parse comma-separated string
                self.ALLOWED_ORIGINS = [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
        return self
    
    @model_validator(mode='after')
    def process_database_url(self):
        # Fix Heroku DATABASE_URL (postgres:// -> postgresql://)
        if self.DATABASE_URL and self.DATABASE_URL.startswith("postgres://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        
        return self
    
    class Config:
        env_file = ".env"

settings = Settings()