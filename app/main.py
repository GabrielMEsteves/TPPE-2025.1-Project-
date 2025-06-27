from administrador import router as admin_router
from database import Base, engine
from fastapi import FastAPI
from itinerario import router as itinerario_router
from model.model import Admin, Itinerario, Passagem, User
from passagem import router as passagem_router
from usuario import router as usuario_router

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(usuario_router.router, prefix="/api/v1")
app.include_router(itinerario_router.router, prefix="/api/v1")
app.include_router(passagem_router.router, prefix="/api/v1")
app.include_router(admin_router.router, prefix="/api/v1")
