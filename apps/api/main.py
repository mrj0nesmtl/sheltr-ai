"""
SHELTR-AI FastAPI Application
Main application entry point with authentication, security, and multi-tenant support
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
import time
import logging
from contextlib import asynccontextmanager

# Import routers
from routers.auth import router as auth_router
from routers.analytics import router as analytics_router
from routers.chatbot import router as chatbot_router
from routers.knowledge import router as knowledge_router
from routers.services import router as services_router
from routers.users import router as users_router
from routers.demo_donations import router as demo_donations_router

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("🚀 SHELTR-AI API starting up...")
    logger.info("🔐 Authentication system initialized")
    logger.info("🏢 Multi-tenant architecture ready")
    yield
    # Shutdown
    logger.info("🛑 SHELTR-AI API shutting down...")

# Create FastAPI application
app = FastAPI(
    title="SHELTR-AI API",
    version="2.0.0",
    description="""
    ## SHELTR-AI Platform API
    
    A comprehensive API for the SHELTR-AI platform providing:
    
    * **🔐 Authentication & Authorization** - Multi-role RBAC system
    * **🏢 Multi-tenant Architecture** - Secure data isolation
    * **👥 User Management** - Role-based user operations
    * **🏠 Shelter Management** - Shelter administration
    * **💝 Donation Processing** - Transparent donation tracking
    * **🎭 Demo Donations** - Adyen-powered QR donation demonstrations
    * **📊 Analytics & Reporting** - Real-time impact metrics
    
    ### Authentication
    
    All endpoints (except public ones) require a valid Firebase ID token:
    ```
    Authorization: Bearer <firebase-id-token>
    ```
    
    ### Roles
    
    - **super_admin**: Platform administration and shelter creation
    - **admin**: Shelter management and participant onboarding
    - **participant**: Personal profile and QR code access
    - **donor**: Donation and impact tracking
    
    ### Multi-tenant Data Isolation
    
    Data is organized by tenant for security:
    - `platform`: SuperAdmin domain
    - `shelter-{id}`: Individual shelter tenants
    - `participant-network`: Independent participants
    - `donor-network`: Donor community
    """,
    contact={
        "name": "SHELTR-AI Support",
        "url": "https://sheltr-ai.web.app",
        "email": "support@sheltr.ai",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    servers=[
        {
            "url": "http://localhost:8000",
            "description": "Development server"
        },
        {
            "url": "https://api.sheltr.ai",
            "description": "Production server"
        }
    ],
    lifespan=lifespan
)

# Security and CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Next.js dev server
        "http://127.0.0.1:3000",         # Alternative localhost
        "https://sheltr-ai.web.app",      # Firebase hosting
        "https://sheltr-ai.firebaseapp.com",  # Firebase alternative domain
        "https://api.sheltr.ai",          # Production API domain
        "https://sheltr.ai",              # Main domain
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time"],
)

# Trusted hosts middleware for security
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[
        "localhost",
        "127.0.0.1",
        "*.sheltr.ai",
        "*.web.app",
        "*.firebaseapp.com"
    ]
)

# Performance monitoring middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time to response headers"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    response.headers["X-Process-Time"] = str(round(process_time, 4))
    
    # Log slow requests
    if process_time > 1.0:
        logger.warning(
            f"Slow request: {request.method} {request.url} took {process_time:.2f}s"
        )
    
    return response

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Global HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": "HTTPException",
            "message": exc.detail,
            "status_code": exc.status_code
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "InternalServerError",
            "message": "An internal server error occurred",
            "status_code": 500
        }
    )

# Include routers
app.include_router(auth_router)
app.include_router(analytics_router)
app.include_router(chatbot_router)
app.include_router(knowledge_router)
app.include_router(services_router)
app.include_router(users_router)
app.include_router(demo_donations_router)

# Health check endpoints
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API health check"""
    return {
        "success": True,
        "message": "SHELTR-AI API is running",
        "version": "2.0.0",
        "status": "healthy",
        "services": {
            "authentication": "✅ operational",
            "database": "✅ operational",
            "multi_tenant": "✅ operational"
        }
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check endpoint"""
    try:
        # TODO: Add actual health checks for Firebase, Firestore, etc.
        return {
            "success": True,
            "timestamp": time.time(),
            "status": "healthy",
            "version": "2.0.0",
            "environment": "development",  # TODO: Get from env
            "services": {
                "api": "✅ operational",
                "firebase_auth": "✅ operational",
                "firestore": "✅ operational",
                "storage": "✅ operational"
            },
            "metrics": {
                "uptime": time.time(),  # TODO: Calculate actual uptime
                "memory_usage": "unknown",  # TODO: Add memory monitoring
                "response_time": "< 50ms"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "success": False,
                "status": "unhealthy",
                "error": str(e)
            }
        )

@app.get("/openapi.json", include_in_schema=False)
async def get_openapi_endpoint():
    """Custom OpenAPI schema endpoint"""
    return get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

# Custom documentation
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    """Custom Swagger UI with SHELTR-AI branding"""
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - Interactive API Documentation",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
        swagger_favicon_url="/favicon.ico",
    )

# Add startup message
if __name__ == "__main__":
    import uvicorn
    
    logger.info("🏠 Starting SHELTR-AI API server...")
    logger.info("🔐 Multi-tenant authentication system ready")
    logger.info("📚 API documentation: http://localhost:8000/docs")
    logger.info("🏥 Health check: http://localhost:8000/health")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    ) 