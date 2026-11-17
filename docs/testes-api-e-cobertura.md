# Relatório de Testes Automatizados de API, Unidade, Mocks/Stubs e Cobertura (Eixo 3)

**Disciplina:** Testes e Qualidade de Software  
**Professora:** Monique Soares  
**Responsável (Membro 4):** Daniel Barros (Matrícula: 856198)  
**Sistema sob Teste (SUT):** Practice Software Testing (`https://practicesoftwaretesting.com` | API Swagger: `https://api.practicesoftwaretesting.com`)  
**Data de execução:** 17/11/2026  

---

## 1. Objetivo e Estratégia Técnica (Eixo 3 — Backend / API e Unidade)

Este documento detalha a implementação, execução e análise crítica da suíte de testes automatizados de **Backend/API** e **Unidade com Mocks/Stubs**, compondo o **Entregável 03 (Testes Automatizados + Cobertura)** e fornecendo insumos diretos para o **Entregável 04 (Análise de Qualidade e Bugs)** e **Entregável 05 (Pipeline CI/CD)**.

A estratégia foi dividida em duas camadas complementares da Pirâmide de Testes:

1. **Testes de Unidade Isolados com *Mocks* e *Stubs* (`tests/unit/`):**
   - Executados de forma rápida e determinística sobre os módulos de regras de negócio e cliente de integração (`src/services/cartCheckoutService.js`, `src/services/userAuthValidator.js` e `src/api/pstApiClient.js`).
   - Aplicam **Partição de Equivalência**, **Análise de Valor Limite (Boundary Value Analysis)** e **Tabela de Decisão**, isolando dependências externas (banco de faturas, gateway de pagamento, serviço de estoque e API HaveIBeenPwned) através de dublês de teste (`jest.fn()`).
2. **Testes de Integração e Contrato de API REST (`tests/api/`):**
   - Executados diretamente contra o ambiente real documentado no Swagger (`https://api.practicesoftwaretesting.com`).
   - Validam contratos JSON, códigos de status HTTP (`200`, `201`, `204`, `401`, `404`, `422`), cabeçalhos de autenticação JWT (`Authorization: Bearer <token>`) e fluxos ponta a ponta no backend (F01 a F07).

---

## 2. Rastreabilidade com o Plano de Testes e Casos Manuais

A tabela abaixo demonstra como os testes automatizados pelo Membro 4 cobrem as funcionalidades priorizadas pelo Membro 1 ([plano-de-testes.md](plano-de-testes.md)) e automatizam as verificações feitas manualmente pelo Membro 2 ([casos-manuais.md](casos-manuais.md) e [sessao-01.md](sessoes-exploratorias/sessao-01.md)):

| Funcionalidade / Risco | Caso Manual / Exploratório Relacionado | Arquivo de Teste Automatizado | Escopo Validado |
|---|---|---|---|
| **F01 — Cadastro de Usuário** (Prioridade Média) / **R02** | `CT-001` e `Sessão 01` (telefone numérico, data `YYYY-MM-DD`, senha vazada) | `tests/unit/userAuthValidator.unit.test.js`<br>`tests/api/auth-users.api.test.js` | Criação de usuário único por execução (`201`), bloqueio de e-mail duplicado e senha vazada (`422`), validação de formato de telefone e idade mínima. |
| **F02 — Login e Autenticação** (Prioridade Alta) | `CT-002` (Login válido) e `CT-003` (Login inválido) | `tests/unit/userAuthValidator.unit.test.js`<br>`tests/api/auth-users.api.test.js` | Emissão de token JWT Bearer (`200`), rejeição com `Invalid email or password` (`401`), proteção de `/users/me` (`401` sem token vs `200` com token). |
| **F03 — Catálogo, Busca, Filtros e Ordenação** (Prioridade Média) | `CT-004` (Busca por "Pliers") e `Sessão 01` (`produto_inexistente_999`) | `tests/api/catalog-search.api.test.js` | Paginação e contrato de `GET /products`, busca com resultados (`Pliers`), busca vazia (`0 products`), ordenação (`price,asc` / `price,desc`), `404` para ID inexistente, categorias e marcas. |
| **F04 — Carrinho de Compras** (Prioridade Alta) / **R06** | `CT-005` (Adicionar item) e `CT-006` (Remover item) | `tests/unit/cartCheckoutService.unit.test.js`<br>`tests/api/cart-checkout-favorites-contact.api.test.js` | Ciclo completo na API (`POST /carts`, `POST /carts/{id}`, `GET /carts/{id}`, `PUT .../quantity`, `DELETE .../product/{id}`) e cálculo exato de subtotais/descontos sem erro de ponto flutuante. |
| **F05 — Checkout e Pagamento** (Prioridade Alta) / **R06** | `CT-007` (Pagamento *cash-on-delivery*) | `tests/unit/cartCheckoutService.unit.test.js`<br>`tests/api/cart-checkout-favorites-contact.api.test.js` | Validação de pagamento em `POST /payment/check` (`Payment was successful`) e teste unitário com *Mock* de emissão de fatura (`/invoices`). |
| **F06 — Favoritos** (Prioridade Baixa) | `CT-008` e `Sessão 01` (Erro inicial de autorização em favoritos) | `tests/api/cart-checkout-favorites-contact.api.test.js` | Reprodução técnica do erro `401 Unauthorized` quando o token não é enviado e validação do fluxo autenticado (`POST /favorites` e `GET /favorites`). |
| **F07 — Formulário de Contato** (Prioridade Baixa) | `CT-009` (Envio de mensagem) | `tests/api/cart-checkout-favorites-contact.api.test.js` | Envio de mensagem válida em `POST /messages` (`200`) e crítica de payload incompleto (`422`). |

---

## 3. Uso Técnico de *Mocks* e *Stubs* (Justificativa Prática)

Conforme exigido no Eixo 3, aplicamos a distinção clássica de Gerard Meszaros / Martin Fowler entre **Stubs** (verificação de estado / respostas indiretas pré-programadas) e **Mocks** (verificação de comportamento / expectativas sobre chamadas a dependências externas):

1. **Stubs Implementados:**
   - **`inventoryGatewayStub` (`cartCheckoutService.unit.test.js`):** Simula o retorno da API de estoque (`{ in_stock: true, available: 10 }` vs `{ in_stock: false, available: 0 }`) permitindo testar o bloqueio de compra de item esgotado sem depender de alterações reais no banco de dados público do SUT.
   - **`breachCheckerStub` (`userAuthValidator.unit.test.js`):** Simula a consulta externa de vazamento de senhas (*HaveIBeenPwned*) observada no `CT-001`, garantindo que senhas comprometidas retornem a mensagem exata `"The given password has appeared in a data leak"`.
   - **`fetchMock` com respostas `502 Bad Gateway` e `204 No Content` (`pstApiClient.unit.test.js`):** Simula indisponibilidade do servidor público (**Risco R01**), validando que o cliente não quebra ao receber HTML de erro em vez de JSON.
2. **Mocks Implementados:**
   - **`paymentGatewayMock` e `invoiceRepositoryMock` (`cartCheckoutService.unit.test.js`):** Verificam o comportamento do checkout: quando o pagamento é aprovado (`status: 'SUCCESS'`), o teste garante via `expect(invoiceRepositoryMock.createInvoice).toHaveBeenCalledTimes(1)` e `toHaveBeenCalledWith(...)` que a fatura foi gerada com o valor total exato; já quando o pagamento é recusado (`status: 'REJECTED'`), garante via `expect(invoiceRepositoryMock.createInvoice).not.toHaveBeenCalled()` que nenhuma fatura indevida é emitida.
   - **`auditLoggerMock` (`userAuthValidator.unit.test.js`):** Verifica que tentativas de login inválidas (`401 Unauthorized`, conforme `CT-003`) acionam obrigatoriamente o registro de auditoria com o e-mail, código HTTP e motivo da falha.

---

## 4. Achados Técnicos e Análise Crítica da API (Contribuição para o Eixo 4/5)

Durante a construção e execução dos testes automatizados de API contra `https://api.practicesoftwaretesting.com`, identificamos pontos técnicos importantes que enriquecem a avaliação de qualidade do sistema:

1. **Descoberta dos Endpoints de Carrinho (`/carts`) no Backend:**
   - No levantamento preliminar do [plano-de-testes.md](plano-de-testes.md), havia a hipótese de que o carrinho funcionava apenas no frontend (`localStorage`). Contudo, ao inspecionar o contrato Swagger da API, verificamos que o backend expõe endpoints completos de persistência de carrinho (`POST /carts`, `GET /carts/{id}`, `POST /carts/{id}`, `PUT /carts/{id}/product/quantity` e `DELETE /carts/{id}/product/{product_id}`), os quais foram integralmente cobertos pela nossa suíte automatizada.
2. **Explicação Técnica para o Comportamento Inesperado na Sessão Exploratória 01 (Favoritos):**
   - Na [Sessão Exploratória 01](sessoes-exploratorias/sessao-01.md), o Membro 2 observou que *"a funcionalidade de favoritos apresentou inicialmente uma mensagem de autorização negada, mas funcionou após uma nova tentativa"*.
   - Nossos testes de API comprovaram que `POST /favorites` exige estritamente o cabeçalho `Authorization: Bearer <token>` (retornando `401 Unauthorized` com `{"message": "Unauthorized"}` caso o token ainda não esteja anexado ou tenha expirado na sessão do frontend Angular).
3. **Mitigação Efetiva do Risco R02 (Mutabilidade dos Dados no Ambiente Público):**
   - Como o banco de dados de `api.practicesoftwaretesting.com` é compartilhado e reiniciado periodicamente, os testes `auth-users.api.test.js` e `cart-checkout-favorites-contact.api.test.js` geram identificadores e credenciais dinâmicas com *timestamp* a cada execução e consultam o primeiro produto ativo do catálogo antes de testar o carrinho, tornando a suíte **100% idempotente e livre de *flakiness*** no pipeline CI/CD.
4. **Distinção Semântica de Erros HTTP no Cadastro e Login (`409` vs `422` vs `401`):**
   - Ao testar `POST /users/register`, verificamos na prática que a API diferencia semanticamente **conflito de estado** (`409 Conflict` ao tentar reutilizar um e-mail já cadastrado) de **violação de regra de validação/segurança** (`422 Unprocessable Entity` ao submeter a senha vazada `Password123!`).
   - Em `POST /users/login` com credenciais inválidas (`CT-003`), o endpoint retorna `401` com `{"error": "Unauthorized"}`, enquanto o frontend Angular traduz esse código para exibir `"Invalid email or password"` na interface.

---

## 5. Resultados da Execução e Métricas de Cobertura de Código

Todos os testes (Unidade + API REST real) foram executados com sucesso utilizando **Node.js v26.13.1** e **Jest 29.7.0**:

- **Suítes executadas:** 6 suítes aprovadas (`3` de Unidade com Mocks/Stubs + `3` de Integração/Contrato de API REST)
- **Total de testes automatizados:** 48 testes executados (`29` unitários + `19` de integração na API real), **48 aprovados (100% de aprovação)**, 0 falhas.

### 5.1 Tabela de Cobertura de Código (Jest / Istanbul)

A meta estabelecida nos **Critérios de Saída (Seção 7 do Plano de Testes)** era atingir **no mínimo 70% de cobertura de código**. Nossa suíte atingiu **100% de cobertura de instruções, funções e linhas, e 94.05% de cobertura de ramificações (branches)**:

| Arquivo | % Statements (Instruções) | % Branch (Ramificações) | % Functions (Funções) | % Lines (Linhas) |
|---|---:|---:|---:|---:|
| `src/api/pstApiClient.js` | 100.00% | 91.89% | 100.00% | 100.00% |
| `src/services/cartCheckoutService.js` | 100.00% | 95.94% | 100.00% | 100.00% |
| `src/services/userAuthValidator.js` | 100.00% | 93.24% | 100.00% | 100.00% |
| **Total Geral (All files)** | **100.00%** | **94.05%** | **100.00%** | **100.00%** |

### 5.2 Evidências Geradas

- **Relatório HTML interativo e LCOV:** `evidencias/coverage/index.html` e `evidencias/coverage/lcov.info`
- **Resumo JSON de cobertura:** `evidencias/coverage/coverage-summary.json`
- **Log completo de execução real (Unidade + API Swagger):** `evidencias/execucao-testes-api-unidade-cobertura.txt`
