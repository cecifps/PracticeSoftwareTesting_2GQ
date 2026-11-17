/**
 * Testes Automatizados de API REST — Carrinho, Checkout/Pagamento, Favoritos e Contato (F04, F05, F06 e F07)
 * SUT: Practice Software Testing API (https://api.practicesoftwaretesting.com)
 * Rastreabilidade: CT-005, CT-006, CT-007, CT-008, CT-009 e Sessão Exploratória 01
 * Responsável: Daniel Barros (856198) — Membro 4
 */

const { PstApiClient } = require('../../src/api/pstApiClient');

describe('API REST (Swagger): F04 Carrinho, F05 Checkout, F06 Favoritos e F07 Contato', () => {
  const api = new PstApiClient();
  let testProduct = null;
  let cartId = null;

  beforeAll(async () => {
    const productsRes = await api.listProducts({ page: 1 });
    expect(productsRes.status).toBe(200);
    testProduct = productsRes.data.data.find((p) => p.in_stock !== false) || productsRes.data.data[0];
  });

  describe('F04 — Ciclo de Vida Completo do Carrinho via API (/carts)', () => {
    test('POST /carts — deve criar um novo carrinho e retornar ID válido (201 Created)', async () => {
      const res = await api.createCart();

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      cartId = res.data.id;
    });

    test('POST /carts/{id} e GET /carts/{id} — deve adicionar produto ao carrinho e persistir quantidade (CT-005)', async () => {
      expect(cartId).toBeTruthy();
      expect(testProduct).toBeTruthy();

      const addRes = await api.addItemToCart(cartId, testProduct.id, 2);
      expect([200, 201]).toContain(addRes.status);

      const getRes = await api.getCart(cartId);
      expect(getRes.status).toBe(200);
      expect(Array.isArray(getRes.data.cart_items)).toBe(true);

      const addedItem = getRes.data.cart_items.find(
        (item) => item.product_id === testProduct.id
      );
      expect(addedItem).toBeDefined();
      expect(addedItem.quantity).toBe(2);
    });

    test('PUT /carts/{id}/product/quantity — deve atualizar a quantidade do produto no carrinho', async () => {
      const updateRes = await api.updateCartItemQuantity(cartId, testProduct.id, 3);
      expect([200, 201]).toContain(updateRes.status);

      const getRes = await api.getCart(cartId);
      const updatedItem = getRes.data.cart_items.find(
        (item) => item.product_id === testProduct.id
      );
      expect(updatedItem.quantity).toBe(3);
    });

    test('DELETE /carts/{id}/product/{productId} — deve remover o produto do carrinho (CT-006)', async () => {
      const delRes = await api.removeCartItem(cartId, testProduct.id);
      expect([200, 204]).toContain(delRes.status);

      const getRes = await api.getCart(cartId);
      const remaining = (getRes.data?.cart_items || []).filter(
        (item) => item.product_id === testProduct.id
      );
      expect(remaining).toHaveLength(0);
    });
  });

  describe('F05 — Validação de Pagamento no Checkout (/payment/check — CT-007)', () => {
    test('POST /payment/check — deve confirmar pagamento na modalidade cash-on-delivery', async () => {
      const res = await api.checkPayment({
        payment_method: 'cash-on-delivery',
        payment_details: {}
      });

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('message', 'Payment was successful');
    });
  });

  describe('F06 — Favoritos (/favorites — CT-008 e Sessão Exploratória 01)', () => {
    test('POST /favorites sem token — deve retornar 401 Unauthorized (explica comportamento observado na Sessão Exploratória 01)', async () => {
      api.setToken(null);
      const res = await api.addFavorite(testProduct.id);
      expect(res.status).toBe(401);
    });

    test('POST /favorites e GET /favorites autenticado — deve salvar e listar produto favorito (CT-008)', async () => {
      const suffix = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const email = `fav.daniel.${suffix}@upe-qa.org`;
      const password = `FavPst#${suffix}!8aB`;

      const regRes = await api.registerUser({
        first_name: 'Daniel',
        last_name: 'Barros',
        dob: '1998-07-15',
        phone: '81998765432',
        email,
        password,
        address: {
          street: 'Rua Teste 10',
          city: 'Recife',
          state: 'PE',
          country: 'BR',
          postal_code: '50000000'
        }
      });
      expect(regRes.status).toBe(201);

      const loginRes = await api.login(email, password);
      expect(loginRes.status).toBe(200);

      const favRes = await api.addFavorite(testProduct.id);
      expect([200, 201]).toContain(favRes.status);

      const listRes = await api.listFavorites();
      expect(listRes.status).toBe(200);
      expect(Array.isArray(listRes.data)).toBe(true);
      expect(listRes.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('F07 — Formulário de Contato (/messages — CT-009)', () => {
    test('POST /messages — deve registrar mensagem de contato válida (CT-009)', async () => {
      const res = await api.sendContactMessage({
        first_name: 'Daniel',
        last_name: 'Barros',
        email: 'daniel.barros@upe-qa.org',
        subject: 'warranty',
        message: 'Gostaria de verificar as condicoes de garantia do alicate Combination Pliers adquirido na plataforma.'
      });

      expect([200, 201]).toContain(res.status);
      expect(res.data).toHaveProperty('id');
    });

    test('POST /messages — deve rejeitar mensagem com payload vazio ou incompleto (422/400)', async () => {
      const res = await api.sendContactMessage({
        first_name: 'Daniel',
        message: 'Curta'
      });

      expect([400, 422]).toContain(res.status);
    });
  });
});
