from pydantic_settings import BaseSettings
from typing import List

import os
import json

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./tai.db")
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Heroku uses postgres:// but SQLAlchemy 1.4+ requires postgresql://
        if self.DATABASE_URL and self.DATABASE_URL.startswith("postgres://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        
        # Parse ALLOWED_ORIGINS from environment variable if it's a JSON string
        allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
        if allowed_origins_env:
            try:
                self.ALLOWED_ORIGINS = json.loads(allowed_origins_env)
            except json.JSONDecodeError:
                # If it's not JSON, treat it as a comma-separated list
                self.ALLOWED_ORIGINS = [origin.strip() for origin in allowed_origins_env.split(",")]
    
    # Redis (optional - set to empty string if not available)
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
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
    ALLOWED_ORIGINS: List[str] = [
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
    
    # App settings
    APP_NAME: str = "TAI Developer Assistant"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()