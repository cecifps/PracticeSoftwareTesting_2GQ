import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly cartProductTitle: Locator;
  readonly cartQuantity: Locator;
  readonly removeItemButton: Locator;
  readonly proceedStep1Button: Locator;
  readonly proceedStep2Button: Locator;
  readonly proceedStep3Button: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countrySelect: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly paymentMethodSelect: Locator;
  readonly confirmPaymentButton: Locator;
  readonly paymentSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartProductTitle = page.locator('[data-test="product-title"]');
    this.cartQuantity = page.locator('[data-test="product-quantity"]');
    this.removeItemButton = page.locator('.btn-danger');
    this.proceedStep1Button = page.locator('[data-test="proceed-1"]');
    this.proceedStep2Button = page.locator('[data-test="proceed-2"]');
    this.proceedStep3Button = page.locator('[data-test="proceed-3"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginSubmitButton = page.locator('[data-test="login-submit"]');
    this.streetInput = page.locator('[data-test="street"], [data-test="address"]').first();
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.countrySelect = page.locator('[data-test="country"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"], [data-test="postcode"]').first();
    this.houseNumberInput = page.getByPlaceholder('e.g. 42 *');
    this.paymentMethodSelect = page.locator('[data-test="payment-method"]');
    this.confirmPaymentButton = page.locator('[data-test="finish"]');
    this.paymentSuccessMessage = page.locator('[data-test="payment-success-message"]');
  }

  async verifyCartItem(expectedProductName: string) {
    await expect(this.cartProductTitle).toContainText(expectedProductName);
    await expect(this.cartQuantity).toHaveValue('1');
  }

  async removeItemFromCart() {
    await this.removeItemButton.first().click();
    await expect(this.cartProductTitle).toHaveCount(0);
  }

  async proceedFromCartToSignIn() {
    await expect(this.proceedStep1Button).toBeVisible();
    await this.proceedStep1Button.click();
  }

  async completeSignInStepIfRequired(email: string, password: string) {
    await expect(this.proceedStep2Button.or(this.emailInput)).toBeVisible();

    if (await this.emailInput.isVisible()) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginSubmitButton.click();
    }

    await expect(this.proceedStep2Button).toBeVisible();
    await this.proceedStep2Button.click();
  }

  async fillBillingAddress(address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    houseNumber?: string;
  }) {
    await expect(this.streetInput).toBeVisible();
    await this.countrySelect.selectOption(address.country);
    await this.postalCodeInput.fill(address.postalCode);
    await this.houseNumberInput.fill(address.houseNumber ?? '526');
    await this.streetInput.fill(address.street);
    await this.cityInput.fill(address.city);
    await this.stateInput.fill(address.state);

    await expect(this.proceedStep3Button).toBeEnabled();
    await this.proceedStep3Button.click();
  }

  async selectCashOnDeliveryAndConfirm() {
    await expect(this.paymentMethodSelect).toBeVisible();
    await this.paymentMethodSelect.selectOption('cash-on-delivery');
    await expect(this.confirmPaymentButton).toBeEnabled();
    await this.confirmPaymentButton.click();
    await expect(this.paymentSuccessMessage).toBeVisible();
    await expect(this.paymentSuccessMessage).toContainText('Payment was successful');
  }
}
