import enum

from database import Base
from sqlalchemy import Column, Date, Enum, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    passagens = relationship("Passagem", back_populates="usuario")


class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    itinerarios = relationship("Itinerario", back_populates="admin")


class TipoTransporteEnum(str, enum.Enum):
    aviao = "aviao"
    onibus = "onibus"


class TipoAssentoEnum(str, enum.Enum):
    economica = "economica"
    executiva = "executiva"
    primeira_classe = "primeira_classe"
    cama_leito = "cama_leito"
    semi_leito = "semi_leito"
    convencional = "convencional"


class Itinerario(Base):
    __tablename__ = "itinerarios"
    id = Column(Integer, primary_key=True, index=True)
    origem = Column(String, nullable=False)
    destino = Column(String, nullable=False)
    data = Column(Date, nullable=False)
    empresa = Column(String, nullable=False)
    horario = Column(String, nullable=False)
    duracao_viagem = Column(String, nullable=True)  # Ex: "2h 30min"
    preco_viagem = Column(Float, nullable=True)  # Preço em reais
    tipo_transporte = Column(Enum(TipoTransporteEnum), nullable=True)
    tipo_assento = Column(Enum(TipoAssentoEnum), nullable=True)
    admin_id = Column(Integer, ForeignKey("admins.id"), nullable=False)
    admin = relationship("Admin", back_populates="itinerarios")
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
    numero_assento = Column(String, nullable=True)  # Novo campo
    tipo_assento = Column(String, nullable=True)    # Novo campo
    itinerario_id = Column(Integer, ForeignKey("itinerarios.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    itinerario = relationship("Itinerario", back_populates="passagens")
    usuario = relationship("User", back_populates="passagens")
