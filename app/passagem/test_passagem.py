from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient
from main import app
from model.model import Passagem
from passagem.repository import (
    create_passagem,
    delete_passagem,
    get_passagens_by_filter,
    list_passagens,
    update_passagem,
)
from passagem.schema import PassagemCreate, PassagemUpdate, TipoPassagemEnum
import uuid

client = TestClient(app)


def fake_passagem_data():
    return PassagemCreate(
        nome_passageiro="João",
        telefone="81999999999",
        tipo=TipoPassagemEnum.aviao,
        classe_aviao="ECONOMICA",
        itinerario_id=1,
    )


@pytest.fixture
def fake_db():
    class FakeDB:
        def __init__(self):
            self.passagens = []
            self._id = 1

        def query(self, model):
            class Query:
                def __init__(self, passagens):
                    self._passagens = passagens

                def all(self):
                    return self._passagens

                def filter(self, cond):
                    key = cond.left.name
                    value = cond.right.value
                    filtered = [p for p in self._passagens if getattr(p, key) == value]

                    class F:
                        def all(_):
                            return filtered

                        def first(_):
                            return filtered[0] if filtered else None

                    return F()

                def first(self):
                    return self._passagens[0] if self._passagens else None

            return Query(self.passagens)

        def add(self, obj):
            obj.id = self._id
            self._id += 1
            self.passagens.append(obj)

        def commit(self):
            pass

        def refresh(self, obj):
            pass

        def delete(self, obj):
            self.passagens.remove(obj)

    return FakeDB()


@pytest.fixture
def passagem_data():
    return {
        "nome_passageiro": "João",
        "telefone": "81999999999",
        "tipo": "aviao",
        "classe_aviao": "ECONOMICA",
        "itinerario_id": 1,
    }


@pytest.fixture
def itinerario_id():
    # Cria um admin único para cada teste
    unique_email = f"adminteste_{uuid.uuid4()}@email.com"
    admin_data = {"name": "Admin Teste", "email": unique_email, "password": "123456"}
    admin_resp = client.post("/api/v1/admin/signup", json=admin_data)
    if admin_resp.status_code == 201:
        admin_id = admin_resp.json()["id"]
    else:
        # Se já existe, busca o id
        get_resp = client.get(f"/api/v1/admins?email={unique_email}")
        admin_id = get_resp.json()["id"] if get_resp.status_code == 200 else 1
    itin_data = {
        "origem": "Recife",
        "destino": "SP",
        "data": "2024-07-20",
        "empresa": "Empresa Teste",
        "horario": "08:00",
        "duracao_viagem": "3h",
        "preco_viagem": 199.99,
        "tipo_transporte": "aviao",
        "tipo_assento": "economica",
        "admin_id": admin_id
    }
    resp = client.post("/api/v1/itinerarios/", json=itin_data)
    if resp.status_code != 201:
        print("Erro ao criar itinerario:", resp.status_code, resp.text)
        return None
    return resp.json()["id"]


def test_create_passagem(passagem_data, itinerario_id):
    # Cria usuário para associar à passagem
    user_data = {"name": "Teste User", "email": f"testeuser_{uuid.uuid4()}@email.com", "password": "123456"}
    user_resp = client.post("/api/v1/usuarios/", json=user_data)
    user_id = user_resp.json()["id"]
    # Autentica usuário
    login_data = {"username": user_data["email"], "password": user_data["password"]}
    login_resp = client.post("/api/v1/usuarios/login", data=login_data)
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    passagem_data["itinerario_id"] = itinerario_id
    passagem_data["user_id"] = user_id
    resp = client.post("/api/v1/passagens/", json=passagem_data, headers=headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["nome_passageiro"] == "João"
    assert data["itinerario_id"] == itinerario_id
    assert data["user_id"] == user_id


def test_list_passagens():
    resp = client.get("/api/v1/passagens/")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_buscar_passagens(itinerario_id):
    resp = client.get(
        "/api/v1/passagens/buscar", params={"itinerario_id": itinerario_id}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    if data:
        assert data[0]["itinerario_id"] == itinerario_id


def test_update_passagem(passagem_data, itinerario_id):
    # Cria usuário e autentica
    user_data = {"name": "Teste User", "email": f"testeuser_{uuid.uuid4()}@email.com", "password": "123456"}
    user_resp = client.post("/api/v1/usuarios/", json=user_data)
    user_id = user_resp.json()["id"]
    login_data = {"username": user_data["email"], "password": user_data["password"]}
    login_resp = client.post("/api/v1/usuarios/login", data=login_data)
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    passagem_data["itinerario_id"] = itinerario_id
    passagem_data["user_id"] = user_id
    resp = client.post("/api/v1/passagens/", json=passagem_data, headers=headers)
    passagem_id = resp.json()["id"]
    update = {"nome_passageiro": "Maria"}
    resp2 = client.put(f"/api/v1/passagens/{passagem_id}", json=update, headers=headers)
    assert resp2.status_code == 200
    assert resp2.json()["nome_passageiro"] == "Maria"


def test_delete_passagem(passagem_data, itinerario_id):
    # Cria usuário e autentica
    user_data = {"name": "Teste User", "email": f"testeuser_{uuid.uuid4()}@email.com", "password": "123456"}
    user_resp = client.post("/api/v1/usuarios/", json=user_data)
    user_id = user_resp.json()["id"]
    login_data = {"username": user_data["email"], "password": user_data["password"]}
    login_resp = client.post("/api/v1/usuarios/login", data=login_data)
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    passagem_data["itinerario_id"] = itinerario_id
    passagem_data["user_id"] = user_id
    resp = client.post("/api/v1/passagens/", json=passagem_data, headers=headers)
    passagem_id = resp.json()["id"]
    resp2 = client.delete(f"/api/v1/passagens/{passagem_id}", headers=headers)
    assert resp2.status_code == 204
