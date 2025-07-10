from typing import List, Optional

from database import get_db
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

from . import repositoy, schema

router = APIRouter(prefix="/itinerarios", tags=["itinerarios"])


@router.post("/", response_model=schema.ItinerarioOut, status_code=201)
def create_itinerario(itin: schema.ItinerarioCreate, db: Session = Depends(get_db)):
    return repositoy.create_itinerario(db, itin)


@router.get("/", response_model=List[schema.ItinerarioOut])
def list_itinerarios(db: Session = Depends(get_db)):
    return repositoy.list_itinerarios(db)


@router.get(
    "/buscar",
    response_model=List[schema.ItinerarioOut],
)
def buscar_itinerarios(
    origem: Optional[str] = Query(None),
    destino: Optional[str] = Query(None),
    data: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    data_date = None
    if data:
        try:
            data_date = datetime.strptime(data, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Data inválida")
    return repositoy.get_itinerarios_by_filter(
        db, origem, destino, data_date
    )


@router.put("/{itin_id}", response_model=schema.ItinerarioOut)
def update_itinerario(
    itin_id: int, itin: schema.ItinerarioUpdate, db: Session = Depends(get_db)
):
    db_itin = repositoy.update_itinerario(db, itin_id, itin)
    if not db_itin:
        raise HTTPException(status_code=404, detail="Itinerário não encontrado")
    return db_itin


@router.delete("/{itin_id}", status_code=204)
def delete_itinerario(itin_id: int, db: Session = Depends(get_db)):
    ok = repositoy.delete_itinerario(db, itin_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Itinerário não encontrado")
    return None
