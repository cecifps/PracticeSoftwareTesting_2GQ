/**
 * Testes Automatizados de API REST — Catálogo, Busca, Filtros e Ordenação (F03)
 * SUT: Practice Software Testing API (https://api.practicesoftwaretesting.com)
 * Rastreabilidade: CT-004 e Sessão Exploratória 01
 * Responsável: Daniel Barros (856198) — Membro 4
 */

const { PstApiClient } = require('../../src/api/pstApiClient');

describe('API REST (Swagger): F03 — Catálogo, Busca, Filtros e Ordenação', () => {
  const api = new PstApiClient();
  let sampleProductId = null;

  test('GET /products — deve retornar lista paginada de produtos respeitando o contrato Swagger', async () => {
    const res = await api.listProducts({ page: 1 });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('data');
    expect(Array.isArray(res.data.data)).toBe(true);
    expect(res.data.data.length).toBeGreaterThan(0);
    expect(res.data).toHaveProperty('current_page', 1);
    expect(res.data).toHaveProperty('total');

    const firstProduct = res.data.data[0];
    sampleProductId = firstProduct.id;

    expect(firstProduct).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        price: expect.any(Number)
      })
    );
    expect(firstProduct.price).toBeGreaterThan(0);
  });

  test('GET /products/{id} — deve retornar detalhes do produto existente (200) e 404 para ID inexistente', async () => {
    expect(sampleProductId).toBeTruthy();

    const okRes = await api.getProductById(sampleProductId);
    expect(okRes.status).toBe(200);
    expect(okRes.data.id).toBe(sampleProductId);
    expect(okRes.data).toHaveProperty('name');
    expect(okRes.data).toHaveProperty('description');

    const notFoundRes = await api.getProductById('00000000000000000000000000');
    expect(notFoundRes.status).toBe(404);
  });

  test('GET /products/search?q=Pliers — deve retornar produtos correspondentes ao termo buscado (CT-004)', async () => {
    const res = await api.searchProducts('Pliers');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
    expect(res.data.data.length).toBeGreaterThanOrEqual(1);

    for (const product of res.data.data) {
      expect(product.name.toLowerCase()).toContain('pliers');
    }
  });

  test('GET /products/search?q=produto_inexistente_999 — deve retornar lista vazia sem erro 500 (Sessão Exploratória 01)', async () => {
    const res = await api.searchProducts('produto_inexistente_999');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
    expect(res.data.data).toHaveLength(0);
  });

  test('GET /products?sort=price,asc e price,desc — deve ordenar os produtos por preço corretamente', async () => {
    const ascRes = await api.listProducts({ sort: 'price,asc' });
    expect(ascRes.status).toBe(200);
    const ascPrices = ascRes.data.data.map((p) => p.price);
    for (let i = 1; i < ascPrices.length; i += 1) {
      expect(ascPrices[i]).toBeGreaterThanOrEqual(ascPrices[i - 1]);
    }

    const descRes = await api.listProducts({ sort: 'price,desc' });
    expect(descRes.status).toBe(200);
    const descPrices = descRes.data.data.map((p) => p.price);
    for (let i = 1; i < descPrices.length; i += 1) {
      expect(descPrices[i]).toBeLessThanOrEqual(descPrices[i - 1]);
    }
  });

  test('GET /categories e GET /brands — deve listar categorias e marcas disponíveis no catálogo', async () => {
    const [catRes, brandRes] = await Promise.all([
      api.listCategories(),
      api.listBrands()
    ]);

    expect(catRes.status).toBe(200);
    expect(Array.isArray(catRes.data)).toBe(true);
    expect(catRes.data.length).toBeGreaterThan(0);

    expect(brandRes.status).toBe(200);
    expect(Array.isArray(brandRes.data)).toBe(true);
    expect(brandRes.data.length).toBeGreaterThan(0);
  });
});
