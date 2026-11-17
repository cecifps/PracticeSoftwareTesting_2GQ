import requests

BASE_URL = "https://api.practicesoftwaretesting.com"

def test_criar_carrinho_novo_retorna_201():
    """Valida se a API permite inicializar um carrinho de compras novo"""
    resposta = requests.post(f"{BASE_URL}/carts")
    
    assert resposta.status_code == 201
    
    dados = resposta.json()
    assert 'id' in dados