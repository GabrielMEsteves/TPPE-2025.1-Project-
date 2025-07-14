from datetime import date
from typing import Optional
from enum import Enum

from pydantic import BaseModel


class TipoTransporteEnum(str, Enum):
    aviao = "aviao"
    onibus = "onibus"


class TipoAssentoEnum(str, Enum):
    economica = "economica"
    executiva = "executiva"
    primeira_classe = "primeira_classe"
    cama_leito = "cama_leito"
    semi_leito = "semi_leito"
    convencional = "convencional"


class ItinerarioBase(BaseModel):
    origem: Optional[str] = None
    destino: Optional[str] = None
    data: Optional[date] = None
    admin_id: Optional[int] = None
    empresa: Optional[str] = None
    horario: Optional[str] = None
    duracao_viagem: Optional[str] = None
    preco_viagem: Optional[float] = None
    tipo_transporte: Optional[TipoTransporteEnum] = None
    tipo_assento: Optional[TipoAssentoEnum] = None


class ItinerarioCreate(ItinerarioBase):
    origem: str
    destino: str
    data: date
    admin_id: int
    empresa: str
    horario: str
    duracao_viagem: str
    preco_viagem: float
    tipo_transporte: TipoTransporteEnum
    tipo_assento: TipoAssentoEnum


class ItinerarioUpdate(ItinerarioBase):
    pass


class ItinerarioOut(ItinerarioBase):
    id: int
    admin_id: int
    empresa: str
    horario: str
    duracao_viagem: Optional[str] = None
    preco_viagem: Optional[float] = None
    tipo_transporte: Optional[TipoTransporteEnum] = None
    tipo_assento: Optional[TipoAssentoEnum] = None

    class Config:
        from_attributes = True
