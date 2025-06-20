from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Itinerario(Base):
    __tablename__ = "itinerarios"
    id = Column(Integer, primary_key=True, index=True)
    origem = Column(String, nullable=False)
    destino = Column(String, nullable=False)
    data = Column(Date, nullable=False)
    passagens = relationship("Passagem", back_populates="itinerario")

class TipoPassagemEnum(str, enum.Enum):
    aviao = "aviao"
    onibus = "onibus"

class ClassePassagemAviaoEnum(str, enum.Enum):
    economica = "ECONOMICA"
    executiva = "EXECUTIVA"
    primeira_classe = "PRIMEIRA_CLASSE"

class TipoPoltronaOnibusEnum(str, enum.Enum):
    cama_leito = "CAMA_LEITO"
    semi_leito = "SEMI_LEITO"
    executiva = "EXECUTIVA"
    convencional = "CONVENCIONAL"

class Passagem(Base):
    __tablename__ = "passagens"
    id = Column(Integer, primary_key=True, index=True)
    nome_passageiro = Column(String, nullable=False)
    telefone = Column(String, nullable=False)
    tipo = Column(Enum(TipoPassagemEnum), nullable=False)
    classe_aviao = Column(Enum(ClassePassagemAviaoEnum), nullable=True)
    tipo_poltrona_onibus = Column(Enum(TipoPoltronaOnibusEnum), nullable=True)
    itinerario_id = Column(Integer, ForeignKey("itinerarios.id"), nullable=False)
    itinerario = relationship("Itinerario", back_populates="passagens")