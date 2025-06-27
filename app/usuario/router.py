from datetime import datetime, timedelta
from typing import List

from database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from usuario import repository, schema

SECRET_KEY = "sua_chave_secreta"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/usuarios/login")

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


# Utilitário para criar token JWT
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Dependência para obter usuário atual
async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = repository.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user


@router.post("/", response_model=schema.UserOut, status_code=201)
def create_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    db_user = repository.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    return repository.create_user(db, user)


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = repository.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Email ou senha incorretos")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=schema.UserOut)
def read_users_me(current_user: schema.UserOut = Depends(get_current_user)):
    return current_user


@router.get("/", response_model=List[schema.UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(repository.User).all()


@router.put("/{user_id}", response_model=schema.UserOut)
def update_user(
    user_id: int,
    user: schema.UserUpdate,
    db: Session = Depends(get_db),
    current_user: schema.UserOut = Depends(get_current_user),
):
    db_user = repository.update_user(db, user_id, user)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return db_user


@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schema.UserOut = Depends(get_current_user),
):
    db_user = repository.delete_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return None
