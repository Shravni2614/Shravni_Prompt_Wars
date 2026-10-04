import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "The Blind Spot API"
    VERSION: str = "1.0.0"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            CORS_ORIGINS="https://your-app.vercel.app"
            ).split(",")
        if origin.strip()
    ]
    
    MAX_REQUEST_SIZE_BYTES: int = 500 * 1024

settings = Settings()
