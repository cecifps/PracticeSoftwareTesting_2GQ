# Relatório de Testes e Qualidade de Software

Projeto Final da disciplina: Teste e Qualidade de Software 
Professora: Monique Soares

Entrega: 23/11/2026 | Apresentação: 26/11/2026

## Sistema sob Teste (SUT)

Opção 1: Practice Software Testing (https://practicesoftwaretesting.com)
Frontend Angular com API REST documentada (Swagger).

## Equipe

| Nº | Nome completo | Matrícula | Papel |
|----|---------------|-----------|-------|
| 1 | Cecília Galindo | 855867 | Liderança de Qualidade e Planejamento |
| 2 | Matheus Marques | 857487 | Testes Manuais e Exploratórios |
| 3 | [PREENCHER] | [PREENCHER] | Automação Frontend/UI |
| 4 | Daniel Barros | 856198 | Automação Backend/API |
| 5 | [PREENCHER] | [PREENCHER] | Qualidade de Código e Defeitos |
| 6 | [PREENCHER] | [PREENCHER] | DevOps e CI/CD |

## Responsabilidades e foco prático

### Membro 1: Liderança de Qualidade e Planejamento
- **Responsabilidade:** definir a estratégia de V&V, o escopo da cobertura, a análise de riscos e os critérios de entrada e saída.
- **Foco prático:** estruturar a base do projeto, garantir que o planejamento converse com a execução dos outros membros e consolidar o arquivo PDF final.

### Membro 2: Testes Manuais e Exploratórios**
- **Responsabilidade:** estruturar e executar casos de testes manuais, verificando as principais funcionalidades do sistema e validando os resultados obtidos.
- **Foco prático:** criar casos de testes para cadastro, login, catálogo, carrinho e checkout. Realizar sessões de testes exploratórios, registrar comportamentos inesperados e documentar evidências das execuções.

### Membro 3: Automação Frontend/UI
- **Responsabilidade:** [o Membro 3 preenche]
- **Foco prático:** [o Membro 3 preenche]

### Membro 4: Automação Backend/API
- **Responsabilidade:** desenvolver e executar os testes automatizados de API REST (validação de contrato, códigos de status HTTP, payloads e regras de negócio), construir testes de unidade isolados e implementar dublês de teste (*mocks* e *stubs*).
- **Foco prático:** automatizar os testes dos endpoints da API do *Practice Software Testing* (autenticação, catálogo/busca/filtros, carrinho, checkout/pagamento, favoritos e mensagens), implementar testes unitários das regras de negócio com *mocks/stubs* via Jest, e extrair métricas e relatórios reais de cobertura de código para compor as evidências e apoiar os Eixos 4, 5 e 6.

### Membro 5: Qualidade de Código e Defeitos
- **Responsabilidade:** [o Membro 5 preenche]
- **Foco prático:** [o Membro 5 preenche]

### Membro 6: DevOps e CI/CD
- **Responsabilidade:** [o Membro 6 preenche]
- **Foco prático:** [o Membro 6 preenche]
## Estrutura do repositório

```
README.md
docs/
  plano-de-testes.md
  casos-manuais.md
  sessoes-exploratorias/
  relatorio-bugs.md
  analise-qualidade.md
  ci-cd.md
tests/
  ui/
  api/
  unit/
evidencias/
.github/workflows/
```

## Como rodar os testes

### Pré-requisitos
- **Node.js** (v18+ ou v20+) e **npm**

### Instalação
```bash
npm install
```

### Comandos de Execução (Membro 4 — API, Unidade, Mocks e Cobertura)
```bash
# Rodar os testes de unidade (com Mocks e Stubs)
npm run test:unit

# Rodar os testes de integração/contrato da API REST real (Swagger)
npm run test:api

# Rodar toda a suíte do Membro 4 (Unidade + API) com relatório de Cobertura de Código
npm run test:coverage
```

*(Instruções de UI e Pipeline serão complementadas pelos Membros 3 e 6)*

## Documentos

| Documento | Responsável | Arquivo |
|-----------|-------------|---------|
| Plano de Testes | Membro 1 | [docs/plano-de-testes.md](docs/plano-de-testes.md) |
| Casos Manuais | Membro 2 | [docs/casos-manuais.md](docs/casos-manuais.md) |
| Sessões Exploratórias | Membro 2 | [docs/sessoes-exploratorias/](docs/sessoes-exploratorias/) |
| Testes de UI | Membro 3 | [tests/ui/](tests/ui/) |
| Testes de API, Unidade e Cobertura | Membro 4 | [docs/testes-api-e-cobertura.md](docs/testes-api-e-cobertura.md), [tests/api/](tests/api/) e [tests/unit/](tests/unit/) |
| Relatório de Bugs | Membro 5 | [docs/relatorio-bugs.md](docs/relatorio-bugs.md) |
| Análise de Qualidade | Membro 5 | [docs/analise-qualidade.md](docs/analise-qualidade.md) |
| CI/CD | Membro 6 | [docs/ci-cd.md](docs/ci-cd.md) |
| Evidências | Todos | [evidencias/](evidencias/) |

## Convenção de commits

- `docs:` documentação
- `test:` testes
- `ci:` pipeline
- `fix:` correções
