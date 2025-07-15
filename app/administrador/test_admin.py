import pytest
from administrador.repository import (
    authenticate_admin,
    create_admin,
    get_admin_by_email,
)
from administrador.schema import AdminCreate
from fastapi.testclient import TestClient
import uuid
from main import app

client = TestClient(app)


@pytest.fixture
def fake_db():
    class FakeDB:
        def __init__(self):
            self.admins = []

        def query(self, model):
            class Query:
                def __init__(self, admins):
                    self._admins = admins

                def filter(self, cond):
                    email = cond.right.value
                    filtered = [a for a in self._admins if a.email == email]

                    class F:
                        def first(_):
                            return filtered[0] if filtered else None

                    return F()

            return Query(self.admins)

        def add(self, obj):
            self.admins.append(obj)

        def commit(self):
            pass

        def refresh(self, obj):
            pass

    return FakeDB()


def test_create_admin(fake_db):
    admin_data = AdminCreate(name="Admin", email="admin@email.com", password="123456")
    admin = create_admin(fake_db, admin_data)
    assert admin is not None
    assert getattr(admin, "email", None) == "admin@email.com"
    assert hasattr(admin, "hashed_password")


def test_get_admin_by_email(fake_db):
    admin_data = AdminCreate(name="Admin", email="admin@email.com", password="123456")
    create_admin(fake_db, admin_data)
    found = get_admin_by_email(fake_db, "admin@email.com")
    assert found is not None
    assert getattr(found, "email", None) == "admin@email.com"


def test_authenticate_admin(fake_db):
    admin_data = AdminCreate(name="Admin", email="admin@email.com", password="123456")
    create_admin(fake_db, admin_data)
    auth = authenticate_admin(fake_db, "admin@email.com", "123456")
    assert auth is not None
    assert getattr(auth, "email", None) == "admin@email.com"
    # Testa senha errada
    auth_fail = authenticate_admin(fake_db, "admin@email.com", "wrongpass")
    assert auth_fail is None


@pytest.fixture
def admin_signup_and_login():
    signup_data = {
        "name": "Admin",
        "email": "admin@endpoint.com",
        "password": "admin123"
    }
    client.post("/api/v1/admin/signup", json=signup_data)
    login_data = {
        "username": "admin@endpoint.com",
        "password": "admin123"
    }
    resp = client.post("/api/v1/admin/login", data=login_data)
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    return token


def test_admin_signup():
    unique_email = f"novo_{uuid.uuid4()}@endpoint.com"
    data = {
        "name": "NovoAdmin",
        "email": unique_email,
        "password": "senha123"
    }
    resp = client.post("/api/v1/admin/signup", json=data)
    assert resp.status_code == 201
    assert resp.json()["email"] == unique_email


def test_admin_login():
    # Cadastra o admin antes de logar
    signup_data = {
        "name": "Admin",
        "email": "admin@endpoint.com",
        "password": "admin123"
    }
    client.post("/api/v1/admin/signup", json=signup_data)
    data = {
        "username": "admin@endpoint.com",
        "password": "admin123"
    }
    resp = client.post("/api/v1/admin/login", data=data)
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_admin_create_itinerario(admin_signup_and_login):
    token = admin_signup_and_login
    headers = {"Authorization": f"Bearer {token}"}
    itin_data = {
        "origem": "Recife",
        "destino": "SP",
        "data": "2024-07-20",
        "empresa": "Empresa Teste",
        "horario": "08:00",
        "duracao_viagem": "3h",
        "preco_viagem": 199.99,
        "tipo_transporte": "aviao",
        "tipo_assento": "economica"
    }
    resp = client.post(
        "/api/v1/admin/itinerarios", json=itin_data, headers=headers
    )
    if resp.status_code != 201:
        print("Erro ao criar itinerario:", resp.status_code, resp.text)
    assert resp.status_code == 201
    assert resp.json()["origem"] == "Recife"
    assert resp.json()["destino"] == "SP"
