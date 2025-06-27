from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserCreate(UserBase):
    name: str
    email: EmailStr
    password: str


class UserUpdate(UserBase):
    password: Optional[str] = None


class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str
