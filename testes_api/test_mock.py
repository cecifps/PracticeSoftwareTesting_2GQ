import requests
from unittest.mock import patch

BASE_URL = "https://api.practicesoftwaretesting.com"


@patch('requests.get')
def test_mock_servidor_fora_do_ar_retorna_500(mock_get):
    """Usa um MOCK para simular que a API caiu, sem tentar acessar a internet de verdade"""
    
    mock_get.return_value.status_code = 500
    
    resposta = requests.get(f"{BASE_URL}/products")
    
    assert resposta.status_code == 500