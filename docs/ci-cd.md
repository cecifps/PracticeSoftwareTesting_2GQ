# Documentação de DevOps e CI/CD — Practice Software Testing

## 1. Proposta Detalhada do CI/CD
Para automatizar a verificação do código e garantir a estabilidade do sistema Practice Software Testing, foi configurado um pipeline de Integração Contínua (CI) através do **GitHub Actions**. A infraestrutura foi estabelecida em um ambiente `ubuntu-latest` para isolar a execução.

**Configurações do Ambiente:**
- **Linguagem Base:** Python 3.12
- **Dependências:** `pytest`, `requests` e `pytest-cov`
- **Gatilhos de Execução:** O fluxo é acionado automaticamente a cada `push` ou `pull_request` enviado para a branch `main`.

## 2. Análise de Impactos de Mudanças
A implementação desse fluxo atuou como uma barreira de qualidade para o repositório, trazendo duas melhorias práticas para o desenvolvimento do grupo:
- **Interceptação de erros:** Qualquer falha de ambiente ou de teste de API é detectada imediatamente no push, impedindo que problemas entrem na branch principal de forma silenciosa.
- **Padronização:** A validação em nuvem eliminou diferenças de configuração local entre os membros da equipe, garantindo que a suíte de testes fosse validada sempre sob as mesmas condições.

## 3. Conclusão
A infraestrutura de CI/CD forneceu a base necessária para a execução contínua da suíte de testes. Durante a configuração prática, o pipeline demonstrou sua utilidade ao identificar uma incompatibilidade do ambiente inicial. Após o diagnóstico e a atualização do workflow para o Python 3.12, o fluxo executou integralmente com sucesso, validando os testes de API e gerando o relatório de cobertura de forma automática a cada integração.

## 4. Apêndices (Evidências)
- **Apêndice A:** Código-fonte do arquivo de configuração (`.github/workflows/pipeline.yml`).
- **Apêndice B:** Capturas de tela do GitHub Actions na pasta `evidencias/` demonstrando a execução do pipeline com sucesso e o histórico de correção do ambiente.