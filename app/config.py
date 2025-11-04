from pydantic_settings import BaseSettings
from typing import List, Optional
from pydantic import field_validator, model_validator
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
    
    # CORS - Default origins (can be overridden by ALLOWED_ORIGINS env var)
    ALLOWED_ORIGINS: str = ""  # Will be parsed from env or use defaults
    
    # App settings
    APP_NAME: str = "TAI Developer Assistant"
    DEBUG: bool = True
    
    @model_validator(mode='after')
    def process_settings(self):
        # Fix Heroku DATABASE_URL (postgres:// -> postgresql://)
        if self.DATABASE_URL and self.DATABASE_URL.startswith("postgres://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        
        # Parse ALLOWED_ORIGINS
        if self.ALLOWED_ORIGINS:
            try:
                # Try to parse as JSON
                self.ALLOWED_ORIGINS = json.loads(self.ALLOWED_ORIGINS)
            except (json.JSONDecodeError, TypeError):
                # If it's not JSON, treat it as comma-separated
                self.ALLOWED_ORIGINS = [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
        else:
            # Use default origins
            self.ALLOWED_ORIGINS = [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:8080",
                "https://dolese.tech",
                "https://www.dolese.tech",
                "http://dolese.tech",
                "http://www.dolese.tech",
                "https://tai-fjud1g3fw-selus-projects-5458cfd3.vercel.app",
                "https://vercel.app",
            ]
        
        return self
    
    class Config:
        env_file = ".env"

settings = Settings()