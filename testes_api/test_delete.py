import requests

BASE_URL = "https://api.practicesoftwaretesting.com"

def test_deletar_item_inexistente_retorna_404():
    """Valida se a API trata a tentativa de apagar um registo que não existe"""

    resposta = requests.delete(f"{BASE_URL}/carts/id-falso-999")

    assert resposta.status_code == 404