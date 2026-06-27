from fastapi import APIRouter

from backend.database import users
from backend.models.user import UserRegister, UserLogin
from backend.config import hash_password, verify_password

router = APIRouter()


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
        "password": hash_password(user.password)
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

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "name": existing_user["name"],
            "email": existing_user["email"]
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