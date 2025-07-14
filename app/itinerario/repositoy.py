from typing import List, Optional

from model.model import Itinerario
from sqlalchemy.orm import Session

from .schema import ItinerarioCreate, ItinerarioUpdate


def create_itinerario(db: Session, itin: ItinerarioCreate) -> Itinerario:
    db_itin = Itinerario(**itin.dict())
    db.add(db_itin)
    db.commit()
    db.refresh(db_itin)
    return db_itin


def list_itinerarios(db: Session) -> List[Itinerario]:
    return db.query(Itinerario).all()


def get_itinerario_by_id(db: Session, itinerario_id: int) -> Optional[Itinerario]:
    """Obtém um itinerário específico por ID"""
    return db.query(Itinerario).filter(Itinerario.id == itinerario_id).first()


def get_itinerarios_by_filter(
    db: Session,
    origem: Optional[str] = None,
    destino: Optional[str] = None,
    data: Optional[object] = None,  # pode ser date ou None
    admin_id: Optional[int] = None,
) -> List[Itinerario]:
    query = db.query(Itinerario)
    if origem:
        query = query.filter(Itinerario.origem == origem)
    if destino:
        query = query.filter(Itinerario.destino == destino)
    if data:
        query = query.filter(Itinerario.data == data)
    if admin_id:
        query = query.filter(Itinerario.admin_id == admin_id)
    return query.all()


def update_itinerario(
    db: Session, itin_id: int, itin: ItinerarioUpdate
) -> Optional[Itinerario]:
    db_itin = db.query(Itinerario).filter(Itinerario.id == itin_id).first()
    if not db_itin:
        return None
    for field, value in itin.dict(exclude_unset=True).items():
        setattr(db_itin, field, value)
    db.commit()
    db.refresh(db_itin)
    return db_itin


def delete_itinerario(db: Session, itin_id: int) -> bool:
    db_itin = db.query(Itinerario).filter(Itinerario.id == itin_id).first()
    if not db_itin:
        return False
    db.delete(db_itin)
    db.commit()
    return True
