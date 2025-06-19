# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from app.db.session import engine
from app.core.config import settings
from app.routers.health import router as health_router
from app.routers.scrape import router as scrape_router
from app.routers.workflows import router as workflows_router

def create_app() -> FastAPI:
    SQLModel.metadata.create_all(engine)
    app = FastAPI(
        title=settings.APP_NAME,
        debug=settings.DEBUG,
    )

    # —— CORS setup — allow all origins, headers, methods —— 
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],            # <-- allow any origin
        allow_credentials=True,         # <-- allow cookies, authorization headers
        allow_methods=["*"],            # <-- allow GET, POST, OPTIONS, etc.
        allow_headers=["*"],            # <-- allow all headers
    )

    # Include routers
    app.include_router(health_router)
    app.include_router(scrape_router)
    app.include_router(workflows_router)

    return app

app = create_app()

