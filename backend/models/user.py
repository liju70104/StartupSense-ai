from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    state: str
    district: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str