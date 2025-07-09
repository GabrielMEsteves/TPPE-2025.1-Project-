from datetime import date
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient
from itinerario.repositoy import (
    create_itinerario,
    delete_itinerario,
    get_itinerarios_by_filter,
    list_itinerarios,
    update_itinerario,
)
from itinerario.schema import ItinerarioCreate, ItinerarioUpdate
from main import app
from model.model import Itinerario

client = TestClient(app)


@pytest.fixture
def fake_db():
    class FakeDB:
        def __init__(self):
            self.itinerarios = []
            self._id = 1

        def query(self, model):
            class Query:
                def __init__(self, itinerarios):
                    self._itinerarios = itinerarios

                def all(self):
                    return self._itinerarios

                def filter(self, cond):
                    # cond: Itinerario.origem == origem, etc
                    key = cond.left.name
                    value = cond.right.value
                    filtered = [
                        i for i in self._itinerarios if getattr(i, key) == value
                    ]

                    class F:
                        def all(_):
                            return filtered

                        def first(_):
                            return filtered[0] if filtered else None

                    return F()

                def first(self):
                    return self._itinerarios[0] if self._itinerarios else None

            return Query(self.itinerarios)

        def add(self, obj):
            obj.id = self._id
            self._id += 1
            self.itinerarios.append(obj)

        def commit(self):
            pass

        def refresh(self, obj):
            pass

        def delete(self, obj):
            self.itinerarios.remove(obj)

    return FakeDB()


@pytest.fixture
def itinerario_data():
    return {
        "origem": "Recife",
        "destino": "SP",
        "data": "2024-07-20"
    }


def test_create_itinerario(itinerario_data):
    # Cria admin para associar ao itinerario
    admin_data = {"name": "Admin Teste", "email": "adminteste@email.com", "password": "123456"}
    admin_resp = client.post("/api/v1/admin/signup", json=admin_data)
    admin_id = admin_resp.json()["id"]
    itinerario_data["admin_id"] = admin_id
    resp = client.post("/api/v1/itinerarios/", json=itinerario_data)
    assert resp.status_code == 201
    data = resp.json()
    assert data["origem"] == "Recife"
    assert data["destino"] == "SP"
    assert data["admin_id"] == admin_id


def test_list_itinerarios():
    resp = client.get("/api/v1/itinerarios/")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_buscar_itinerarios():
    resp = client.get(
        "/api/v1/itinerarios/buscar", params={"origem": "Recife"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    if data:
        assert data[0]["origem"] == "Recife"


def test_update_itinerario(itinerario_data):
    resp = client.post("/api/v1/itinerarios/", json=itinerario_data)
    itin_id = resp.json()["id"]
    update = {"destino": "RJ"}
    resp2 = client.put(f"/api/v1/itinerarios/{itin_id}", json=update)
    assert resp2.status_code == 200
    assert resp2.json()["destino"] == "RJ"


def test_delete_itinerario(itinerario_data):
    resp = client.post("/api/v1/itinerarios/", json=itinerario_data)
    itin_id = resp.json()["id"]
    resp2 = client.delete(f"/api/v1/itinerarios/{itin_id}")
    assert resp2.status_code == 204


def test_create_itinerario(fake_db):
    itin_data = ItinerarioCreate(origem="Recife", destino="SP", data=date(2024, 7, 20))
    itin = create_itinerario(fake_db, itin_data)
    assert itin.id == 1
    assert itin.origem == "Recife"
    assert itin.destino == "SP"
    assert itin.data == date(2024, 7, 20)


def test_list_itinerarios(fake_db):
    itin1 = create_itinerario(
        fake_db, ItinerarioCreate(origem="Recife", destino="SP", data=date(2024, 7, 20))
    )
    itin2 = create_itinerario(
        fake_db, ItinerarioCreate(origem="RJ", destino="BA", data=date(2024, 8, 10))
    )
    lista = list_itinerarios(fake_db)
    assert len(lista) == 2


def test_get_itinerarios_by_filter(fake_db):
    create_itinerario(
        fake_db, ItinerarioCreate(origem="Recife", destino="SP", data=date(2024, 7, 20))
    )
    create_itinerario(
        fake_db, ItinerarioCreate(origem="RJ", destino="BA", data=date(2024, 8, 10))
    )
    filtrado = get_itinerarios_by_filter(fake_db, origem="Recife")
    assert len(filtrado) == 1
    assert filtrado[0].origem == "Recife"


def test_update_itinerario(fake_db):
    itin = create_itinerario(
        fake_db, ItinerarioCreate(origem="Recife", destino="SP", data=date(2024, 7, 20))
    )
    update = ItinerarioUpdate(destino="RJ")
    atualizado = update_itinerario(fake_db, itin.id, update)
    assert atualizado.destino == "RJ"


def test_delete_itinerario(fake_db):
    itin = create_itinerario(
        fake_db, ItinerarioCreate(origem="Recife", destino="SP", data=date(2024, 7, 20))
    )
    ok = delete_itinerario(fake_db, itin.id)
    assert ok is True
    assert len(fake_db.itinerarios) == 0
