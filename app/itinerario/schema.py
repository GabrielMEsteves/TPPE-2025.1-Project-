from pydantic import BaseModel
from datetime import date
from typing import Optional

class ItinerarioBase(BaseModel):
    origem: Optional[str] = None
    destino: Optional[str] = None
    data: Optional[date] = None

class ItinerarioCreate(ItinerarioBase):
    origem: str
    destino: str
    data: date

class ItinerarioUpdate(ItinerarioBase):
    pass

class ItinerarioOut(ItinerarioBase):
    id: int
    class Config:
        from_attributes = True
