/**
 * Testes de Unidade com Mocks e Stubs — Carrinho e Checkout (F04 / F05)
 * Técnicas aplicadas: Partição de Equivalência, Análise de Valor Limite, Tabela de Decisão, Stubs e Mocks
 * Responsável: Daniel Barros (856198) — Membro 4
 */

const {
  CartCheckoutService,
  MAX_ITEM_QUANTITY,
  MIN_ITEM_QUANTITY
} = require('../../src/services/cartCheckoutService');

describe('Unidade + Mocks/Stubs: CartCheckoutService (F04 Carrinho e F05 Checkout)', () => {
  describe('Análise de Valor Limite — validateQuantity()', () => {
    const service = new CartCheckoutService();

    test('deve rejeitar quantidade menor que o limite mínimo (0 e -1)', () => {
      expect(() => service.validateQuantity(0)).toThrow(
        `Quantidade mínima permitida é ${MIN_ITEM_QUANTITY}.`
      );
      expect(() => service.validateQuantity(-1)).toThrow(
        `Quantidade mínima permitida é ${MIN_ITEM_QUANTITY}.`
      );
    });

    test('deve aceitar os valores exatamente nas fronteiras válidas (1 e 99)', () => {
      expect(service.validateQuantity(1)).toBe(true);
      expect(service.validateQuantity(99)).toBe(true);
    });

    test('deve rejeitar quantidade imediatamente acima do limite máximo (100)', () => {
      expect(() => service.validateQuantity(100)).toThrow(
        `Quantidade máxima permitida por item é ${MAX_ITEM_QUANTITY}.`
      );
    });

    test('deve rejeitar quantidade não inteira ou tipo inválido', () => {
      expect(() => service.validateQuantity(1.5)).toThrow(
        'Quantidade deve ser um número inteiro.'
      );
      expect(() => service.validateQuantity('2')).toThrow(
        'Quantidade deve ser um número inteiro.'
      );
    });
  });

  describe('Cálculo de Subtotal e Resumo do Carrinho (Mitigação do Risco R06)', () => {
    const service = new CartCheckoutService();

    test('deve retornar valores zerados para carrinho vazio', () => {
      expect(service.calculateCartSummary([])).toEqual({
        itemCount: 0,
        subtotal: 0,
        discount: 0,
        total: 0
      });
    });

    test('deve calcular corretamente múltiplos itens com casas decimais sem erro de ponto flutuante', () => {
      const items = [
        { id: 'p1', name: 'Combination Pliers', price: 14.15, quantity: 2, is_eco_friendly: true },
        { id: 'p2', name: 'Bolt Cutters', price: 48.41, quantity: 1, is_eco_friendly: false }
      ];

      const summary = service.calculateCartSummary(items);
      expect(summary).toEqual({
        itemCount: 3,
        subtotal: 76.71,
        discount: 0,
        total: 76.71
      });
    });

    test('Tabela de Decisão: cupom ECO10 concede 10% quando todos os itens são eco-friendly', () => {
      const items = [
        { id: 'p1', name: 'Slip Joint Pliers', price: 9.17, quantity: 2, is_eco_friendly: true },
        { id: 'p2', name: 'Claw Hammer', price: 11.48, quantity: 1, is_eco_friendly: true }
      ];

      const summary = service.calculateCartSummary(items, { couponCode: 'ECO10' });
      expect(summary.subtotal).toBe(29.82);
      expect(summary.discount).toBe(2.98);
      expect(summary.total).toBe(26.84);
    });

    test('Tabela de Decisão: cupom ECO10 concede 5% quando há mistura de itens eco e não-eco', () => {
      const items = [
        { id: 'p1', name: 'Eco Pliers', price: 50.0, quantity: 1, is_eco_friendly: true },
        { id: 'p2', name: 'Heavy Hammer', price: 50.0, quantity: 1, is_eco_friendly: false }
      ];

      const summary = service.calculateCartSummary(items, { couponCode: 'ECO10' });
      expect(summary.subtotal).toBe(100.0);
      expect(summary.discount).toBe(5.0);
      expect(summary.total).toBe(95.0);
    });

    test('Tabela de Decisão: cupom TOOL20 concede 20% apenas se subtotal >= 100', () => {
      const items = [
        { id: 'p1', name: 'Cordless Drill 24V', price: 65.0, quantity: 2 }
      ];
      const summary = service.calculateCartSummary(items, { couponCode: 'TOOL20' });
      expect(summary.subtotal).toBe(130.0);
      expect(summary.discount).toBe(26.0);
      expect(summary.total).toBe(104.0);
    });

    test('deve rejeitar cupom inexistente ou preço/item inválido', () => {
      const validItems = [{ id: 'p1', name: 'Pliers', price: 20.0, quantity: 1 }];
      expect(() =>
        service.calculateCartSummary(validItems, { couponCode: ' CUPOM_FALSO ' })
      ).toThrow('Cupom inválido ou não aplicável');

      expect(() =>
        service.calculateCartSummary([{ id: null, name: '', price: 10, quantity: 1 }])
      ).toThrow('Item do carrinho inválido: id e name são obrigatórios.');

      expect(() => service.calculateLineTotal(0, 1)).toThrow(
        'Preço unitário deve ser um número positivo.'
      );
    });
  });

  describe('Uso de STUBS — Consulta de Estoque em addItemWithStockCheck()', () => {
    test('deve adicionar novo item e incrementar item existente quando o Stub de estoque retorna disponível', async () => {
      // STUB: fornece resposta pré-programada simulando a API de estoque
      const inventoryGatewayStub = {
        checkStock: jest.fn().mockResolvedValue({ in_stock: true, available: 10 })
      };

      const service = new CartCheckoutService({ inventoryGateway: inventoryGatewayStub });
      const product = { id: 'prod-01', name: 'Combination Pliers', price: 14.15, is_eco_friendly: true };

      let cart = await service.addItemWithStockCheck([], product, 2);
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(2);

      cart = await service.addItemWithStockCheck(cart, product, 3);
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(5);
      expect(inventoryGatewayStub.checkStock).toHaveBeenCalledTimes(2);
      expect(inventoryGatewayStub.checkStock).toHaveBeenCalledWith('prod-01');
    });

    test('deve bloquear adição quando o Stub de estoque indica produto esgotado', async () => {
      const inventoryGatewayStub = {
        checkStock: jest.fn().mockResolvedValue({ in_stock: false, available: 0 })
      };

      const service = new CartCheckoutService({ inventoryGateway: inventoryGatewayStub });
      const product = { id: 'prod-out', name: 'Long Nose Pliers', price: 14.24 };

      await expect(service.addItemWithStockCheck([], product, 1)).rejects.toThrow(
        'Produto "Long Nose Pliers" sem estoque suficiente.'
      );
    });
  });

  describe('Uso de MOCKS — Fluxo de Checkout e Geração de Fatura (CT-007)', () => {
    const sampleCart = [
      { id: 'prod-1', name: 'Combination Pliers', price: 14.15, quantity: 2, is_eco_friendly: true }
    ];
    const sampleUser = { id: 'user-123', email: 'daniel.barros@teste.com' };
    const sampleAddress = {
      street: 'Rua da Qualidade, 100',
      city: 'Recife',
      state: 'PE',
      country: 'BR',
      postal_code: '50000-000'
    };

    test('deve aprovar checkout cash-on-delivery e invocar Mock de criação de fatura com argumentos exatos', async () => {
      // STUB + MOCK: simula aprovação do /payment/check e verifica interação com /invoices
      const paymentGatewayMock = {
        verifyPayment: jest.fn().mockResolvedValue({
          status: 'SUCCESS',
          message: 'Payment was successful'
        })
      };
      const invoiceRepositoryMock = {
        createInvoice: jest.fn().mockResolvedValue({
          id: 'inv-9001',
          invoice_number: 'INV-20260001'
        })
      };

      const service = new CartCheckoutService({
        paymentGateway: paymentGatewayMock,
        invoiceRepository: invoiceRepositoryMock
      });

      const result = await service.processCheckout({
        cartItems: sampleCart,
        user: sampleUser,
        billingAddress: sampleAddress,
        paymentMethod: 'cash-on-delivery'
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Payment was successful');
      expect(result.summary.total).toBe(28.3);
      expect(result.invoice.invoice_number).toBe('INV-20260001');

      // Verificação comportamental (Mock assertion)
      expect(paymentGatewayMock.verifyPayment).toHaveBeenCalledTimes(1);
      expect(paymentGatewayMock.verifyPayment).toHaveBeenCalledWith({
        payment_method: 'cash-on-delivery',
        payment_details: {},
        amount: 28.3
      });

      expect(invoiceRepositoryMock.createInvoice).toHaveBeenCalledTimes(1);
      expect(invoiceRepositoryMock.createInvoice).toHaveBeenCalledWith({
        user_id: 'user-123',
        billing_address: sampleAddress,
        payment_method: 'cash-on-delivery',
        total: 28.3,
        items: sampleCart
      });
    });

    test('não deve gerar fatura (Mock não chamado) quando o gateway recusa o pagamento', async () => {
      const paymentGatewayMock = {
        verifyPayment: jest.fn().mockResolvedValue({
          status: 'REJECTED',
          message: 'Insufficient funds'
        })
      };
      const invoiceRepositoryMock = {
        createInvoice: jest.fn()
      };

      const service = new CartCheckoutService({
        paymentGateway: paymentGatewayMock,
        invoiceRepository: invoiceRepositoryMock
      });

      const result = await service.processCheckout({
        cartItems: sampleCart,
        user: sampleUser,
        billingAddress: sampleAddress,
        paymentMethod: 'credit-card'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Insufficient funds');
      expect(invoiceRepositoryMock.createInvoice).not.toHaveBeenCalled();
    });

    test('deve validar pré-condições obrigatórias de checkout (usuário, carrinho, endereço e método)', async () => {
      const service = new CartCheckoutService();

      await expect(
        service.processCheckout({
          cartItems: sampleCart,
          user: null,
          billingAddress: sampleAddress,
          paymentMethod: 'cash-on-delivery'
        })
      ).rejects.toThrow('Usuário autenticado é obrigatório');

      await expect(
        service.processCheckout({
          cartItems: [],
          user: sampleUser,
          billingAddress: sampleAddress,
          paymentMethod: 'cash-on-delivery'
        })
      ).rejects.toThrow('carrinho vazio');

      await expect(
        service.processCheckout({
          cartItems: sampleCart,
          user: sampleUser,
          billingAddress: { street: 'Rua A' },
          paymentMethod: 'cash-on-delivery'
        })
      ).rejects.toThrow('Endereço de cobrança incompleto');

      await expect(
        service.processCheckout({
          cartItems: sampleCart,
          user: sampleUser,
          billingAddress: sampleAddress,
          paymentMethod: 'pix-inexistente'
        })
      ).rejects.toThrow('Método de pagamento não suportado');

      await expect(
        service.processCheckout({
          cartItems: sampleCart,
          user: sampleUser,
          billingAddress: sampleAddress,
          paymentMethod: 'cash-on-delivery'
        })
      ).rejects.toThrow('Gateway de pagamento não configurado.');
    });
  });
});
