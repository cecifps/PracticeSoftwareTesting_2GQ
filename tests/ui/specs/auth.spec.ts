import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('Cenário 1: Autenticação de Usuário - Regressão (CT-001, CT-002 e CT-003)', () => {
  test('CT-UI-01: Deve cadastrar e realizar login com sucesso utilizando credenciais válidas', async ({ page, request }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    // Mitigação R02 (Plano de Testes): cria usuário próprio da execução para não depender de conta pública bloqueada
    const usuario = await registerPage.criarUsuarioNovo(request);

    await loginPage.goto();
    await loginPage.login(usuario.email, usuario.password);
    await loginPage.assertLoginSuccess();
  });

  test('CT-UI-02: Deve exibir mensagem de erro na interface ao tentar logar com senha incorreta', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(`aluno.invalido.${Date.now()}@unicap.br`, 'SenhaErrada123!');
    await loginPage.assertLoginError('Invalid email or password');
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });
});
