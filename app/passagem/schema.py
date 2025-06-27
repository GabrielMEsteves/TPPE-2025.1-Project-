from enum import Enum
from typing import Optional

from pydantic import BaseModel, model_validator


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

    @model_validator(mode="after")
    def check_conditional_fields(cls, values):
        tipo = values.tipo
        classe_aviao = values.classe_aviao
        tipo_poltrona_onibus = values.tipo_poltrona_onibus
        if tipo == TipoPassagemEnum.aviao and tipo_poltrona_onibus is not None:
            raise ValueError(
                "tipo_poltrona_onibus só pode ser preenchido para passagens de ônibus"
            )
        if tipo == TipoPassagemEnum.onibus and classe_aviao is not None:
            raise ValueError(
                "classe_aviao só pode ser preenchido para passagens de avião"
            )
        return values


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
