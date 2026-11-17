/**
 * Testes de Unidade com Mocks e Stubs — Validação de Cadastro e Autenticação (F01 / F02)
 * Cobre regras observadas em CT-001, CT-002, CT-003 e Sessão Exploratória 01
 * Responsável: Daniel Barros (856198) — Membro 4
 */

const { UserAuthValidator } = require('../../src/services/userAuthValidator');

describe('Unidade + Mocks/Stubs: UserAuthValidator (F01 Cadastro e F02 Login)', () => {
  describe('Partição de Equivalência — Campos de Cadastro (CT-001)', () => {
    const validator = new UserAuthValidator();

    test('deve validar formato de e-mail corretamente', () => {
      expect(validator.validateEmail('daniel.barros@upe.br')).toEqual({ valid: true });
      expect(validator.validateEmail('email-invalido')).toEqual({
        valid: false,
        error: 'Formato de e-mail inválido.'
      });
      expect(validator.validateEmail(null)).toEqual({
        valid: false,
        error: 'Formato de e-mail inválido.'
      });
    });

    test('deve aceitar apenas números no telefone (observação real do CT-001)', () => {
      expect(validator.validatePhone('81999887766')).toEqual({ valid: true });
      expect(validator.validatePhone('(81) 99988-7766')).toEqual({
        valid: false,
        error: 'O telefone deve conter apenas números (entre 8 e 15 dígitos).'
      });
      expect(validator.validatePhone('123')).toEqual({
        valid: false,
        error: 'O telefone deve conter apenas números (entre 8 e 15 dígitos).'
      });
    });

    test('deve exigir data de nascimento no formato YYYY-MM-DD e idade >= 18 (CT-001)', () => {
      expect(validator.validateBirthDate('1999-05-20').valid).toBe(true);
      expect(validator.validateBirthDate('20/05/1999')).toEqual({
        valid: false,
        error: 'A data de nascimento deve estar no formato YYYY-MM-DD.'
      });
      expect(validator.validateBirthDate('2026-02-30')).toEqual({
        valid: false,
        error: 'Data de nascimento inexistente no calendário.'
      });
      expect(validator.validateBirthDate('2015-11-18')).toEqual({
        valid: false,
        error: 'O usuário deve ter pelo menos 18 anos.'
      });
      expect(validator.validateBirthDate('1890-01-01')).toEqual({
        valid: false,
        error: 'Data de nascimento fora do limite permitido.'
      });
    });

    test('deve validar complexidade de senha em todas as partições', () => {
      expect(validator.validatePasswordComplexity('Curta1!')).toEqual({
        valid: false,
        error: 'A senha deve possuir no mínimo 8 caracteres.'
      });
      expect(validator.validatePasswordComplexity('semmaiuscula1!')).toEqual({
        valid: false,
        error: 'A senha deve conter ao menos uma letra maiúscula.'
      });
      expect(validator.validatePasswordComplexity('SEMMINUSCULA1!')).toEqual({
        valid: false,
        error: 'A senha deve conter ao menos uma letra minúscula.'
      });
      expect(validator.validatePasswordComplexity('SemNumero!@#')).toEqual({
        valid: false,
        error: 'A senha deve conter ao menos um número.'
      });
      expect(validator.validatePasswordComplexity('SemEspecial123')).toEqual({
        valid: false,
        error: 'A senha deve conter ao menos um caractere especial.'
      });
      expect(validator.validatePasswordComplexity('S3nhaF0rt3#2026')).toEqual({
        valid: true
      });
    });
  });

  describe('Uso de STUB — Verificação de Senha em Vazamento de Dados (CT-001)', () => {
    const basePayload = {
      first_name: 'Daniel',
      last_name: 'Barros',
      email: 'daniel.barros@teste.com',
      phone: '81988887777',
      dob: '1998-04-10'
    };

    test('deve reprovar cadastro quando o Stub de HaveIBeenPwned acusa senha vazada', async () => {
      const breachCheckerStub = {
        isPasswordCompromised: jest.fn().mockResolvedValue(true)
      };
      const validator = new UserAuthValidator({
        passwordBreachChecker: breachCheckerStub
      });

      const result = await validator.validateRegistrationPayload({
        ...basePayload,
        password: 'Password123!'
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'The given password has appeared in a data leak. Please choose a different password.'
      );
      expect(breachCheckerStub.isPasswordCompromised).toHaveBeenCalledWith('Password123!');
    });

    test('deve aprovar cadastro quando todos os campos são válidos e o Stub confirma senha segura', async () => {
      const breachCheckerStub = {
        isPasswordCompromised: jest.fn().mockResolvedValue(false)
      };
      const validator = new UserAuthValidator({
        passwordBreachChecker: breachCheckerStub
      });

      const result = await validator.validateRegistrationPayload({
        ...basePayload,
        password: 'Pst@2026!Un1c4#99'
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve acumular erros quando payload é nulo ou faltam campos obrigatórios', async () => {
      const validator = new UserAuthValidator();
      expect((await validator.validateRegistrationPayload(null)).valid).toBe(false);

      const invalidResult = await validator.validateRegistrationPayload({
        first_name: '',
        last_name: '',
        email: 'invalido',
        phone: 'abc',
        dob: 'invalida',
        password: '123'
      });
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Uso de MOCK — Auditoria de Tentativas de Login (CT-002 e CT-003)', () => {
    test('deve autenticar login válido sem disparar alerta no Mock de auditoria (CT-002)', () => {
      const auditLoggerMock = {
        recordFailedLogin: jest.fn()
      };
      const validator = new UserAuthValidator({ auditLogger: auditLoggerMock });

      const result = validator.handleLoginAttemptResult('daniel@teste.com', {
        status: 200,
        data: {
          access_token: 'jwt.token.valido',
          token_type: 'bearer'
        }
      });

      expect(result.authenticated).toBe(true);
      expect(result.accessToken).toBe('jwt.token.valido');
      expect(auditLoggerMock.recordFailedLogin).not.toHaveBeenCalled();
    });

    test('deve registrar evento de falha no Mock de auditoria quando login retorna 401 (CT-003)', () => {
      const auditLoggerMock = {
        recordFailedLogin: jest.fn()
      };
      const validator = new UserAuthValidator({ auditLogger: auditLoggerMock });

      const result = validator.handleLoginAttemptResult('invasor@teste.com', {
        status: 401,
        data: {
          error: 'Invalid email or password'
        }
      });

      expect(result.authenticated).toBe(false);
      expect(result.error).toBe('Invalid email or password');
      expect(auditLoggerMock.recordFailedLogin).toHaveBeenCalledTimes(1);
      expect(auditLoggerMock.recordFailedLogin).toHaveBeenCalledWith({
        email: 'invasor@teste.com',
        status: 401,
        reason: 'Invalid email or password'
      });
    });
  });
});
