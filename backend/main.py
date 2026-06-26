from fastapi import FastAPI

from backend.routes.auth import router as auth_router
from backend.routes.ideas import router as ideas_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="StartupSense-AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://startupsense-ai-fdjgkoqjnbcswuwpwg6iwf.streamlit.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
)

app.include_router(auth_router)
app.include_router(ideas_router)

@app.get("/")
def home():
    return {
        "message": "StartupSense-AI Backend Running"
    }