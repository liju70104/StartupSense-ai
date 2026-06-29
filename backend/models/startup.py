from pydantic import BaseModel
from typing import Optional


class StartupIdea(BaseModel):
    startup_name: str
    industry: str
    problem: str
    solution: str
    target_audience: str
    revenue_model: str
    competitors: str
    user_email: Optional[str] = "demo@startupsense.ai"