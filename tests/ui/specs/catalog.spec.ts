import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Cenário 2: Busca e Filtros no Catálogo (UI E2E)', () => {
  test('CT-UI-03: Deve pesquisar por um produto na barra de busca e atualizar a listagem', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.searchProduct('Pliers');

    await expect(homePage.searchCaption).toContainText('Pliers');
    await homePage.assertProductsMatchTerm('Pliers');
  });

  test('CT-UI-04: Deve aplicar filtro de categoria e validar atualização dos produtos exibidos', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.filterByCategory('Hammer');

    await homePage.assertProductsMatchTerm('Hammer');
  });
});
