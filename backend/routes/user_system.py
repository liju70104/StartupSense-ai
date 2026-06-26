from fastapi import APIRouter
from datetime import datetime

from backend.database import (
    user_profiles,
    user_settings,
    notifications,
    login_history,
    system_logs,
    analysis_results
)

router = APIRouter()


def now():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@router.get("/profile")
def get_profile(email: str = "demo@startupsense.ai"):
    profile = user_profiles.find_one({"email": email})

    if not profile:
        profile = {
            "name": "Liju",
            "email": email,
            "role": "Founder",
            "college": "VSB Engineering College",
            "department": "Artificial Intelligence and Data Science",
            "country_timezone": "India / Asia-Kolkata",
            "created_at": now(),
            "last_login": now(),
            "profile_photo": ""
        }
        user_profiles.insert_one(profile)

    profile["_id"] = str(profile["_id"])

    return {
        "success": True,
        "profile": profile
    }


@router.post("/profile")
def update_profile(data: dict):
    email = data.get("email", "demo@startupsense.ai")
    data["updated_at"] = now()

    user_profiles.update_one(
        {"email": email},
        {"$set": data},
        upsert=True
    )

    return {
        "success": True,
        "message": "Profile updated successfully"
    }


@router.get("/settings")
def get_settings(email: str = "demo@startupsense.ai"):
    settings = user_settings.find_one({"email": email})

    if not settings:
        settings = {
            "email": email,
            "theme": "dark",
            "accent": "Blue",
            "font_size": "Medium",
            "animations": True,
            "compact_mode": False,
            "email_notifications": True,
            "browser_notifications": True,
            "analysis_alerts": True,
            "weekly_summary": False,
            "ai_recommendation_alerts": True,
            "gemini_model": "Gemini AI",
            "creativity": 0.7,
            "response_length": "Detailed",
            "auto_swot": True,
            "auto_save": True,
            "two_factor": False,
            "created_at": now(),
            "updated_at": now()
        }
        user_settings.insert_one(settings)

    settings["_id"] = str(settings["_id"])

    return {
        "success": True,
        "settings": settings
    }


@router.post("/settings")
def update_settings(data: dict):
    email = data.get("email", "demo@startupsense.ai")
    data["updated_at"] = now()

    user_settings.update_one(
        {"email": email},
        {"$set": data},
        upsert=True
    )

    return {
        "success": True,
        "message": "Settings updated successfully"
    }


@router.get("/notifications")
def get_notifications(email: str = "demo@startupsense.ai"):
    items = list(
        notifications.find({"email": email}).sort("created_at", -1)
    )

    if len(items) == 0:
        default_items = [
            {
                "email": email,
                "title": "System active",
                "message": "React frontend and FastAPI backend are connected.",
                "type": "system",
                "read": False,
                "created_at": now()
            },
            {
                "email": email,
                "title": "MongoDB synced",
                "message": "MongoDB Atlas is storing your startup analyses.",
                "type": "database",
                "read": False,
                "created_at": now()
            },
            {
                "email": email,
                "title": "AI engine ready",
                "message": "Gemini AI analysis engine is ready.",
                "type": "ai",
                "read": False,
                "created_at": now()
            }
        ]

        notifications.insert_many(default_items)
        items = list(
            notifications.find({"email": email}).sort("created_at", -1)
        )

    for item in items:
        item["_id"] = str(item["_id"])

    return {
        "success": True,
        "notifications": items
    }


@router.post("/notifications")
def add_notification(data: dict):
    data["created_at"] = now()
    data["read"] = data.get("read", False)

    notifications.insert_one(data)

    return {
        "success": True,
        "message": "Notification added"
    }


@router.post("/notifications/read")
def mark_notifications_read(data: dict):
    email = data.get("email", "demo@startupsense.ai")

    notifications.update_many(
        {"email": email},
        {"$set": {"read": True}}
    )

    return {
        "success": True,
        "message": "Notifications marked as read"
    }


@router.delete("/notifications")
def clear_notifications(email: str = "demo@startupsense.ai"):
    notifications.delete_many({"email": email})

    return {
        "success": True,
        "message": "Notifications cleared"
    }


@router.get("/system/status")
def system_status():
    total_records = analysis_results.count_documents({})

    return {
        "success": True,
        "status": {
            "frontend": "Online",
            "backend": "Connected",
            "mongodb": "Connected",
            "gemini": "Connected",
            "render": "Running",
            "api_version": "1.0.0",
            "records": total_records,
            "last_sync": now()
        }
    }


@router.post("/login-history")
def add_login_history(data: dict):
    data["created_at"] = now()
    login_history.insert_one(data)

    return {
        "success": True,
        "message": "Login history added"
    }


@router.get("/login-history")
def get_login_history(email: str = "demo@startupsense.ai"):
    items = list(
        login_history.find({"email": email}).sort("created_at", -1)
    )

    for item in items:
        item["_id"] = str(item["_id"])

    return {
        "success": True,
        "login_history": items
    }