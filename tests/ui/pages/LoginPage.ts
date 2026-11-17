import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-submit"]');
    this.errorMessage = page.locator('[data-test="login-error"]');
    this.pageTitle = page.locator('[data-test="page-title"]');
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/.*\/account/);
    await expect(this.pageTitle).toHaveText('My account');
  }

  async assertLoginError(expectedText: string = 'Invalid email or password') {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }
}
