import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly searchResetButton: Locator;
  readonly searchCaption: Locator;
  readonly productNames: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchSubmitButton = page.locator('[data-test="search-submit"]');
    this.searchResetButton = page.locator('[data-test="search-reset"]');
    this.searchCaption = page.locator('[data-test="search-caption"]');
    this.productNames = page.locator('[data-test="product-name"]');
    this.noResultsMessage = page.locator('[data-test="no-results"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async searchProduct(term: string) {
    await this.searchInput.fill(term);
    await this.searchSubmitButton.click();
    await expect(this.searchCaption).toContainText(term);
  }

  async filterByCategory(categoryName: string) {
    const categoryCheckbox = this.page.getByLabel(categoryName, { exact: true });
    await expect(categoryCheckbox).toBeVisible();
    await categoryCheckbox.check();
  }

  async selectProductByName(name: string) {
    await this.productNames.filter({ hasText: name }).first().click();
  }

  async assertProductsMatchTerm(term: string) {
    // Aguarda automaticamente o Angular atualizar os cards na tela para o termo filtrado
    await expect(this.productNames.first()).toContainText(term, { ignoreCase: true });
    const count = await this.productNames.count();
    expect(count).toBeGreaterThan(0);

    const titles = await this.productNames.allTextContents();
    for (const title of titles) {
      expect(title.toLowerCase()).toContain(term.toLowerCase());
    }
  }
}
