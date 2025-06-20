from pydantic import BaseModel
from typing import Optional
from enum import Enum

class TipoPassagemEnum(str, Enum):
    aviao = "aviao"
    onibus = "onibus"

class ClassePassagemAviaoEnum(str, Enum):
    economica = "ECONOMICA"
    executiva = "EXECUTIVA"
    primeira_classe = "PRIMEIRA_CLASSE"

class TipoPoltronaOnibusEnum(str, Enum):
    cama_leito = "CAMA_LEITO"
    semi_leito = "SEMI_LEITO"
    executiva = "EXECUTIVA"
    convencional = "CONVENCIONAL"

class PassagemBase(BaseModel):
    nome_passageiro: Optional[str] = None
    telefone: Optional[str] = None
    tipo: Optional[TipoPassagemEnum] = None
    classe_aviao: Optional[ClassePassagemAviaoEnum] = None
    tipo_poltrona_onibus: Optional[TipoPoltronaOnibusEnum] = None
    itinerario_id: Optional[int] = None

class PassagemCreate(PassagemBase):
    nome_passageiro: str
    telefone: str
    tipo: TipoPassagemEnum
    itinerario_id: int
    classe_aviao: Optional[ClassePassagemAviaoEnum] = None
    tipo_poltrona_onibus: Optional[TipoPoltronaOnibusEnum] = None

class PassagemUpdate(PassagemBase):
    pass

class PassagemOut(PassagemBase):
    id: int
    class Config:
        from_attributes = True
