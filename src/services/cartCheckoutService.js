/**
 * Serviço de Regras de Negócio de Carrinho e Checkout (F04 e F05)
 * Mitiga o Risco R06 do Plano de Testes ("Cálculo errado de total no checkout")
 * Responsável: Daniel Barros (856198) — Membro 4
 */

const MAX_ITEM_QUANTITY = 99;
const MIN_ITEM_QUANTITY = 1;

const SUPPORTED_PAYMENT_METHODS = [
  'cash-on-delivery',
  'bank-transfer',
  'credit-card',
  'buy-now-pay-later',
  'gift-card'
];

class CartCheckoutService {
  /**
   * @param {Object} dependencies
   * @param {Object} [dependencies.inventoryGateway] - Stub/Mock para consulta de estoque na API
   * @param {Object} [dependencies.paymentGateway] - Stub/Mock para validação de pagamento (/payment/check)
   * @param {Object} [dependencies.invoiceRepository] - Mock para registro de fatura (/invoices)
   */
  constructor({ inventoryGateway = null, paymentGateway = null, invoiceRepository = null } = {}) {
    this.inventoryGateway = inventoryGateway;
    this.paymentGateway = paymentGateway;
    this.invoiceRepository = invoiceRepository;
  }

  /**
   * Valida a quantidade segundo Análise de Valor Limite (1 a 99)
   */
  validateQuantity(quantity) {
    if (!Number.isInteger(quantity)) {
      throw new Error('Quantidade deve ser um número inteiro.');
    }
    if (quantity < MIN_ITEM_QUANTITY) {
      throw new Error(`Quantidade mínima permitida é ${MIN_ITEM_QUANTITY}.`);
    }
    if (quantity > MAX_ITEM_QUANTITY) {
      throw new Error(`Quantidade máxima permitida por item é ${MAX_ITEM_QUANTITY}.`);
    }
    return true;
  }

  /**
   * Calcula subtotal de um item arredondado para 2 casas decimais
   */
  calculateLineTotal(unitPrice, quantity) {
    if (typeof unitPrice !== 'number' || Number.isNaN(unitPrice) || unitPrice <= 0) {
      throw new Error('Preço unitário deve ser um número positivo.');
    }
    this.validateQuantity(quantity);
    return Number((unitPrice * quantity).toFixed(2));
  }

  /**
   * Calcula o resumo completo do carrinho (subtotal, desconto ecológico/cupom e total final)
   */
  calculateCartSummary(items, { couponCode = null } = {}) {
    if (!Array.isArray(items) || items.length === 0) {
      return {
        itemCount: 0,
        subtotal: 0,
        discount: 0,
        total: 0
      };
    }

    let itemCount = 0;
    let subtotalCents = 0;

    for (const item of items) {
      if (!item || !item.id || !item.name) {
        throw new Error('Item do carrinho inválido: id e name são obrigatórios.');
      }
      const lineTotal = this.calculateLineTotal(item.price, item.quantity);
      itemCount += item.quantity;
      subtotalCents += Math.round(lineTotal * 100);
    }

    const subtotal = Number((subtotalCents / 100).toFixed(2));
    let discountRate = 0;

    if (couponCode === 'ECO10') {
      const allEcoFriendly = items.every((i) => Boolean(i.is_eco_friendly));
      discountRate = allEcoFriendly ? 0.10 : 0.05;
    } else if (couponCode === 'TOOL20' && subtotal >= 100) {
      discountRate = 0.20;
    } else if (couponCode !== null) {
      throw new Error(`Cupom inválido ou não aplicável: ${couponCode}`);
    }

    const discount = Number((subtotal * discountRate).toFixed(2));
    const total = Number((subtotal - discount).toFixed(2));

    return {
      itemCount,
      subtotal,
      discount,
      total
    };
  }

  /**
   * Adiciona produto ao carrinho consultando disponibilidade via Gateway (Stub/Mock)
   */
  async addItemWithStockCheck(cartItems, product, quantity) {
    this.validateQuantity(quantity);

    if (this.inventoryGateway) {
      const stockInfo = await this.inventoryGateway.checkStock(product.id);
      if (!stockInfo || !stockInfo.in_stock || stockInfo.available < quantity) {
        throw new Error(`Produto "${product.name}" sem estoque suficiente.`);
      }
    }

    const existingIndex = cartItems.findIndex((i) => i.id === product.id);
    const updated = [...cartItems];

    if (existingIndex >= 0) {
      const newQuantity = updated[existingIndex].quantity + quantity;
      this.validateQuantity(newQuantity);
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQuantity
      };
    } else {
      updated.push({
        id: product.id,
        name: product.name,
        price: product.price,
        is_eco_friendly: Boolean(product.is_eco_friendly),
        quantity
      });
    }

    return updated;
  }

  /**
   * Processa o checkout integrando com PaymentGateway e InvoiceRepository (Mocks/Stubs)
   */
  async processCheckout({ cartItems, user, billingAddress, paymentMethod, paymentDetails = {}, couponCode = null }) {
    if (!user || !user.id) {
      throw new Error('Usuário autenticado é obrigatório para concluir o checkout.');
    }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Não é possível finalizar checkout com o carrinho vazio.');
    }
    if (!billingAddress || !billingAddress.street || !billingAddress.city || !billingAddress.country || !billingAddress.postal_code) {
      throw new Error('Endereço de cobrança incompleto.');
    }
    if (!SUPPORTED_PAYMENT_METHODS.includes(paymentMethod)) {
      throw new Error(`Método de pagamento não suportado: ${paymentMethod}`);
    }

    const summary = this.calculateCartSummary(cartItems, { couponCode });

    if (!this.paymentGateway) {
      throw new Error('Gateway de pagamento não configurado.');
    }

    const paymentResult = await this.paymentGateway.verifyPayment({
      payment_method: paymentMethod,
      payment_details: paymentDetails,
      amount: summary.total
    });

    if (!paymentResult || paymentResult.status !== 'SUCCESS') {
      return {
        success: false,
        message: paymentResult?.message || 'Payment failed',
        summary
      };
    }

    let invoice = null;
    if (this.invoiceRepository) {
      invoice = await this.invoiceRepository.createInvoice({
        user_id: user.id,
        billing_address: billingAddress,
        payment_method: paymentMethod,
        total: summary.total,
        items: cartItems
      });
    }

    return {
      success: true,
      message: 'Payment was successful',
      summary,
      invoice
    };
  }
}

module.exports = {
  CartCheckoutService,
  MAX_ITEM_QUANTITY,
  MIN_ITEM_QUANTITY,
  SUPPORTED_PAYMENT_METHODS
};
