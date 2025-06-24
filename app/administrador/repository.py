from sqlalchemy.orm import Session
from app.model.model import Admin
from .schema import AdminCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_admin_by_email(db: Session, email: str):
    return db.query(Admin).filter(Admin.email == email).first()

def create_admin(db: Session, admin: AdminCreate):
    hashed_password = pwd_context.hash(admin.password)
    db_admin = Admin(name=admin.name, email=admin.email, hashed_password=hashed_password)
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

def authenticate_admin(db: Session, email: str, password: str):
    admin = get_admin_by_email(db, email)
    if not admin:
        return None
    if not pwd_context.verify(password, admin.hashed_password):
        return None
    return admin
