from fastapi import APIRouter
from backend.database import users
from backend.models.user import UserRegister, UserLogin
from backend.config import hash_password, verify_password

router = APIRouter()

# REGISTER API
@router.post("/register")
def register_user(user: UserRegister):

    existing_user = users.find_one({
        "email": user.email
    })

    if existing_user:
        return {
            "success": False,
            "message": "Email already registered"
        }

    hashed_pw = hash_password(user.password)

    users.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_pw
    })

    return {
        "success": True,
        "message": "User registered successfully"
    }


# LOGIN API
@router.post("/login")
def login_user(user: UserLogin):

    existing_user = users.find_one({
        "email": user.email
    })

    if not existing_user:
        return {
            "success": False,
            "message": "User not found"
        }

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
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