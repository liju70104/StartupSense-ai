from fastapi import APIRouter
from datetime import datetime

from backend.database import users
from backend.models.user import UserRegister, UserLogin
from backend.config import hash_password, verify_password

router = APIRouter()


def now():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@router.post("/register")
def register_user(user: UserRegister):
    existing_user = users.find_one({"email": user.email})

    if existing_user:
        return {
            "success": False,
            "message": "Email already registered"
        }

    users.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "state": user.state,
        "district": user.district,
        "created_at": now(),
        "last_login": ""
    })

    return {
        "success": True,
        "message": "User registered successfully"
    }


@router.post("/login")
def login_user(user: UserLogin):
    existing_user = users.find_one({"email": user.email})

    if not existing_user:
        return {
            "success": False,
            "message": "User not found"
        }

    if not verify_password(user.password, existing_user["password"]):
        return {
            "success": False,
            "message": "Incorrect password"
        }

    login_time = now()

    users.update_one(
        {"email": user.email},
        {"$set": {"last_login": login_time}}
    )

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "name": existing_user.get("name", ""),
            "email": existing_user.get("email", ""),
            "state": existing_user.get("state", ""),
            "district": existing_user.get("district", ""),
            "created_at": existing_user.get("created_at", ""),
            "last_login": login_time
        }
    }


@router.post("/forgot-password")
def forgot_password(data: dict):
    email = data.get("email")
    new_password = data.get("new_password")

    if not email or not new_password:
        return {
            "success": False,
            "message": "Email and new password are required"
        }

    existing_user = users.find_one({"email": email})

    if not existing_user:
        return {
            "success": False,
            "message": "User not found"
        }

    users.update_one(
        {"email": email},
        {"$set": {"password": hash_password(new_password)}}
    )

    return {
        "success": True,
        "message": "Password reset successfully. Please login again."
    }