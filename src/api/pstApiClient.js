/**
 * Cliente HTTP para a API REST do Practice Software Testing (Swagger)
 * Responsável: Daniel Barros (856198) — Membro 4 (Automação Backend/API)
 */

const DEFAULT_BASE_URL = process.env.PST_API_URL || 'https://api.practicesoftwaretesting.com';

class PstApiClient {
  /**
   * @param {Object} options
   * @param {string} [options.baseUrl] - URL base da API REST
   * @param {Function} [options.httpClient] - Função fetch injetável (permite Stub/Mock em testes unitários)
   */
  constructor({ baseUrl = DEFAULT_BASE_URL, httpClient = global.fetch } = {}) {
    if (!httpClient) {
      throw new Error('Um cliente HTTP (fetch) é obrigatório.');
    }
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.httpClient = httpClient;
    this.token = null;
  }

  setToken(token) {
    this.token = token || null;
  }

  getHeaders(extraHeaders = {}) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...extraHeaders
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(method, path, { body, query, headers } = {}) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${normalizedPath}`);

    if (query && typeof query === 'object') {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const fetchOptions = {
      method: method.toUpperCase(),
      headers: this.getHeaders(headers)
    };

    if (body !== undefined && body !== null) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await this.httpClient(url.toString(), fetchOptions);
    const rawText = await response.text();

    let data = null;
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { raw: rawText };
      }
    }

    return {
      status: response.status,
      ok: response.ok,
      headers: response.headers,
      data
    };
  }

  // Endpoints de Usuários e Autenticação (F01 / F02)
  registerUser(userData) {
    return this.request('POST', '/users/register', { body: userData });
  }

  async login(email, password) {
    const res = await this.request('POST', '/users/login', {
      body: { email, password }
    });
    if (res.ok && res.data && res.data.access_token) {
      this.setToken(res.data.access_token);
    }
    return res;
  }

  getCurrentUser() {
    return this.request('GET', '/users/me');
  }

  // Endpoints de Catálogo, Busca e Filtros (F03)
  listProducts(query = {}) {
    return this.request('GET', '/products', { query });
  }

  getProductById(productId) {
    return this.request('GET', `/products/${productId}`);
  }

  searchProducts(q) {
    return this.request('GET', '/products/search', { query: { q } });
  }

  listCategories() {
    return this.request('GET', '/categories');
  }

  listBrands() {
    return this.request('GET', '/brands');
  }

  // Endpoints de Carrinho e Checkout (F04 / F05)
  createCart() {
    return this.request('POST', '/carts');
  }

  getCart(cartId) {
    return this.request('GET', `/carts/${cartId}`);
  }

  addItemToCart(cartId, productId, quantity = 1) {
    return this.request('POST', `/carts/${cartId}`, {
      body: { product_id: productId, quantity }
    });
  }

  updateCartItemQuantity(cartId, productId, quantity) {
    return this.request('PUT', `/carts/${cartId}/product/quantity`, {
      body: { product_id: productId, quantity }
    });
  }

  removeCartItem(cartId, productId) {
    return this.request('DELETE', `/carts/${cartId}/product/${productId}`);
  }

  checkPayment(paymentPayload) {
    return this.request('POST', '/payment/check', { body: paymentPayload });
  }

  // Endpoints de Favoritos (F06)
  listFavorites() {
    return this.request('GET', '/favorites');
  }

  addFavorite(productId) {
    return this.request('POST', '/favorites', {
      body: { product_id: productId }
    });
  }

  removeFavorite(favoriteId) {
    return this.request('DELETE', `/favorites/${favoriteId}`);
  }

  // Endpoints de Contato / Mensagens (F07)
  sendContactMessage(messagePayload) {
    return this.request('POST', '/messages', { body: messagePayload });
  }
}

module.exports = { PstApiClient, DEFAULT_BASE_URL };
