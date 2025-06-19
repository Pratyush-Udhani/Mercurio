# app/core/config.py
from pathlib import Path
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "Mercurio"
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    DEBUG: bool    = True
    HOST: str      = "0.0.0.0"
    PORT: int      = 8000

    class Config:
        env_file = ".env"

settings = Settings()

