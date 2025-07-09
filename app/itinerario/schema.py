from datetime import date
from typing import Optional

from pydantic import BaseModel


class ItinerarioBase(BaseModel):
    origem: Optional[str] = None
    destino: Optional[str] = None
    data: Optional[date] = None
    admin_id: Optional[int] = None


class ItinerarioCreate(ItinerarioBase):
    origem: str
    destino: str
    data: date
    admin_id: int


class ItinerarioUpdate(ItinerarioBase):
    pass


class ItinerarioOut(ItinerarioBase):
    id: int
    admin_id: int

    class Config:
        from_attributes = True
