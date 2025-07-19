"""Testes automatizados para endpoints de passagens administradas pelo admin."""

import json
import requests

BASE_URL = "http://localhost:8000/api/v1"

def test_admin_endpoints():
    print("Testando endpoints de administração de passagens...")
    
    # 1. Login do admin
    print("\n1. Fazendo login do admin...")
    login_data = {
        "username": "admin@example.com",
        "password": "admin123"
    }
    try:
        login_response = requests.post(f"{BASE_URL}/admin/login", data=login_data)
        if login_response.status_code == 200:
            token = login_response.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            print("✓ Login realizado com sucesso")
        else:
            print(f"✗ Erro no login: {login_response.status_code}")
            return
    except Exception as e:
        print(f"✗ Erro de conexão: {e}")
        return
    
    # 2. Listar todas as passagens
    print("\n2. Listando todas as passagens...")
    try:
        response = requests.get(f"{BASE_URL}/admin/passagens", headers=headers)
        if response.status_code == 200:
            passagens = response.json()
            print(f"✓ Encontradas {len(passagens)} passagens")
            for p in passagens[:3]:  # Mostra apenas as primeiras 3
                print(f"  - ID: {p.get('id')}, Passageiro: {p.get('nome_passageiro')}")
        else:
            print(f"✗ Erro ao listar passagens: {response.status_code}")
    except Exception as e:
        print(f"✗ Erro: {e}")
    
    # 3. Se houver passagens, testar edição
    if 'passagens' in locals() and passagens:
        primeira_passagem = passagens[0]
        passagem_id = primeira_passagem['id']
        
        print(f"\n3. Testando edição da passagem {passagem_id}...")
        update_data = {
            "nome_passageiro": "João Silva Atualizado",
            "telefone": "11987654321"
        }
        
        try:
            response = requests.put(f"{BASE_URL}/admin/passagens/{passagem_id}", 
                                 json=update_data, headers=headers)
            if response.status_code == 200:
                print("✓ Passagem atualizada com sucesso")
            else:
                print(f"✗ Erro ao atualizar passagem: {response.status_code}")
        except Exception as e:
            print(f"✗ Erro: {e}")
    
    print("\nTeste concluído!")

if __name__ == "__main__":
    test_admin_endpoints() 