from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.responses import JSONResponse
import os
from dotenv import load_dotenv
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("MASCOT mHealth API started")
    logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    logger.info("API Documentation available at http://localhost:8000/docs")
    try:
        from database.connection import init_db
        init_db()
    except Exception as e:
        logger.warning(f"Database init skipped: {e}")
    yield
    logger.info("MASCOT mHealth API shutting down")


app = FastAPI(
    title="MASCOT mHealth API",
    description="Mobile Health Supported Self-Care Among Tertiary Education Students in Zimbabwe",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.auth import router as auth_router
from routes.prevention import router as prevention_router
from routes.clinics import router as clinics_router
from routes.counselling import router as counselling_router
from routes.ai_assistant import router as ai_router

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(prevention_router, prefix="/api/prevention", tags=["Prevention Methods"])
app.include_router(clinics_router, prefix="/api/clinics", tags=["Clinics & Services"])
app.include_router(counselling_router, prefix="/api/counselling", tags=["Counselling"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI Assistant"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to MASCOT mHealth API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "MASCOT mHealth API",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation error",
            "errors": exc.errors()
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
