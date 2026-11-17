/**
 * Testes Automatizados de API REST — Cadastro e Autenticação de Usuários (F01 e F02)
 * SUT: Practice Software Testing API (https://api.practicesoftwaretesting.com)
 * Rastreabilidade: CT-001, CT-002, CT-003 e Risco R02 (dados dinâmicos por execução)
 * Responsável: Daniel Barros (856198) — Membro 4
 */

const { PstApiClient } = require('../../src/api/pstApiClient');

describe('API REST (Swagger): F01 Cadastro e F02 Autenticação/Login', () => {
  const api = new PstApiClient();
  const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const uniqueEmail = `daniel.barros.${uniqueSuffix}@upe-qa.org`;
  // Senha única forte e não presente em vazamentos (HaveIBeenPwned)
  const strongPassword = `QaPst#${uniqueSuffix}!9xZ`;

  const validUserPayload = {
    first_name: 'Daniel',
    last_name: 'Barros',
    dob: '1998-07-15',
    phone: '81998765432',
    email: uniqueEmail,
    password: strongPassword,
    address: {
      street: 'Av. Agamenon Magalhaes 100',
      city: 'Recife',
      state: 'PE',
      country: 'BR',
      postal_code: '50010000'
    }
  };

  test('POST /users/register — deve cadastrar um novo usuário com dados válidos (CT-001 -> 201 Created)', async () => {
    const res = await api.registerUser(validUserPayload);

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('id');
    expect(res.data.email).toBe(uniqueEmail);
    expect(res.data.first_name).toBe('Daniel');
  });

  test('POST /users/register — deve rejeitar e-mail duplicado (409 Conflict) e senha vazada (422 Unprocessable Entity)', async () => {
    const dupRes = await api.registerUser(validUserPayload);
    expect(dupRes.status).toBe(409);

    const leakedPwdRes = await api.registerUser({
      ...validUserPayload,
      email: `leaked.${uniqueSuffix}@upe-qa.org`,
      password: 'Password123!'
    });
    expect(leakedPwdRes.status).toBe(422);
  });

  test('POST /users/login — deve impedir login com credenciais inválidas (CT-003 -> 401 Unauthorized)', async () => {
    const res = await api.login(uniqueEmail, 'SenhaIncorreta999!');

    expect(res.status).toBe(401);
    expect(res.data).toHaveProperty('error', 'Unauthorized');
  });

  test('POST /users/login e GET /users/me — deve autenticar usuário válido e retornar perfil protegido via JWT Bearer (CT-002)', async () => {
    // 1. Verifica bloqueio sem token antes do login
    const unauthMe = await api.getCurrentUser();
    expect(unauthMe.status).toBe(401);

    // 2. Realiza login válido
    const loginRes = await api.login(uniqueEmail, strongPassword);
    expect(loginRes.status).toBe(200);
    expect(loginRes.data).toHaveProperty('access_token');
    expect(loginRes.data.token_type.toLowerCase()).toBe('bearer');

    // 3. Acessa rota protegida /users/me com o token Bearer
    const meRes = await api.getCurrentUser();
    expect(meRes.status).toBe(200);
    expect(meRes.data.email).toBe(uniqueEmail);
  });
});
