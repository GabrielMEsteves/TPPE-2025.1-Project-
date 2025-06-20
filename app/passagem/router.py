from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from . import schema, repository
from typing import List, Optional

router = APIRouter(prefix="/passagens", tags=["passagens"])

@router.post("/", response_model=schema.PassagemOut, status_code=201)
def create_passagem(passagem: schema.PassagemCreate, db: Session = Depends(get_db)):
    return repository.create_passagem(db, passagem)

@router.get("/", response_model=List[schema.PassagemOut])
def list_passagens(db: Session = Depends(get_db)):
    return repository.list_passagens(db)

@router.get("/buscar", response_model=List[schema.PassagemOut])
def buscar_passagens(
    itinerario_id: Optional[int] = Query(None),
    tipo: Optional[str] = Query(None),
    nome_passageiro: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return repository.get_passagens_by_filter(db, itinerario_id, tipo, nome_passageiro)

@router.put("/{passagem_id}", response_model=schema.PassagemOut)
def update_passagem(passagem_id: int, passagem: schema.PassagemUpdate, db: Session = Depends(get_db)):
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
