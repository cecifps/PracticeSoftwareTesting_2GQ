import requests

BASE_URL = "https://api.practicesoftwaretesting.com"

def test_listar_produtos_status_200():
    resposta = requests.get(f"{BASE_URL}/products")
    assert resposta.status_code == 200

def test_listar_produtos_retorna_dados():
    resposta = requests.get(f"{BASE_URL}/products")
    dados = resposta.json()
    assert 'data' in dados
    assert len(dados['data']) > 0