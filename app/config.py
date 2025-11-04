from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./tai.db"
    
    # Redis
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
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "https://dolese.tech",
        "https://www.dolese.tech",
        "http://dolese.tech",
        "http://www.dolese.tech",
    ]
    
    # App settings
    APP_NAME: str = "TAI Developer Assistant"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()