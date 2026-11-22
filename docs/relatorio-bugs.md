# Relatório de Bugs e Defeitos — Eixo 5

## 1. Objetivo

Registrar e analisar as falhas identificadas durante a execução dos testes automatizados do projeto Practice Software Testing, considerando evidências, impacto, severidade, prioridade e possíveis correções.

## 2. Resumo das execuções

| Execução | Aprovados | Falhas |
|---|---:|---:|
| Testes de API — pytest | 6 | 0 |
| Testes de interface — 8 workers | 1 | 8 |
| Testes de interface — 1 worker | 8 | 1 |

A execução sequencial apresentou resultados significativamente melhores que a paralela, indicando possível instabilidade relacionada à concorrência, ao ambiente ou à execução simultânea dos testes.

## 3. Registro de ocorrências

### OC-01 — Falha na validação da pesquisa de produtos

**Teste:** CT-UI-03

**Funcionalidade:** Pesquisa no catálogo

**Arquivos relacionados:** `tests/ui/specs/catalog.spec.ts` e `tests/ui/pages/HomePage.ts`

**Passos para reprodução:**

1. Executar `npx.cmd playwright test --workers=1`.
2. Aguardar a execução do CT-UI-03.
3. Verificar os resultados da pesquisa por `Pliers`.

**Resultado esperado pelo teste:** todos os nomes dos produtos encontrados devem conter o termo `Pliers`.

**Resultado observado:** o sistema apresentou também o produto `Bolt Cutters`, provocando falha na validação.

**Severidade preliminar:** baixa, considerando que ainda não foi comprovado defeito funcional.

**Prioridade sugerida:** média.

**Situação:** em investigação.

**Possível causa:** incompatibilidade entre a regra de busca da aplicação e a expectativa implementada no teste.

**Proposta de correção:** verificar quais campos são considerados pela pesquisa e ajustar as verificações do teste conforme os requisitos reais da funcionalidade.

**Evidências:** captura de tela da pesquisa por `Pliers` e relatório de falha do Playwright.

### OC-02 — Instabilidade na execução paralela

**Funcionalidade afetada:** suíte automatizada de interface.

**Passos para reprodução:**

1. Executar `npx.cmd playwright test`.
2. Registrar os resultados com 8 workers.
3. Executar `npx.cmd playwright test --workers=1`.
4. Comparar os resultados.

**Resultado esperado:** execução estável dos testes, independentemente da concorrência suportada pelo ambiente.

**Resultado observado:** a execução com 8 workers apresentou 8 falhas; com 1 worker, apenas o CT-UI-03 falhou.

**Severidade preliminar:** média, considerando o impacto na confiabilidade da automação.

**Prioridade sugerida:** alta para investigação.

**Situação:** causa não confirmada.

**Possíveis causas:** sobrecarga do ambiente, interferência entre testes, dependência de estado compartilhado ou problemas de sincronização.

**Proposta de correção:** investigar os rastreamentos do Playwright, verificar o isolamento dos testes e avaliar a configuração de workers no pipeline de integração contínua.

**Evidências:** resultados das duas execuções do Playwright.

## 4. Rastreabilidade

| Ocorrência | Caso de teste | Evidência | Situação |
|---|---|---|---|
| OC-01 | CT-UI-03 | Screenshot e relatório Playwright | Em investigação |
| OC-02 | CT-UI-01 a CT-UI-09 | Logs das execuções | Em investigação |

## 5. Proposta de evolução

Recomenda-se aprimorar a validação da funcionalidade de pesquisa, considerando os critérios reais utilizados pelo sistema para selecionar produtos.

Também se recomenda melhorar a estabilidade da suíte automatizada, especialmente nas execuções paralelas, para reduzir falhas intermitentes e aumentar a confiabilidade dos resultados.

## 6. Conclusão

Foram registradas duas ocorrências relevantes durante a execução dos testes automatizados.

A primeira está relacionada à validação da pesquisa de produtos. A segunda envolve diferenças significativas entre as execuções paralela e sequencial.

Nenhuma das ocorrências foi classificada como bug funcional confirmado da aplicação, pois ainda é necessário investigar suas causas.

As evidências coletadas permitem orientar futuras correções e melhorias na qualidade dos testes.