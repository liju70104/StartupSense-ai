from fastapi import FastAPI

from backend.routes.auth import router as auth_router
from backend.routes.ideas import router as ideas_router

app = FastAPI(
    title="StartupSense-AI",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(ideas_router)

@app.get("/")
def home():
    return {
        "message": "StartupSense-AI Backend Running"
    }