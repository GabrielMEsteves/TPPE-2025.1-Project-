from typing import List, Optional

from model.model import Itinerario, Passagem, User
from sqlalchemy.orm import Session, joinedload

from .schema import PassagemCreate, PassagemUpdate


def create_passagem(db: Session, passagem: PassagemCreate) -> Passagem:
    # Validação: itinerario_id deve existir
    itin = db.query(Itinerario).filter(Itinerario.id == passagem.itinerario_id).first()
    if not itin:
        raise ValueError("Itinerário informado não existe")
    # Validação: user_id deve existir
    user = db.query(User).filter(User.id == passagem.user_id).first()
    if not user:
        raise ValueError("Usuário informado não existe")
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
    user_id: Optional[int] = None,
) -> List[Passagem]:
    query = db.query(Passagem)
    if itinerario_id:
        query = query.filter(Passagem.itinerario_id == itinerario_id)
    if tipo:
        query = query.filter(Passagem.tipo == tipo)
    if nome_passageiro:
        query = query.filter(Passagem.nome_passageiro.ilike(f"%{nome_passageiro}%"))
    if user_id:
        query = query.filter(Passagem.user_id == user_id)
    return query.all()


def get_passagens_by_passageiro(
    db: Session, nome_passageiro: Optional[str] = None, telefone: Optional[str] = None
) -> list:
    query = db.query(Passagem).options(joinedload(Passagem.itinerario))
    if nome_passageiro:
        query = query.filter(Passagem.nome_passageiro.ilike(f"%{nome_passageiro}%"))
    if telefone:
        query = query.filter(Passagem.telefone == telefone)
    passagens = query.all()
    # Adiciona destino e data do itinerário relacionado
    result = []
    for p in passagens:
        item = p.__dict__.copy()
        if hasattr(p, 'itinerario') and p.itinerario:
            item['origem'] = p.itinerario.origem
            item['destino'] = p.itinerario.destino
            item['data'] = str(p.itinerario.data)
            item['empresa'] = getattr(p.itinerario, 'empresa', '-')
            item['horario'] = getattr(p.itinerario, 'horario', '-')
        else:
            item['origem'] = None
            item['destino'] = None
            item['data'] = None
            item['empresa'] = None
            item['horario'] = None
        item['status'] = 'CONFIRMADA'
        result.append(item)
    return result


def get_passagens_by_user(
    db: Session, user_id: int, nome_passageiro: Optional[str] = None, telefone: Optional[str] = None
) -> list:
    query = db.query(Passagem).options(joinedload(Passagem.itinerario)).filter(Passagem.user_id == user_id)
    if nome_passageiro:
        query = query.filter(Passagem.nome_passageiro.ilike(f"%{nome_passageiro}%"))
    if telefone:
        query = query.filter(Passagem.telefone == telefone)
    passagens = query.all()
    result = []
    for p in passagens:
        item = p.__dict__.copy()
        if hasattr(p, 'itinerario') and p.itinerario:
            item['origem'] = p.itinerario.origem
            item['destino'] = p.itinerario.destino
            item['data'] = str(p.itinerario.data)
            item['empresa'] = getattr(p.itinerario, 'empresa', '-')
            item['horario'] = getattr(p.itinerario, 'horario', '-')
        else:
            item['origem'] = None
            item['destino'] = None
            item['data'] = None
            item['empresa'] = None
            item['horario'] = None
        item['status'] = 'CONFIRMADA'
        result.append(item)
    return result


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
