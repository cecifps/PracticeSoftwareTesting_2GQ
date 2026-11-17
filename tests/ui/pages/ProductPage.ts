import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly unitPrice: Locator;
  readonly addToCartButton: Locator;
  readonly cartNavBadge: Locator;
  readonly cartNavLink: Locator;
  readonly toastAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('[data-test="product-name"]');
    this.unitPrice = page.locator('[data-test="unit-price"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.cartNavBadge = page.locator('[data-test="cart-quantity"]');
    this.cartNavLink = page.locator('[data-test="nav-cart"]');
    this.toastAlert = page.locator('#toast-container');
  }

  async addToCart() {
    await this.addToCartButton.click();
    await expect(this.toastAlert).toBeVisible();
    await expect(this.cartNavBadge).not.toHaveText('0');
  }

  async goToCart() {
    await this.cartNavLink.click();
    await expect(this.page).toHaveURL(/.*\/checkout/);
  }
}
