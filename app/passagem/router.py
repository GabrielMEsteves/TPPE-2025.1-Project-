from typing import List, Optional

from database import get_db
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from . import repository, schema
from usuario.router import get_current_user

router = APIRouter(prefix="/passagens", tags=["passagens"])


@router.post("/", response_model=schema.PassagemOut, status_code=201)
def create_passagem(
    passagem: schema.PassagemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    passagem_data = passagem.dict()
    passagem_data["user_id"] = current_user.id
    passagem_criada = repository.create_passagem(db, schema.PassagemCreate(**passagem_data))
    return passagem_criada


@router.get("/", response_model=List[schema.PassagemOut])
def list_passagens(db: Session = Depends(get_db)):
    return repository.list_passagens(db)


@router.get("/buscar", response_model=List[schema.PassagemOut])
def buscar_passagens(
    itinerario_id: Optional[int] = Query(None),
    tipo: Optional[str] = Query(None),
    nome_passageiro: Optional[str] = Query(None),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    return repository.get_passagens_by_filter(db, itinerario_id, tipo, nome_passageiro, user_id)


@router.get("/minhas", response_model=List[schema.PassagemOut])
def consultar_minhas_passagens(
    nome_passageiro: Optional[str] = Query(None),
    telefone: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return repository.get_passagens_by_user(db, current_user.id, nome_passageiro, telefone)


@router.post("/reservar-assento")
def reservar_assento(
    itinerario_id: int,
    numero_assento: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Reserva temporariamente um assento para o usuário, se disponível.
    """
    from .repository import reservar_assento
    return reservar_assento(db, itinerario_id, numero_assento, current_user.id)


@router.get("/{passagem_id}", response_model=schema.PassagemOut)
def get_passagem(passagem_id: int, db: Session = Depends(get_db)):
    passagem = repository.get_passagem_by_id(db, passagem_id)
    if not passagem:
        raise HTTPException(status_code=404, detail="Passagem não encontrada")
    return passagem


@router.put("/{passagem_id}", response_model=schema.PassagemOut)
def update_passagem(
    passagem_id: int, passagem: schema.PassagemUpdate, db: Session = Depends(get_db)
):
    db_passagem = repository.update_passagem(db, passagem_id, passagem)
    if not db_passagem:
        raise HTTPException(status_code=404, detail="Passagem não encontrada")
    return db_passagem


@router.delete("/{passagem_id}", status_code=204)
def delete_passagem(passagem_id: int, db: Session = Depends(get_db)):
    ok = repository.delete_passagem(db, passagem_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Passagem não encontrada")
    return None
