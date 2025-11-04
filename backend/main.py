from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.database import engine, Base
from app.routers import auth, chat, tools
from app.config import settings

# Remove database creation from module level to avoid connection issues
# Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting TAI Backend...")
    # Create database tables on startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    print("Shutting down TAI Backend...")

app = FastAPI(
    title="TAI - Tanzania AI Developer Assistant",
    description="AI-powered programming assistance platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(tools.router, prefix="/api/tools", tags=["developer-tools"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to TAI - Tanzania AI Developer Assistant",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )