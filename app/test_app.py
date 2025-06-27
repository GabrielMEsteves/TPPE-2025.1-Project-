import pytest


@pytest.mark.skip(reason="Exemplo de teste ignorado")
def test_exemplo_ignorado():
    assert 1 == 2


@pytest.mark.skip(reason="Teste ainda não implementado")
def test_funcionalidade_x():
    assert False


@pytest.mark.skip(reason="Depende de recurso externo")
def test_api_externa():
    assert False


@pytest.mark.skip(reason="Teste não é relevante no momento")
def test_calculo_inutil():
    assert 42 == 0


@pytest.mark.skip(reason="Demora muito para rodar")
def test_processo_lento():
    assert True


@pytest.mark.skip(reason="Cobertura de código futura")
def test_caminho_de_codigo_obsoleto():
    assert "abc" == "xyz"


@pytest.mark.skip(reason="Exemplo de teste de login ainda não implementado")
def test_login_com_usuario_invalido():
    assert False


def test_hello():
    assert True
