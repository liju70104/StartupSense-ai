from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.auth import router as auth_router
from backend.routes.ideas import router as ideas_router
from backend.routes.user_system import router as user_system_router

app = FastAPI(
    title="StartupSense-AI",
    version="2.0.0",
    description="AI Powered Startup Validation Platform"
)

# ----------------------------
# CORS Configuration
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
         "https://startupsense-ai.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Register API Routes
# ----------------------------
app.include_router(auth_router)
app.include_router(ideas_router)
app.include_router(user_system_router)

# ----------------------------
# Root Endpoint
# ----------------------------
@app.get("/")
def home():
    return {
        "success": True,
        "application": "StartupSense-AI",
        "version": "2.0.0",
        "message": "Backend Running Successfully",
        "modules": [
            "Authentication",
            "Startup Analysis",
            "Dashboard",
            "History",
            "Reports",
            "User Profile",
            "User Settings",
            "Notifications",
            "Login History",
            "System Status"
        ]
    }


# ----------------------------
# Health Check
# ----------------------------
@app.get("/health")
def health():
    return {
        "success": True,
        "status": "Healthy",
        "frontend": "Connected",
        "backend": "Running",
        "database": "MongoDB Atlas",
        "ai_engine": "Gemini AI",
        "version": "2.0.0"
    }