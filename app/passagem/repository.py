from typing import List, Optional

from model.model import Itinerario, Passagem, User
from sqlalchemy.orm import Session, joinedload

from .schema import PassagemCreate, PassagemUpdate
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from usuario.repository import get_user_by_email


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
    # Envia e-mail de confirmação
    try:
        send_confirmation_email(user.email, user.name, passagem, itin)
    except Exception as e:
        print(f"Erro ao tentar enviar e-mail de confirmação: {e}")
    return db_passagem


def list_passagens(db: Session) -> List[Passagem]:
    """Lista todas as passagens com informações do itinerário"""
    return db.query(Passagem).options(joinedload(Passagem.itinerario)).all()


def get_passagens_by_filter(
    db: Session,
    itinerario_id: Optional[int] = None,
    tipo: Optional[str] = None,
    nome_passageiro: Optional[str] = None,
    user_id: Optional[int] = None,
) -> List[Passagem]:
    query = db.query(Passagem).options(joinedload(Passagem.itinerario))
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
        itin = p.itinerario
        item = {
            "id": p.id,
            "itinerario_id": p.itinerario_id,
            "nome_passageiro": p.nome_passageiro,
            "telefone": p.telefone,
            "tipo": p.tipo,
            "classe_aviao": p.classe_aviao,
            "tipo_poltrona_onibus": p.tipo_poltrona_onibus,
            "user_id": p.user_id,
            "origem": itin.origem if itin else None,
            "destino": itin.destino if itin else None,
            "data": str(itin.data) if itin and itin.data else None,
            "empresa": itin.empresa if itin else None,
            "horario": itin.horario if itin else None,
            "duracao_viagem": itin.duracao_viagem if itin else None,
            "preco_viagem": itin.preco_viagem if itin else None,
            "tipo_transporte": itin.tipo_transporte if itin else None,
            "tipo_assento": itin.tipo_assento if itin else None,
            "numero_assento": p.numero_assento,  # Adicionado para frontend
            "status": "CONFIRMADA"
        }
        result.append(item)
    return result


def get_passagem_by_id(db: Session, passagem_id: int) -> Optional[Passagem]:
    return db.query(Passagem).options(joinedload(Passagem.itinerario)).filter(Passagem.id == passagem_id).first()


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


def reservar_assento(db: Session, itinerario_id: int, numero_assento: str, user_id: int):
    from model.model import Passagem
    # Verifica se o assento já está ocupado
    ocupado = db.query(Passagem).filter(Passagem.itinerario_id == itinerario_id, Passagem.numero_assento == numero_assento).first()
    if ocupado:
        return {"success": False, "message": "Assento já ocupado"}
    # Reserva temporária: cria uma passagem com status 'RESERVADO' (ou similar)
    # Aqui, apenas retorna sucesso, pois a reserva real ocorre na compra
    return {"success": True, "message": "Assento reservado com sucesso"}


def send_confirmation_email(user_email, user_name, passagem, itinerario):
    smtp_host = os.getenv('SMTP_HOST', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', 587))
    smtp_user = os.getenv('SMTP_USER')
    smtp_pass = os.getenv('SMTP_PASS')
    if not smtp_user or not smtp_pass:
        print('SMTP_USER or SMTP_PASS not set. Email not sent.')
        return

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = user_email
    msg['Subject'] = 'Confirmação de Compra de Passagem'

    body = f"""
Olá, {user_name}!

Sua compra de passagem foi confirmada com sucesso.

Detalhes da passagem:
- Nome do passageiro: {passagem.nome_passageiro}
- Origem: {itinerario.origem}
- Destino: {itinerario.destino}
- Data: {itinerario.data}
- Horário: {itinerario.horario}
- Empresa: {itinerario.empresa}
- Tipo de transporte: {itinerario.tipo_transporte}
- Preço: R$ {itinerario.preco_viagem}

Obrigado por comprar conosco!
"""
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, user_email, msg.as_string())
        server.quit()
        print(f'Confirmação enviada para {user_email}')
    except Exception as e:
        print(f'Erro ao enviar e-mail: {e}')
