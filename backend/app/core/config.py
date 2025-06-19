# app/core/config.py
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "Mercurio"
    DEBUG: bool    = True
    HOST: str      = "0.0.0.0"
    PORT: int      = 8000

    class Config:
        env_file = ".env"

settings = Settings()

