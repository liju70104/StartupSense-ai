from fastapi import APIRouter
from datetime import datetime

from backend.database import startup_ideas, analysis_results
from backend.models.startup import StartupIdea
from backend.services.ai_engine import analyze_startup_idea
from backend.services.gemini_service import analyze_startup_idea_ai

router = APIRouter()


def now():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@router.post("/analyze")
def analyze_idea(idea: StartupIdea):
    idea_data = idea.dict()

    user_email = idea_data.get("user_email") or "demo@startupsense.ai"

    idea_data["user_email"] = user_email
    idea_data["created_at"] = now()

    inserted_idea = startup_ideas.insert_one(idea_data)

    result = analyze_startup_idea(idea)
    ai_analysis = analyze_startup_idea_ai(idea_data)

    result["idea_id"] = str(inserted_idea.inserted_id)
    result["created_at"] = now()
    result["startup_name"] = idea_data.get("startup_name", "")
    result["industry"] = idea_data.get("industry", "")
    result["user_email"] = user_email
    result["ai_analysis"] = ai_analysis

    analysis_results.insert_one(result.copy())

    return {
        "success": True,
        "message": "Idea analyzed successfully",
        "analysis": result
    }


@router.get("/history")
def get_history(email: str):
    results = list(
        analysis_results.find({"user_email": email}).sort("created_at", -1)
    )

    for item in results:
        item["_id"] = str(item["_id"])

    return {
        "success": True,
        "history": results
    }


@router.get("/dashboard")
def dashboard_stats(email: str):
    results = list(
        analysis_results.find({"user_email": email})
    )

    total_ideas = len(results)

    if total_ideas == 0:
        return {
            "success": True,
            "total_ideas": 0,
            "average_score": 0,
            "highest_score": 0
        }

    scores = [
        int(item.get("overall_score", 0))
        for item in results
    ]

    return {
        "success": True,
        "total_ideas": total_ideas,
        "average_score": int(sum(scores) / total_ideas),
        "highest_score": max(scores)
    }