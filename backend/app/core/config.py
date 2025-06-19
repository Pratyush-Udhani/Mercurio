# app/core/config.py
import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    APP_NAME: str = "Mercurio"
    BASE_DIR: Path = Path(__file__).resolve().parents[2]
    DEBUG: bool    = True
    HOST: str      = "0.0.0.0"
    PORT: int      = 8000
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    class Config:
        env_file = ".env"

settings = Settings()

