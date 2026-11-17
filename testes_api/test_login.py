import requests

BASE_URL = "https://api.practicesoftwaretesting.com"

def test_login_credenciais_invalidas_retorna_401():
    """Valida se a API de login bloqueia acessos com credenciais incorretas"""
    
    payload = {
        "email": "aluno@unicap.br",
        "password": "senhaerradissima123"
    }
    
    resposta = requests.post(f"{BASE_URL}/users/login", json=payload)
    
    assert resposta.status_code == 401
    

    dados = resposta.json()
    assert 'Unauthorized' in dados.get('error', '')