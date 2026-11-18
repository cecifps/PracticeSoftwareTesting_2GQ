import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Cenário 4: Testes de Integração de UI com Mock/Stub de Rede', () => {
  test('CT-UI-07: Deve tratar lista vazia (Stub 200 OK com data: []) exibindo mensagem amigável na UI', async ({ page }) => {
    const homePage = new HomePage(page);

    // Intercepta a chamada GET /products da API REST e devolve um Stub com lista vazia
    await page.route('**/products*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          current_page: 1,
          data: [],
          from: null,
          last_page: 1,
          per_page: 9,
          to: null,
          total: 0,
        }),
      });
    });

    await homePage.goto();

    // Valida que o frontend renderiza o estado vazio controlado sem quebrar a página
    await expect(homePage.noResultsMessage).toBeVisible();
    await expect(homePage.noResultsMessage).toContainText('There are no products found.');
    await expect(homePage.productNames).toHaveCount(0);
  });

  test('CT-UI-08: Deve manter a interface estável quando a API de produtos retorna Erro 500 (Internal Server Error)', async ({ page }) => {
    const homePage = new HomePage(page);

    // Intercepta a chamada GET /products e força falha controlada HTTP 500
    await page.route('**/products*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Internal Server Error - Simulado via Mock no Playwright',
        }),
      });
    });

    await homePage.goto();

    // Valida que a barra de busca e o cabeçalho permanecem funcionais mesmo com queda na API de catálogo
    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.productNames).toHaveCount(0);
  });

  test('CT-UI-09: Deve exibir feedback de erro na UI quando a API de login retorna Erro 500', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Intercepta o POST /users/login simulando indisponibilidade no serviço de autenticação
    await page.route('**/users/login', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
        }),
      });
    });

    await loginPage.goto();
    await loginPage.login('aluno@unicap.br', 'welcome01');

    // Garante que o usuário não é redirecionado indevidamente e permanece na tela de login com alerta visível
    await expect(page).toHaveURL(/.*\/auth\/login/);
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
