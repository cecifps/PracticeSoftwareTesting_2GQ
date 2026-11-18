import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('Cenário 3: Carrinho e Jornada Completa de Compra - Regressão (CT-005, CT-006 e CT-007)', () => {
  test('CT-UI-05: Deve selecionar produto, adicionar ao carrinho, conferir itens e finalizar checkout (Happy Path)', async ({ page, request }) => {
    const registerPage = new RegisterPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Cria usuário próprio para a sessão de compra (Mitigação R02 do Plano de Testes)
    const usuario = await registerPage.criarUsuarioNovo(request);

    // 1. Acessa o catálogo e escolhe um produto disponível
    await homePage.goto();
    await homePage.selectProductByName('Combination Pliers');

    // 2. Adiciona ao carrinho (CT-005) e abre o checkout
    await productPage.addToCart();
    await productPage.goToCart();

    // 3. Confere o produto no carrinho e avança para login
    await checkoutPage.verifyCartItem('Combination Pliers');
    await checkoutPage.proceedFromCartToSignIn();

    // 4. Realiza login no checkout e avança para endereço
    await checkoutPage.completeSignInStepIfRequired(usuario.email, usuario.password);

    // 5. Preenche o endereço de cobrança e avança para pagamento
    await checkoutPage.fillBillingAddress({
      street: 'Rua do Principe 526',
      city: 'Recife',
      state: 'PE',
      country: 'BR',
      postalCode: '50050900',
    });

    // 6. Seleciona pagamento Cash on Delivery e confirma o pedido (CT-007)
    await checkoutPage.selectCashOnDeliveryAndConfirm();
  });

  test('CT-UI-06: Deve permitir remover um produto do carrinho e atualizar a listagem (CT-006)', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await homePage.goto();
    await homePage.selectProductByName('Pliers');

    await productPage.addToCart();
    await productPage.goToCart();

    await checkoutPage.verifyCartItem('Pliers');
    await checkoutPage.removeItemFromCart();
  });
});
