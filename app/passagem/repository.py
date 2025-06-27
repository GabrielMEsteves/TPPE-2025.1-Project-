from typing import List, Optional

from model.model import Itinerario, Passagem
from sqlalchemy.orm import Session

from .schema import PassagemCreate, PassagemUpdate


def create_passagem(db: Session, passagem: PassagemCreate) -> Passagem:
    # Validação: itinerario_id deve existir
    itin = db.query(Itinerario).filter(Itinerario.id == passagem.itinerario_id).first()
    if not itin:
        raise ValueError("Itinerário informado não existe")
    db_passagem = Passagem(**passagem.dict())
    db.add(db_passagem)
    db.commit()
    db.refresh(db_passagem)
    return db_passagem


def list_passagens(db: Session) -> List[Passagem]:
    return db.query(Passagem).all()


def get_passagens_by_filter(
    db: Session,
    itinerario_id: Optional[int] = None,
    tipo: Optional[str] = None,
    nome_passageiro: Optional[str] = None,
) -> List[Passagem]:
    query = db.query(Passagem)
    if itinerario_id:
        query = query.filter(Passagem.itinerario_id == itinerario_id)
    if tipo:
        query = query.filter(Passagem.tipo == tipo)
    if nome_passageiro:
        query = query.filter(Passagem.nome_passageiro.ilike(f"%{nome_passageiro}%"))
    return query.all()


def get_passagens_by_passageiro(
    db: Session, nome_passageiro: Optional[str] = None, telefone: Optional[str] = None
) -> List[Passagem]:
    query = db.query(Passagem)
    if nome_passageiro:
        query = query.filter(Passagem.nome_passageiro.ilike(f"%{nome_passageiro}%"))
    if telefone:
        query = query.filter(Passagem.telefone == telefone)
    return query.all()


def get_passagem_by_id(db: Session, passagem_id: int) -> Optional[Passagem]:
    return db.query(Passagem).filter(Passagem.id == passagem_id).first()


def update_passagem(
    db: Session, passagem_id: int, passagem: PassagemUpdate
) -> Optional[Passagem]:
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
