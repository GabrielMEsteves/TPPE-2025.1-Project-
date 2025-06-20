from fastapi import FastAPI
from usuario import router as usuario_router
from itinerario import router as itinerario_router
from passagem import router as passagem_router
from database import Base, engine
from model.model import User, Itinerario, Passagem

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(usuario_router.router, prefix="/api/v1")
app.include_router(itinerario_router.router, prefix="/api/v1")
app.include_router(passagem_router.router, prefix="/api/v1")