import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_admin_endpoints():
    print("Testando endpoints de administração...")
    
    # 1. Login do admin
    print("\n1. Fazendo login do admin...")
    login_data = {
        "username": "admin@example.com",
        "password": "admin123"
    }
    
    try:
        login_response = requests.post(f"{BASE_URL}/admin/login", data=login_data)
        print(f"Status do login: {login_response.status_code}")
        if login_response.status_code == 200:
            token = login_response.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            print("✓ Login realizado com sucesso")
            print(f"Token: {token[:50]}...")
        else:
            print(f"✗ Erro no login: {login_response.status_code}")
            print(f"Resposta: {login_response.text}")
            return
    except Exception as e:
        print(f"✗ Erro de conexão: {e}")
        return
    
    # 2. Listar itinerários
    print("\n2. Listando itinerários...")
    try:
        response = requests.get(f"{BASE_URL}/admin/itinerarios", headers=headers)
        print(f"Status da listagem: {response.status_code}")
        if response.status_code == 200:
            itinerarios = response.json()
            print(f"✓ Encontrados {len(itinerarios)} itinerários")
            if itinerarios:
                primeiro_id = itinerarios[0]['id']
                print(f"Primeiro itinerário ID: {primeiro_id}")
                
                # 3. Testar edição
                print(f"\n3. Testando edição do itinerário {primeiro_id}...")
                update_data = {
                    "origem": "São Paulo Teste",
                    "destino": "Rio de Janeiro Teste",
                    "empresa": "Empresa Teste",
                    "horario": "15:30",
                    "duracao_viagem": "1h 30min",
                    "preco_viagem": 299.99,
                    "tipo_transporte": "aviao",
                    "tipo_assento": "executiva"
                }
                
                edit_response = requests.put(f"{BASE_URL}/admin/itinerarios/{primeiro_id}", 
                                          json=update_data, headers=headers)
                print(f"Status da edição: {edit_response.status_code}")
                if edit_response.status_code == 200:
                    print("✓ Edição realizada com sucesso")
                else:
                    print(f"✗ Erro na edição: {edit_response.status_code}")
                    print(f"Resposta: {edit_response.text}")
                
                # 4. Testar exclusão
                print(f"\n4. Testando exclusão do itinerário {primeiro_id}...")
                delete_response = requests.delete(f"{BASE_URL}/admin/itinerarios/{primeiro_id}", 
                                               headers=headers)
                print(f"Status da exclusão: {delete_response.status_code}")
                if delete_response.status_code == 204:
                    print("✓ Exclusão realizada com sucesso")
                else:
                    print(f"✗ Erro na exclusão: {delete_response.status_code}")
                    print(f"Resposta: {delete_response.text}")
        else:
            print(f"✗ Erro ao listar itinerários: {response.status_code}")
            print(f"Resposta: {response.text}")
    except Exception as e:
        print(f"✗ Erro: {e}")
    
    print("\nTeste concluído!")

if __name__ == "__main__":
    test_admin_endpoints() 