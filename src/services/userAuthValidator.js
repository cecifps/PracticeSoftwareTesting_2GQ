/**
 * Validador de Cadastro e Autenticação de Usuários (F01 e F02)
 * Baseado nos requisitos verificados em CT-001, CT-002, CT-003 e Sessão Exploratória 01
 * Responsável: Daniel Barros (856198) — Membro 4
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_ONLY_REGEX = /^\d{8,15}$/;
const DOB_ISO_REGEX = /^\d{4}-\d{2}-\d{2}$/;

class UserAuthValidator {
  /**
   * @param {Object} options
   * @param {Object} [options.passwordBreachChecker] - Stub para checagem de senhas vazadas (HaveIBeenPwned)
   * @param {Object} [options.auditLogger] - Mock/Spy para registrar falhas de autenticação
   */
  constructor({ passwordBreachChecker = null, auditLogger = null } = {}) {
    this.passwordBreachChecker = passwordBreachChecker;
    this.auditLogger = auditLogger;
  }

  validateEmail(email) {
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return { valid: false, error: 'Formato de e-mail inválido.' };
    }
    return { valid: true };
  }

  /**
   * Em CT-001 observou-se que o campo de telefone aceita somente números
   */
  validatePhone(phone) {
    if (typeof phone !== 'string' || !PHONE_DIGITS_ONLY_REGEX.test(phone)) {
      return {
        valid: false,
        error: 'O telefone deve conter apenas números (entre 8 e 15 dígitos).'
      };
    }
    return { valid: true };
  }

  /**
   * Em CT-001 observou-se que a data de nascimento exige YYYY-MM-DD e idade válida (18 a 75 anos no SUT)
   */
  validateBirthDate(dob, referenceDate = new Date('2026-11-17T00:00:00Z')) {
    if (typeof dob !== 'string' || !DOB_ISO_REGEX.test(dob)) {
      return {
        valid: false,
        error: 'A data de nascimento deve estar no formato YYYY-MM-DD.'
      };
    }

    const parsed = new Date(`${dob}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dob) {
      return { valid: false, error: 'Data de nascimento inexistente no calendário.' };
    }

    let age = referenceDate.getUTCFullYear() - parsed.getUTCFullYear();
    const monthDiff = referenceDate.getUTCMonth() - parsed.getUTCMonth();
    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getUTCDate() < parsed.getUTCDate())) {
      age -= 1;
    }

    if (age < 18) {
      return { valid: false, error: 'O usuário deve ter pelo menos 18 anos.' };
    }
    if (age > 110) {
      return { valid: false, error: 'Data de nascimento fora do limite permitido.' };
    }

    return { valid: true, age };
  }

  validatePasswordComplexity(password) {
    if (typeof password !== 'string' || password.length < 8) {
      return { valid: false, error: 'A senha deve possuir no mínimo 8 caracteres.' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, error: 'A senha deve conter ao menos uma letra maiúscula.' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, error: 'A senha deve conter ao menos uma letra minúscula.' };
    }
    if (!/\d/.test(password)) {
      return { valid: false, error: 'A senha deve conter ao menos um número.' };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return { valid: false, error: 'A senha deve conter ao menos um caractere especial.' };
    }
    return { valid: true };
  }

  /**
   * Valida payload completo de cadastro incluindo checagem assíncrona de vazamento de senha (CT-001)
   */
  async validateRegistrationPayload(payload) {
    const errors = [];

    if (!payload || typeof payload !== 'object') {
      return { valid: false, errors: ['Payload de cadastro ausente.'] };
    }

    if (!payload.first_name || !payload.last_name) {
      errors.push('Nome e sobrenome são obrigatórios.');
    }

    const emailCheck = this.validateEmail(payload.email);
    if (!emailCheck.valid) errors.push(emailCheck.error);

    const phoneCheck = this.validatePhone(payload.phone);
    if (!phoneCheck.valid) errors.push(phoneCheck.error);

    const dobCheck = this.validateBirthDate(payload.dob);
    if (!dobCheck.valid) errors.push(dobCheck.error);

    const pwdCheck = this.validatePasswordComplexity(payload.password);
    if (!pwdCheck.valid) {
      errors.push(pwdCheck.error);
    } else if (this.passwordBreachChecker) {
      const isBreached = await this.passwordBreachChecker.isPasswordCompromised(payload.password);
      if (isBreached) {
        errors.push('The given password has appeared in a data leak. Please choose a different password.');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Avalia resposta de login e aciona logger de auditoria em caso de falha (CT-003)
   */
  handleLoginAttemptResult(email, apiResponse) {
    if (apiResponse && apiResponse.status === 200 && apiResponse.data?.access_token) {
      return {
        authenticated: true,
        tokenType: apiResponse.data.token_type || 'bearer',
        accessToken: apiResponse.data.access_token
      };
    }

    const errorMessage = apiResponse?.data?.error || 'Invalid email or password';
    if (this.auditLogger) {
      this.auditLogger.recordFailedLogin({
        email,
        status: apiResponse?.status || 401,
        reason: errorMessage
      });
    }

    return {
      authenticated: false,
      error: errorMessage
    };
  }
}

module.exports = { UserAuthValidator };
