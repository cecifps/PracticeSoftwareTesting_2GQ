# Análise de Qualidade de Código — Eixo 4

## 1. Objetivo

Avaliar a qualidade do código dos testes automatizados do projeto Practice Software Testing, identificando problemas de manutenção, duplicação de código, fragilidades nas validações e oportunidades de refatoração.

## 2. Metodologia

A análise foi realizada por meio de inspeção dos arquivos Python e TypeScript, execução dos testes automatizados com pytest e Playwright e investigação dos erros apresentados.

## 3. Resultados da execução

| Indicador | Resultado |
|---|---|
| Testes de API | 6 aprovados de 6 |
| Testes de interface — 8 workers | 1 aprovado e 8 falhas |
| Testes de interface — 1 worker | 8 aprovados e 1 falha |
| Teste que permaneceu falhando | CT-UI-03 |
| Tempo da execução de API | 3,78 segundos |

A diferença entre as execuções paralela e sequencial indica possível instabilidade relacionada à concorrência ou à sobrecarga do ambiente. A causa ainda precisa ser investigada.

## 4. Problemas de qualidade identificados

### Q01 — Validação limitada no teste com mock

**Arquivo:** `testes_api/test_mock.py`

O teste configura uma resposta HTTP 500 e verifica apenas se o código retornado corresponde ao valor configurado.

**Impacto:** não verifica o tratamento do erro pela aplicação.

**Melhoria proposta:** validar o comportamento da aplicação diante da falha simulada.

### Q02 — Duplicação de configuração

**Arquivos:** `testes_api/*.py`

A constante `BASE_URL` aparece repetida nos cinco arquivos de testes de API.

**Impacto:** mudanças no endereço da API exigem alterações em vários arquivos.

**Melhoria proposta:** centralizar a URL em uma configuração compartilhada.

### Q03 — Ausência de timeout nas requisições

**Arquivos:** testes Python que utilizam `requests`.

As requisições HTTP não possuem timeout explícito.

**Impacto:** os testes podem permanecer aguardando respostas por tempo indeterminado.

**Melhoria proposta:** definir limites de tempo para as requisições.

### Q04 — Mistura de responsabilidades

**Arquivo:** `tests/ui/pages/RegisterPage.ts`

O método `criarUsuarioNovo()` implementa cadastro pela API e pela interface.

**Impacto:** aumenta a complexidade e dificulta a manutenção.

**Melhoria proposta:** separar os fluxos em métodos específicos, preservando o comportamento atual.

### Q05 — Validação possivelmente restritiva na busca

**Arquivo:** `tests/ui/pages/HomePage.ts`

O método `assertProductsMatchTerm()` exige que todos os nomes de produtos contenham o termo pesquisado.

Na execução do CT-UI-03, a busca por `Pliers` apresentou também `Bolt Cutters`, provocando falha.

**Impacto:** possibilidade de falso positivo na detecção de defeitos.

**Melhoria proposta:** confirmar os critérios de busca da aplicação e adequar as verificações do teste.

## 5. Conclusão preliminar

A suíte de testes possui organização em arquivos e utiliza ferramentas adequadas de automação. Entretanto, foram identificadas oportunidades de melhoria relacionadas à reutilização de código, robustez das requisições e precisão das validações.

Os problemas descritos representam achados de qualidade de código e não devem ser confundidos com defeitos funcionais confirmados da aplicação.
## 6. Métricas de complexidade ciclomática

A complexidade ciclomática dos testes Python foi analisada utilizando a ferramenta Radon 6.0.1.

**Comando utilizado:** `python -m radon cc testes_api -s -a`

**Resultados:**
- Funções analisadas: 6.
- Complexidade média: 2,5.
- Classificação geral: A (baixa complexidade).
- Todas as funções receberam classificação A.

Os resultados indicam baixa complexidade estrutural dos testes de API, favorecendo a compreensão e manutenção do código. Entretanto, essa métrica não avalia diretamente a cobertura dos testes nem a existência de defeitos funcionais.