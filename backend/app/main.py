import logging
from fastapi import FastAPI, HTTPException, status, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.schemas import DecisionInput, AnalysisResult, ErrorResponse
from app.security import sanitize_text, limit_request_size
from app.gemini_engine import run_gemini_analysis

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("blindspot.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for The Blind Spot - AI-powered decision analysis platform."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

@app.get("/", tags=["Health"])
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }

@app.post(
    "/api/analyze",
    response_model=AnalysisResult,
    responses={
        400: {"model": ErrorResponse},
        413: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
    tags=["Analysis"],
    dependencies=[Depends(limit_request_size)]
)
async def analyze_decision(payload: DecisionInput):
    try:
        sanitized_input = DecisionInput(
            title=sanitize_text(payload.title),
            situation=sanitize_text(payload.situation),
            options=[sanitize_text(opt) for opt in payload.options if opt.strip()],
            reasoning=sanitize_text(payload.reasoning),
            priorities=sanitize_text(payload.priorities),
            concerns=sanitize_text(payload.concerns) if payload.concerns else ""
        )

        logger.info(f"Analyzing decision: '{sanitized_input.title}' with {len(sanitized_input.options)} options.")
        result = await run_gemini_analysis(sanitized_input)
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unhandled analysis error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your decision analysis. Please try again."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
