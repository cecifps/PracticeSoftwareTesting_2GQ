/**
 * Testes de Unidade com Mocks e Stubs — Cliente HTTP da API (PstApiClient)
 * Simula respostas HTTP, headers de autorização Bearer, falhas 401/404/500 e respostas não-JSON
 * Responsável: Daniel Barros (856198) — Membro 4
 */

const { PstApiClient } = require('../../src/api/pstApiClient');

function createMockFetchResponse(status, bodyData, isRawText = false) {
  const textPayload = isRawText
    ? String(bodyData)
    : bodyData !== null && bodyData !== undefined
      ? JSON.stringify(bodyData)
      : '';
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { 'content-type': isRawText ? 'text/plain' : 'application/json' },
    text: jest.fn().mockResolvedValue(textPayload)
  };
}

describe('Unidade + Mocks/Stubs: PstApiClient (Camada de Integração HTTP)', () => {
  test('deve lançar erro se instanciado sem httpClient válido', () => {
    expect(() => new PstApiClient({ httpClient: null })).toThrow(
      'Um cliente HTTP (fetch) é obrigatório.'
    );
  });

  test('deve montar query params corretamente e ignorar parâmetros vazios/nulos', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(createMockFetchResponse(200, { data: [], total: 0 }));

    const client = new PstApiClient({
      baseUrl: 'https://api.practicesoftwaretesting.com/',
      httpClient: fetchMock
    });

    await client.listProducts({ page: 1, sort: 'price,asc', empty: '', nil: null });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, options] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe(
      'https://api.practicesoftwaretesting.com/products?page=1&sort=price%2Casc'
    );
    expect(options.method).toBe('GET');
  });

  test('deve armazenar automaticamente o token Bearer após login bem-sucedido e enviá-lo em rotas protegidas', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(
        createMockFetchResponse(200, {
          access_token: 'token-secreto-123',
          token_type: 'bearer'
        })
      )
      .mockResolvedValueOnce(
        createMockFetchResponse(200, {
          id: 'u1',
          email: 'daniel@teste.com'
        })
      );

    const client = new PstApiClient({ httpClient: fetchMock });

    const loginRes = await client.login('daniel@teste.com', 'SenhaForte123!');
    expect(loginRes.status).toBe(200);
    expect(client.token).toBe('token-secreto-123');

    const meRes = await client.getCurrentUser();
    expect(meRes.status).toBe(200);

    const [, secondCallOptions] = fetchMock.mock.calls[1];
    expect(secondCallOptions.headers.Authorization).toBe('Bearer token-secreto-123');
  });

  test('deve tratar respostas sem corpo (204) ou texto não-JSON (502 Bad Gateway) de forma resiliente (Risco R01)', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(createMockFetchResponse(204, null))
      .mockResolvedValueOnce(createMockFetchResponse(502, 'Bad Gateway HTML', true));

    const client = new PstApiClient({ httpClient: fetchMock });

    const emptyRes = await client.removeCartItem('cart-1', 'prod-1');
    expect(emptyRes.status).toBe(204);
    expect(emptyRes.data).toBeNull();

    const gatewayRes = await client.listCategories();
    expect(gatewayRes.status).toBe(502);
    expect(gatewayRes.ok).toBe(false);
    expect(gatewayRes.data).toEqual({ raw: 'Bad Gateway HTML' });
  });

  test('deve acionar corretamente todos os métodos auxiliares de domínio (Produtos, Carrinho, Favoritos e Mensagens)', async () => {
    const fetchMock = jest.fn().mockResolvedValue(createMockFetchResponse(200, { ok: true }));
    const client = new PstApiClient({ httpClient: fetchMock });

    await client.registerUser({ email: 'a@b.com' });
    await client.getProductById('p1');
    await client.searchProducts('Pliers');
    await client.listBrands();
    await client.createCart();
    await client.getCart('c1');
    await client.addItemToCart('c1', 'p1', 2);
    await client.updateCartItemQuantity('c1', 'p1', 3);
    await client.checkPayment({ payment_method: 'cash-on-delivery' });
    await client.listFavorites();
    await client.addFavorite('p1');
    await client.removeFavorite('fav1');
    await client.sendContactMessage({ subject: 'Doubt', message: 'Hello' });

    expect(fetchMock).toHaveBeenCalledTimes(13);
  });
});
