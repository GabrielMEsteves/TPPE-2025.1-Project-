from sqlalchemy.orm import Session
from model.model import Passagem
from .schema import PassagemCreate, PassagemUpdate
from typing import List, Optional

def create_passagem(db: Session, passagem: PassagemCreate) -> Passagem:
    db_passagem = Passagem(**passagem.dict())
    db.add(db_passagem)
    db.commit()
    db.refresh(db_passagem)
    return db_passagem

def list_passagens(db: Session) -> List[Passagem]:
    return db.query(Passagem).all()

def get_passagens_by_filter(db: Session, itinerario_id: Optional[int] = None, tipo: Optional[str] = None, nome_passageiro: Optional[str] = None) -> List[Passagem]:
    query = db.query(Passagem)
    if itinerario_id:
        query = query.filter(Passagem.itinerario_id == itinerario_id)
    if tipo:
        query = query.filter(Passagem.tipo == tipo)
    if nome_passageiro:
        query = query.filter(Passagem.nome_passageiro.ilike(f"%{nome_passageiro}%"))
    return query.all()

def update_passagem(db: Session, passagem_id: int, passagem: PassagemUpdate) -> Optional[Passagem]:
    db_passagem = db.query(Passagem).filter(Passagem.id == passagem_id).first()
    if not db_passagem:
        return None
    for field, value in passagem.dict(exclude_unset=True).items():
        setattr(db_passagem, field, value)
    db.commit()
    db.refresh(db_passagem)
    return db_passagem

def delete_passagem(db: Session, passagem_id: int) -> bool:
    db_passagem = db.query(Passagem).filter(Passagem.id == passagem_id).first()
    if not db_passagem:
        return False
    db.delete(db_passagem)
    db.commit()
    return True
