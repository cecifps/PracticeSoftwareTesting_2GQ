# Plano de Testes: Practice Software Testing

**Disciplina:** Testes de Qualidade de Software
**Professora:** Monique Soares
**Data de elaboração:** 16/11/2026
**Data de entrega:** 23/11/2026

---

## 1. Introdução e SUT

Este plano define como a equipe vai verificar e validar o **Practice Software Testing**, um e-commerce de demonstração com frontend Angular e API REST documentada em Swagger. Ele organiza o que será testado, como, por quem e com quais critérios.

| Item | Descrição |
|------|-----------|
| SUT | Practice Software Testing (Opção 1) |
| URL | https://practicesoftwaretesting.com |
| Data de acesso | 16/11/2026 |
| Versão testada | [anotar ao iniciar os testes] |

**Por que escolhemos este SUT:** O Practice Software Testing tem uma API REST documentada em Swagger, o que facilita automatizar testes de API com requisições reais e conferir o contrato do sistema. Ele também tem um fluxo de compra completo (login, carrinho e checkout), que nos permite aplicar todo o ciclo de testes da disciplina em um cenário parecido com o de um produto real. Como é um projeto aberto, podemos rodar uma cópia local se o ambiente público ficar instável e analisar o código para a parte de qualidade e refatoração. Por fim, o foco do sistema é funcional, o que combina com o prazo curto do projeto.

---

## 2. Escopo

### 2.1 Dentro do escopo

> Confirmem no site quais funcionalidades existem antes de fechar a tabela.

| ID | Funcionalidade | Frontend | API |
|----|----------------|:--------:|:---:|
| F01 | Cadastro de usuário | Sim | Sim |
| F02 | Login e logout | Sim | Sim |
| F03 | Catálogo, busca, filtros e ordenação | Sim | Sim |
| F04 | Carrinho | Sim | Sim |
| F05 | Checkout e pagamento | Sim | Parcial |
| F06 | Favoritos | Sim | Parcial |
| F07 | Formulário de contato | Sim | Parcial |

### 2.2 Fora do escopo

| Item | Justificativa |
|------|---------------|
| Testes de carga e estresse | Fogem do foco funcional da disciplina |
| Testes de segurança aprofundados | Não temos autorização para atacar um ambiente público |
| Painel administrativo | Não faz parte do fluxo principal de compra e exigiria um perfil privilegiado |

---

## 3. Estratégia de V&V

- **Verificação** ("estamos construindo certo?"): revisão de código, análise estática e checagem do contrato da API.
- **Validação** ("estamos construindo o produto certo?"): testes manuais e exploratórios, do ponto de vista do usuário.

| Tipo de teste | Objetivo | Responsável | Ferramenta |
|---------------|----------|-------------|------------|
| Manual estruturado | Validar fluxos principais com casos repetíveis | Membro 2 | Casos em Markdown (`docs/casos-manuais.md`) |
| Exploratório | Achar defeitos que os casos escritos não preveem | Membro 2 | Charters e anotações de sessão |
| E2E / UI | Automatizar as jornadas do usuário | Membro 3 | Playwright |
| API e cobertura | Validar contrato, erros e cobertura da API | Membro 4 | Python (`pytest`, `requests` e `pytest-cov`) |
| Análise estática | Métricas e code smells | Membro 5 | ESLint e SonarCloud |
| Pipeline | Rodar build e testes automaticamente | Membro 6 | GitHub Actions |

**Técnicas de projeto de casos:** partição de equivalência, análise de valor limite e tabela de decisão (por exemplo, no checkout).

**Regressão:** a suíte de regressão reúne os testes automatizados dos fluxos de prioridade alta (login, carrinho e checkout) e os testes criados para cada bug corrigido. Ela roda no pipeline a cada commit na branch principal e manualmente antes de cada entrega parcial.

---

## 4. Análise de Riscos

Cada risco recebe nota de probabilidade e impacto (1 = baixo, 2 = médio, 3 = alto). A exposição é o produto das duas.

| ID | Risco | Prob. | Imp. | Exp. | Mitigação |
|----|-------|:-----:|:----:|:----:|-----------|
| R01 | Ambiente público fora do ar ou lento | 2 | 3 | 6 | Rodar o SUT localmente |
| R02 | Dados do ambiente mudarem entre execuções | 3 | 2 | 6 | Criar usuários próprios a cada execução |
| R03 | Membro atrasar e travar a consolidação | 2 | 3 | 6 | Prazos internos e reunião semanal |
| R04 | Testes de UI instáveis (flaky) | 3 | 2 | 6 | Esperas explícitas e seletores estáveis |
| R05 | Falta de evidências de execução real | 2 | 3 | 6 | Salvar prints e logs em `evidencias/` |
| R06 | Cálculo errado de total no checkout (risco do produto) | 2 | 3 | 6 | Priorizar testes de carrinho e checkout |
| R07 | Ferramentas diferentes entre membros dificultarem o pipeline | 2 | 2 | 4 | Definir as ferramentas na primeira reunião e registrar versões |

---

## 5. Priorização

A prioridade combina a exposição ao risco com a importância da funcionalidade para o usuário e o negócio.

| Prioridade | Funcionalidades | Justificativa |
|------------|-----------------|---------------|
| **Alta** | F02 Login, F04 Carrinho, F05 Checkout | Formam o fluxo de compra, onde um erro causa mais prejuízo |
| **Média** | F01 Cadastro, F03 Catálogo e busca, API | Sustentam o fluxo principal, mas a falha tem contorno |
| **Baixa** | F06 Favoritos, F07 Contato | Funcionalidades de apoio |

Ordem de execução: alta, média, baixa. Se faltar tempo, o corte começa pela prioridade baixa e será registrado no relatório final.

---

## 6. Critérios de Entrada

Os testes só começam quando:

- [ ] O SUT está acessível e a versão foi registrada
- [ ] Todos os membros têm acesso ao repositório
- [ ] As ferramentas definidas na Seção 3 estão instaladas
- [ ] Os casos manuais de prioridade alta estão escritos
- [ ] Este plano foi aprovado pela equipe

---

## 7. Critérios de Saída

Os testes terminam quando:

- [ ] 100% dos casos de prioridade alta foram executados
- [ ] Pelo menos 90% dos demais casos foram executados
- [ ] Todos os defeitos estão registrados com severidade e prioridade
- [ ] Nenhum defeito crítico ficou sem registro
- [ ] A cobertura de código atingiu 70%, ou a diferença foi justificada
- [ ] A suíte automatizada roda no pipeline sem falhas inesperadas

---

## 8. Ambiente, Papéis e Cronograma

### 8.1 Ambiente

| Item | Detalhe |
|------|---------|
| Sistema operacional e navegador | Linux / Chromium Headless (Membro 3) e macOS (Membro 4) |
| Versões de Node.js / Python | Node.js v24.11.1 (`@playwright/test` 1.65.1) / Python 3.9.6 (`pytest`, `requests`, `pytest-cov`) |
| Repositório | https://github.com/cecifps/PracticeSoftwareTesting_2GQ |

### 8.2 Papéis

| Membro | Nome | Papel |
|:------:|------|-------|
| 1 | Cecília Galindo | Liderança de Qualidade e Planejamento |
| 2 | Matheus Marques | Testes Manuais e Exploratórios |
| 3 | [PREENCHER] | Automação Frontend/UI |
| 4 | Daniel Barros | Automação Backend/API |
| 5 | [PREENCHER] | Qualidade de Código e Defeitos |
| 6 | [PREENCHER] | DevOps e CI/CD |

### 8.3 Cronograma (sugestão, a equipe confirma)

| Período | Atividade |
|---------|-----------|
| 16/11 a 18/11 | Plano de testes, ferramentas e estrutura do repositório |
| 17/11 a 20/11 | Casos manuais, scripts de UI e API, pipeline inicial |
| 19/11 a 21/11 | Execução, bugs, métricas e code smells |
| 21/11 a 22/11 | Conclusões e revisão cruzada |
| 22/11 | Consolidação do PDF final (Membro 1) |
| **23/11** | **Entrega no Teams** |
| **26/11** | **Apresentação** |

---

## 9. Evidências

Prints, logs e relatórios ficam na pasta `evidencias/` e são listados aqui conforme forem sendo anexados.

| ID | Descrição | Arquivo |
|----|-----------|---------|
| EV-001 | Print do site com URL e data de acesso | `evidencias/ev-001-site.png` (a anexar) |
| EV-002 | Print da documentação Swagger da API | `evidencias/ev-002-swagger.png` (a anexar) |
| API-001 | Print da execução e cobertura da rota de produtos (`/products`) | `evidencias/API-001-cobertura-produtos.png` |
| API-002 | Print da execução e cobertura do teste de login inválido (`/users/login`) | `evidencias/API-002-cobertura-login.png` |
| API-003 | Print da cobertura incluindo criação de carrinho (`/carts`) | `evidencias/API-003-cobertura-final.png` |
| API-004 | Print da execução do teste com Mock/Stub simulando erro 500 | `evidencias/API-004-mock-stub.png` |
| API-005 | Print da cobertura final (100% em 6 testes, incluindo `DELETE` 404) | `evidencias/API-005-cobertura-crud.png` |
| UI-001 | Print da execução E2E de login válido (`CT-UI-01`) | `evidencias/UI-001-login-valido.png` |
| UI-002 | Print da validação de erro visual para login inválido (`CT-UI-02`) | `evidencias/UI-002-login-invalido.png` |
| UI-003 | Print da filtragem de produtos por categoria no catálogo (`CT-UI-04`) | `evidencias/UI-003-filtro-categoria.png` |
| UI-004 | Print da conclusão do Checkout - Happy Path (`CT-UI-05`) | `evidencias/UI-004-checkout-happy-path.png` |
| UI-005 | Print do teste de integração de UI com Mock/Stub de rede (`CT-UI-07`) | `evidencias/UI-005-mock-rede-ui.png` |
