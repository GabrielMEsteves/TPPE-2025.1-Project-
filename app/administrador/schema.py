from pydantic import BaseModel, EmailStr
from typing import Optional

class AdminBase(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class AdminCreate(AdminBase):
    name: str
    email: EmailStr
    password: str

class AdminOut(AdminBase):
    id: int
    class Config:
        from_attributes = True

class AdminLogin(BaseModel):
    email: EmailStr
    password: str
