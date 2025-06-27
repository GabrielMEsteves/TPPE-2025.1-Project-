from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient
from main import app
from model.model import User
from usuario.repository import (
    authenticate_user,
    create_user,
    delete_user,
    get_user_by_email,
    update_user,
)
from usuario.schema import UserCreate, UserUpdate

client = TestClient(app)


@pytest.fixture
def fake_db():
    class FakeDB:
        def __init__(self):
            self.users = []
            self._id = 1

        def query(self, model):
            class Query:
                def __init__(self, users):
                    self._users = users

                def filter(self, cond):
                    email = cond.right.value
                    filtered = [
                        u
                        for u in self._users
                        if u.email == email or u.id == cond.right.value
                    ]

                    class F:
                        def first(_):
                            return filtered[0] if filtered else None

                    return F()

            return Query(self.users)

        def add(self, obj):
            obj.id = self._id
            self._id += 1
            self.users.append(obj)

        def commit(self):
            pass

        def refresh(self, obj):
            pass

        def delete(self, obj):
            self.users.remove(obj)

    return FakeDB()


@pytest.fixture
def user_data():
    return {"name": "Joao", "email": "joao@endpoint.com", "password": "123456"}


def test_create_user(fake_db):
    user_data = UserCreate(name="Joao", email="joao@email.com", password="123456")
    user = create_user(fake_db, user_data)
    assert user.email == "joao@email.com"
    assert hasattr(user, "hashed_password")


def test_get_user_by_email(fake_db):
    user_data = UserCreate(name="Joao", email="joao@email.com", password="123456")
    user = create_user(fake_db, user_data)
    found = get_user_by_email(fake_db, "joao@email.com")
    assert found is not None
    assert found.email == "joao@email.com"


def test_authenticate_user(fake_db):
    user_data = UserCreate(name="Joao", email="joao@email.com", password="123456")
    user = create_user(fake_db, user_data)
    auth = authenticate_user(fake_db, "joao@email.com", "123456")
    assert auth is not None
    assert auth.email == "joao@email.com"
    # Testa senha errada
    auth_fail = authenticate_user(fake_db, "joao@email.com", "wrongpass")
    assert auth_fail is None


def test_update_user(fake_db):
    user_data = UserCreate(name="Joao", email="joao@email.com", password="123456")
    user = create_user(fake_db, user_data)
    update = UserUpdate(name="Maria")
    atualizado = update_user(fake_db, user.id, update)
    assert atualizado.name == "Maria"


def test_delete_user(fake_db):
    user_data = UserCreate(name="Joao", email="joao@email.com", password="123456")
    user = create_user(fake_db, user_data)
    ok = delete_user(fake_db, user.id)
    assert ok is not None
    assert len(fake_db.users) == 0


def test_create_user_endpoint(user_data):
    resp = client.post("/api/v1/usuarios/", json=user_data)
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "joao@endpoint.com"


def test_login_user(user_data):
    # Garante que o usuário existe
    client.post("/api/v1/usuarios/", json=user_data)
    login_data = {"username": user_data["email"], "password": user_data["password"]}
    resp = client.post("/api/v1/usuarios/login", data=login_data)
    assert resp.status_code == 200
    assert "access_token" in resp.json()
    return resp.json()["access_token"]


def test_get_me(user_data):
    client.post("/api/v1/usuarios/", json=user_data)
    login_data = {"username": user_data["email"], "password": user_data["password"]}
    resp = client.post("/api/v1/usuarios/login", data=login_data)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    resp2 = client.get("/api/v1/usuarios/me", headers=headers)
    assert resp2.status_code == 200
    assert resp2.json()["email"] == user_data["email"]


def test_update_user_endpoint(user_data):
    # Cria e loga
    client.post("/api/v1/usuarios/", json=user_data)
    login_data = {"username": user_data["email"], "password": user_data["password"]}
    resp = client.post("/api/v1/usuarios/login", data=login_data)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    # Atualiza
    update = {"name": "Maria"}
    user_id = client.get("/api/v1/usuarios/me", headers=headers).json()["id"]
    resp2 = client.put(f"/api/v1/usuarios/{user_id}", json=update, headers=headers)
    assert resp2.status_code == 200
    assert resp2.json()["name"] == "Maria"


def test_delete_user_endpoint(user_data):
    # Cria e loga
    client.post("/api/v1/usuarios/", json=user_data)
    login_data = {"username": user_data["email"], "password": user_data["password"]}
    resp = client.post("/api/v1/usuarios/login", data=login_data)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    user_id = client.get("/api/v1/usuarios/me", headers=headers).json()["id"]
    resp2 = client.delete(f"/api/v1/usuarios/{user_id}", headers=headers)
    assert resp2.status_code == 204
