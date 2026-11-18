import { Page, APIRequestContext, expect } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
}

export class RegisterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Cria um usuário próprio a cada execução conforme a mitigação do Risco R02
   * definida no Plano de Testes (docs/plano-de-testes.md) e o caso CT-001 (docs/casos-manuais.md).
   */
  async criarUsuarioNovo(request?: APIRequestContext): Promise<TestUser> {
    const timestamp = Date.now();
    const sufixo = Math.floor(Math.random() * 10000);
    const email = `aluno.qa.${timestamp}.${sufixo}@unicap.br`;
    const password = `Unicap#${timestamp}Qa!`;

    if (request) {
      const resposta = await request.post('https://api.practicesoftwaretesting.com/users/register', {
        data: {
          first_name: 'Carlos',
          last_name: 'Teste',
          address: {
            street: 'Rua do Principe 526',
            city: 'Recife',
            state: 'PE',
            country: 'BR',
            postal_code: '50050900',
          },
          phone: '81999998888',
          dob: '1998-05-15',
          password,
          email,
        },
      });

      if (resposta.status() === 201) {
        return { email, password };
      }
    }

    // Caso a API exija o fluxo via interface (CT-001 - Cadastro de usuário)
    await this.page.goto('/auth/register');
    await this.page.locator('[data-test="first-name"]').fill('Carlos');
    await this.page.locator('[data-test="last-name"]').fill('Teste');
    await this.page.locator('[data-test="dob"]').fill('1998-05-15');
    await this.page.locator('[data-test="street"], [data-test="address"]').first().fill('Rua do Principe 526');
    await this.page.locator('[data-test="postal_code"], [data-test="postcode"]').first().fill('50050900');
    await this.page.locator('[data-test="city"]').fill('Recife');
    await this.page.locator('[data-test="state"]').fill('PE');
    await this.page.locator('[data-test="country"]').selectOption('BR');
    await this.page.locator('[data-test="phone"]').fill('81999998888');
    await this.page.locator('[data-test="email"]').fill(email);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.locator('[data-test="register-submit"]').click();

    await expect(this.page).toHaveURL(/.*\/auth\/login/);
    return { email, password };
  }
}
