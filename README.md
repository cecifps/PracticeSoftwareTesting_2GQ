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
| 3 | Maxwelber Mariano | 856308 | Automação Frontend/UI |
| 4 | Daniel Barros | 856198 | Automação Backend/API |
| 5 | Lucas Sebasitão | 29989 | Qualidade de Código e Defeitos |
| 6 | Guilherme Valadares | 857082 | DevOps e CI/CD |

## Responsabilidades e foco prático

### Membro 1: Liderança de Qualidade e Planejamento
- **Responsabilidade:** definir a estratégia de V&V, o escopo da cobertura, a análise de riscos e os critérios de entrada e saída.
- **Foco prático:** estruturar a base do projeto, garantir que o planejamento converse com a execução dos outros membros e consolidar o arquivo PDF final.

### Membro 2: Testes Manuais e Exploratórios**
- **Responsabilidade:** estruturar e executar casos de testes manuais, verificando as principais funcionalidades do sistema e validando os resultados obtidos.
- **Foco prático:** criar casos de testes para cadastro, login, catálogo, carrinho e checkout. Realizar sessões de testes exploratórios, registrar comportamentos inesperados e documentar evidências das execuções.

### Membro 3: Automação Frontend/UI
- **Responsabilidade:** Desenvolver a suíte de testes automatizados de interface (E2E e regressão) e testes de integração de UI com *mock/stub* de rede utilizando Playwright com TypeScript e o padrão Page Object Model (POM).
- **Foco prático:** Automatizar as jornadas críticas do sistema (autenticação, busca/filtros, carrinho e checkout), validar o tratamento visual de falhas da API (erro 500 e lista vazia) e gerar relatórios HTML, *traces* e *screenshots* para as evidências de execução real.

### Membro 4: Automação Backend/API
- **Responsabilidade:** Criar os testes de API (rotas de produtos, login, carrinho e exclusão) e implementação de *mock/stub* utilizando Python com `pytest`, `requests` e `unittest.mock`, além de estruturar a suíte de automação de testes do back-end.
- **Foco prático:** Extrair as métricas de cobertura de código (100% atingido via pytest-cov) para a documentação final e fornecer esses dados estruturados para a pessoa responsavel pela etapa seguinte realizar a análise de qualidade.

### Membro 5: Qualidade de Código e Defeitos
- **Responsabilidade:** Analisar a qualidade do código, identificar code smells, avaliar métricas de complexidade e documentar defeitos encontrados durante os testes.
- **Foco prático:** Executar a análise de complexidade ciclomática com Radon, registrar oportunidades de refatoração, classificar bugs por severidade e prioridade e documentar evidências e propostas de melhoria.

### Membro 6: DevOps e CI/CD
- **Responsabilidade:** Configurar o pipeline de integração contínua, automatizando o build, execução de testes e quality gates básicos.
- **Foco prático:** Criar a proposta detalhada do CI/CD, realizar a análise de impactos de mudanças e consolidar a documentação de CI/CD com apêndices e conclusões. 
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
  unit/
testes_api/
  test_produtos.py
  test_login.py
  test_carrinho.py
  test_mock.py
  test_delete.py
evidencias/
.github/workflows/
```

## Como rodar os testes

### Testes de API e Cobertura (Membro 4)
Pré-requisitos: **Python 3.9+**

```bash
# Criar e ativar o ambiente virtual
python3 -m venv .venv
source .venv/bin/activate

# Instalar as dependências
pip install pytest requests pytest-cov

# Executar os testes de API com relatório de cobertura
pytest --cov=testes_api
```

### Testes de UI E2E e Integração com Mock (Membro 3)
Pré-requisitos: **Node.js 18+**

```bash
# Instalar as dependências do projeto e o navegador Chromium
npm install
npx playwright install chromium

# Executar toda a suíte de UI em modo headless
npx playwright test

# Visualizar o relatório HTML gerado com screenshots e traces
npx playwright show-report playwright-report
```

[PREENCHER pelo Membro 6: instruções de pipeline]

## Documentos

| Documento | Responsável | Arquivo |
|-----------|-------------|---------|
| Plano de Testes | Membro 1 | [docs/plano-de-testes.md](docs/plano-de-testes.md) |
| Casos Manuais | Membro 2 | [docs/casos-manuais.md](docs/casos-manuais.md) |
| Sessões Exploratórias | Membro 2 | [docs/sessoes-exploratorias/](docs/sessoes-exploratorias/) |
| Testes de UI | Membro 3 | [tests/ui/](tests/ui/) |
| Testes de API e Cobertura | Membro 4 | [testes_api/](testes_api/) |
| Relatório de Bugs | Membro 5 | [docs/relatorio-bugs.md](docs/relatorio-bugs.md) |
| Análise de Qualidade | Membro 5 | [docs/analise-qualidade.md](docs/analise-qualidade.md) |
| CI/CD | Membro 6 | [docs/ci-cd.md](docs/ci-cd.md) |
| Evidências | Todos | [evidencias/](evidencias/) |

## Convenção de commits

- `docs:` documentação
- `test:` testes
- `ci:` pipeline
- `fix:` correções
