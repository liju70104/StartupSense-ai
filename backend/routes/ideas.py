from fastapi import APIRouter
from datetime import datetime

from backend.database import (
    startup_ideas,
    analysis_results
)

from backend.models.startup import StartupIdea

from backend.services.ai_engine import (
    analyze_startup_idea
)

from backend.services.gemini_service import (
    analyze_startup_idea_ai
)

router = APIRouter()


@router.post("/analyze")
def analyze_idea(idea: StartupIdea):

    idea_data = idea.dict()

    idea_data["created_at"] = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    inserted_idea = startup_ideas.insert_one(
        idea_data
    )

    # NORMAL SCORING ENGINE
    result = analyze_startup_idea(idea)

    # GEMINI AI ANALYSIS
    ai_analysis = analyze_startup_idea_ai(
        idea_data
    )

    result["idea_id"] = str(
        inserted_idea.inserted_id
    )

    result["created_at"] = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    result["ai_analysis"] = ai_analysis

    analysis_results.insert_one(
        result.copy()
    )

    return {
        "success": True,
        "message": "Idea analyzed successfully",
        "analysis": result
    }


@router.get("/history")
def get_history():

    ideas = list(
        startup_ideas.find().sort(
            "created_at",
            -1
        )
    )

    for idea in ideas:
        idea["_id"] = str(idea["_id"])

    return {
        "success": True,
        "history": ideas
    }


@router.get("/dashboard")
def dashboard_stats():

    results = list(
        analysis_results.find()
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
        item.get("overall_score", 0)
        for item in results
    ]

    return {
        "success": True,
        "total_ideas": total_ideas,
        "average_score": int(
            sum(scores) / total_ideas
        ),
        "highest_score": max(scores)
    }