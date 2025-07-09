from model.model import Admin
from database import SessionLocal
from passlib.context import CryptContext

# Dados do admin
ADMIN_NAME = "Admin"
ADMIN_EMAIL = "admin@email.com"
ADMIN_PASSWORD = "123456"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def main():
    db = SessionLocal()
    try:
        # Verifica se já existe admin com esse email
        if db.query(Admin).filter(Admin.email == ADMIN_EMAIL).first():
            print("Admin já existe.")
            return
        hashed_password = pwd_context.hash(ADMIN_PASSWORD)
        admin = Admin(name=ADMIN_NAME, email=ADMIN_EMAIL, hashed_password=hashed_password)
        db.add(admin)
        db.commit()
        print("Admin criado com sucesso!")
    finally:
        db.close()

if __name__ == "__main__":
    main() 