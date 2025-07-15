from datetime import datetime, timedelta
from typing import List, Optional

from administrador import repository, schema
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from itinerario import repositoy as itin_repository
from itinerario import schema as itin_schema
from itinerario.schema import ItinerarioCreateNoAdminId
from jose import JWTError, jwt
from passagem import repository as passagem_repository
from passagem import schema as passagem_schema
from sqlalchemy.orm import Session
from usuario import repository as usuario_repository
from usuario import schema as usuario_schema

SECRET_KEY = "admin_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/admin/login")

router = APIRouter(prefix="/admin", tags=["admin"])


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_admin(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not isinstance(email, str):
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    admin = repository.get_admin_by_email(db, email=email)
    if admin is None:
        raise credentials_exception
    return admin


@router.post("/signup", response_model=schema.AdminOut, status_code=201)
def create_admin(admin: schema.AdminCreate, db: Session = Depends(get_db)):
    db_admin = repository.get_admin_by_email(db, email=admin.email)
    if db_admin:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    return repository.create_admin(db, admin)


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    admin = repository.authenticate_admin(
        db, form_data.username, form_data.password
    )
    if not admin:
        raise HTTPException(
            status_code=400, detail="Email ou senha incorretos"
        )
    access_token = create_access_token(data={"sub": admin.email})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post(
    "/itinerarios",
    response_model=itin_schema.ItinerarioOut,
    status_code=201,
)
def create_itinerario_admin(
    itin: itin_schema.ItinerarioCreateNoAdminId,
    db: Session = Depends(get_db),
    current_admin: schema.AdminOut = Depends(get_current_admin),
):
    itin_data = itin.dict()
    itin_data["admin_id"] = current_admin.id
    return itin_repository.create_itinerario(db, itin_schema.ItinerarioCreate(**itin_data))


@router.get("/itinerarios", response_model=List[itin_schema.ItinerarioOut])
def listar_itinerarios_admin(
    db: Session = Depends(get_db),
    current_admin: schema.AdminOut = Depends(get_current_admin),
):
    return itin_repository.list_itinerarios(db)


@router.get("/itinerarios/{itinerario_id}", response_model=itin_schema.ItinerarioOut)
def obter_itinerario_admin(
    itinerario_id: int,
    db: Session = Depends(get_db),
    current_admin: schema.AdminOut = Depends(get_current_admin),
):
    """Obtém um itinerário específico por ID"""
    itinerario = itin_repository.get_itinerario_by_id(db, itinerario_id)
    if not itinerario:
        raise HTTPException(status_code=404, detail="Itinerário não encontrado")
    return itinerario


@router.delete("/itinerarios/{itinerario_id}", status_code=204)
def deletar_itinerario_admin(
    itinerario_id: int,
    db: Session = Depends(get_db),
    current_admin: schema.AdminOut = Depends(get_current_admin),
):
    ok = itin_repository.delete_itinerario(db, itinerario_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Itinerário não encontrado")
    return None


# Novos endpoints para gerenciamento de passagens
@router.get("/passagens", response_model=List[passagem_schema.PassagemOut])
def listar_todas_passagens(
    db: Session = Depends(get_db),
    current_admin: schema.AdminOut = Depends(get_current_admin),
):
    """Lista todas as passagens para administradores"""
    return passagem_repository.list_passagens(db)


@router.get("/passagens/{passagem_id}", response_model=passagem_schema.PassagemOut)
def obter_passagem_admin(
    passagem_id: int,
    db: Session = Depends(get_db),
    current_admin: schema.AdminOut = Depends(get_current_admin),
):
    """Obtém uma passagem específica por ID"""
    passagem = passagem_repository.get_passagem_by_id(db, passagem_id)
    if not passagem:
        raise HTTPException(status_code=404, detail="Passagem não encontrada")
    return passagem


@router.put("/passagens/{passagem_id}", response_model=passagem_schema.PassagemOut)
def editar_passagem_admin(
    passagem_id: int,
    passagem: passagem_schema.PassagemUpdate,
    db: Session = Depends(get_db),
    current_admin: schema.AdminOut = Depends(get_current_admin),
):
    db_passagem = passagem_repository.update_passagem(db, passagem_id, passagem)
    if not db_passagem:
        raise HTTPException(status_code=404, detail="Passagem não encontrada")
    return db_passagem

@router.delete("/passagens/{passagem_id}", status_code=204)
def deletar_passagem_admin(
    passagem_id: int,
    db: Session = Depends(get_db),
    current_admin: schema.AdminOut = Depends(get_current_admin),
):
    db_passagem = passagem_repository.get_passagem_by_id(db, passagem_id)
    if not db_passagem:
        raise HTTPException(status_code=404, detail="Passagem não encontrada")
    db.delete(db_passagem)
    db.commit()
    return None

@router.put("/itinerarios/{itinerario_id}", response_model=itin_schema.ItinerarioOut)
def editar_itinerario_admin(
    itinerario_id: int,
    itin: itin_schema.ItinerarioUpdate,
    db: Session = Depends(get_db),
    current_admin: schema.AdminOut = Depends(get_current_admin),
):
    db_itin = itin_repository.update_itinerario(db, itinerario_id, itin)
    if not db_itin:
        raise HTTPException(status_code=404, detail="Itinerário não encontrado")
    return db_itin

@router.put("/passageiros/{user_id}", response_model=usuario_schema.UserOut)
def editar_passageiro_admin(
    user_id: int,
    user: usuario_schema.UserUpdate,
    db: Session = Depends(get_db),
    current_admin: schema.AdminOut = Depends(get_current_admin),
):
    db_user = usuario_repository.update_user(db, user_id, user)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return db_user

@router.get("/passageiros", response_model=List[usuario_schema.UserOut])
def listar_passageiros_admin(
    db: Session = Depends(get_db),
    current_admin: schema.AdminOut = Depends(get_current_admin),
):
    return db.query(usuario_repository.User).all()

@router.get("/itinerarios/{itinerario_id}/passageiros", response_model=List[passagem_schema.PassagemOut])
def listar_passageiros_itinerario_admin(
    itinerario_id: int,
    db: Session = Depends(get_db),
    current_admin: schema.AdminOut = Depends(get_current_admin),
):
    return passagem_repository.get_passagens_by_filter(db, itinerario_id=itinerario_id)


@router.get("/me", response_model=schema.AdminOut)
def get_me(current_admin: schema.AdminOut = Depends(get_current_admin)):
    return current_admin
