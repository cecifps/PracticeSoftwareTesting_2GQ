# Casos de Testes Manuais — Practice Software Testing

**Disciplina:** Testes de Qualidade de Software  
**Responsável:** Matheus Marques  
**Sistema:** Practice Software Testing  
**Data de elaboração:** 16/11/2026

---

## 1. Objetivo

Este documento apresenta os casos de testes manuais que serão executados no sistema Practice Software Testing.

O objetivo é verificar se as principais funcionalidades funcionam corretamente, comparando os resultados obtidos com os resultados esperados.

Os testes serão realizados diretamente na interface do sistema, registrando possíveis falhas e evidências.

## 2. Ambiente de Teste

| Item | Descrição |
|---|---|
| Sistema | Practice Software Testing |
| URL | https://practicesoftwaretesting.com |
| Navegador | A preencher |
| Sistema operacional | A preencher |
| Responsável | Matheus Marques |

## 3. Casos de Teste

### CT-001 — Cadastro de usuário

**Prioridade:** Média

- Objetivo: Verificar se um novo usuário consegue realizar seu cadastro.
- Pré-condição: Acessar a página de cadastro.
- Passos:
  1. Abrir a página de cadastro.
  2. Preencher os campos obrigatórios.
  3. Informar os dados solicitados.
  4. Confirmar o cadastro.
- Resultado esperado: O sistema deve cadastrar o usuário e apresentar uma confirmação.

**Resultado obtido:** Após corrigir os formatos do telefone, e-mail e data de nascimento e utilizar uma nova senha, o cadastro foi realizado com sucesso. O sistema redirecionou o usuário para a página de login e permitiu entrar na conta criada.

**Status:** Aprovado.

**Observações da execução:**

- O campo de telefone aceita somente números.
- A data de nascimento exige o formato YYYY-MM-DD.
- O sistema valida o formato do e-mail.
- O sistema identifica senhas que apareceram em vazamentos de dados.

---

### CT-002 — Login com dados válidos

**Prioridade:** Alta

- Objetivo: Verificar se o usuário consegue acessar sua conta.
- Pré-condição: Possuir uma conta cadastrada.
- Passos:
  1. Abrir a página de login.
  2. Informar um e-mail cadastrado.
  3. Informar a senha correta.
  4. Clicar em Login.
- Resultado esperado: O sistema deve permitir o acesso à conta.

**Resultado obtido:** O usuário informou o e-mail e a senha cadastrados e conseguiu acessar sua conta com sucesso.

**Status:** Aprovado.

---

### CT-003 — Login com dados inválidos

**Prioridade:** Alta

- Objetivo: Verificar o comportamento do sistema com informações incorretas.
- Pré-condição: Estar na página de login.
- Passos:
  1. Informar um e-mail inválido ou não cadastrado.
  2. Informar uma senha incorreta.
  3. Clicar em Login.
- Resultado esperado: O sistema deve impedir o acesso e apresentar uma mensagem de erro.

**Resultado obtido:** Ao informar um e-mail não cadastrado e uma senha incorreta, o sistema impediu o acesso e apresentou a mensagem "Invalid email or password".

**Status:** Aprovado.

---

### CT-004 — Pesquisa de produtos

**Prioridade:** Média

- Objetivo: Verificar se a busca de produtos funciona corretamente.
- Pré-condição: Acessar o catálogo.
- Passos:
  1. Abrir a página inicial.
  2. Localizar o campo de pesquisa.
  3. Digitar o nome de um produto existente.
  4. Realizar a pesquisa.
- Resultado esperado: O sistema deve apresentar produtos relacionados à pesquisa.

**Resultado obtido:** Ao pesquisar por "Pliers", o sistema apresentou 4 produtos relacionados à busca.

**Status:** Aprovado.

---

### CT-005 — Adicionar produto ao carrinho

**Prioridade:** Alta

- Objetivo: Verificar se um produto pode ser adicionado ao carrinho.
- Pré-condição: Acessar o catálogo de produtos.
- Passos:
  1. Escolher um produto.
  2. Abrir os detalhes do produto.
  3. Clicar na opção de adicionar ao carrinho.
  4. Acessar o carrinho.
- Resultado esperado: O produto deve aparecer no carrinho com as informações corretas.

**Resultado obtido:** Ao clicar em "Add to cart", o sistema adicionou o produto ao carrinho e apresentou uma mensagem de confirmação em verde no canto superior direito.

**Status:** Aprovado.

---

### CT-006 — Remover produto do carrinho

**Prioridade:** Alta

- Objetivo: Verificar se o usuário consegue remover um produto do carrinho.
- Pré-condição: Possuir pelo menos um produto no carrinho.
- Passos:
  1. Acessar o carrinho.
  2. Localizar um produto.
  3. Clicar na opção de remover.
  4. Verificar o conteúdo do carrinho.
- Resultado esperado: O produto deve ser removido e o total deve ser atualizado.

**Resultado obtido:** Ao remover o produto, ele desapareceu da lista do carrinho e o sistema apresentou uma mensagem de confirmação em verde informando que o produto foi removido.

**Status:** Aprovado.

---

### CT-007 — Verificação do checkout

**Prioridade:** Alta

- Objetivo: Verificar se o sistema permite avançar no processo de checkout.
- Pré-condição: Possuir um produto no carrinho e estar autenticado, caso necessário.
- Passos:
  1. Acessar o carrinho.
  2. Iniciar o checkout.
  3. Preencher as informações solicitadas.
  4. Verificar as etapas de finalização.
- Resultado esperado: O sistema deve permitir avançar quando todas as informações obrigatórias estiverem corretas.
- Observação: Não realizar pagamentos reais.

**Resultado obtido:** O sistema solicitou novamente o login, o endereço e a forma de pagamento. Após selecionar pagamento em dinheiro físico e confirmar o pedido, apresentou a mensagem "Payment was successful".

**Status:** Aprovado.

---

### CT-008 — Adicionar produto aos favoritos

**Prioridade:** Baixa

- Objetivo: Verificar se o usuário consegue adicionar um produto aos favoritos.
- Pré-condição: Acessar o catálogo e realizar login, caso necessário.
- Passos:
  1. Escolher um produto.
  2. Localizar a opção de favoritos.
  3. Adicionar o produto aos favoritos.
  4. Verificar se ele foi salvo.
- Resultado esperado: O produto deve aparecer na lista de favoritos, caso essa funcionalidade esteja disponível.

**Resultado obtido:** Após confirmar que a conta estava logada, o produto foi adicionado aos favoritos com sucesso. O sistema apresentou uma mensagem de confirmação em verde no canto superior direito.

**Status:** Aprovado.

---

### CT-009 — Formulário de contato

**Prioridade:** Baixa

- Objetivo: Verificar o funcionamento do formulário de contato.
- Pré-condição: Acessar a página de contato.
- Passos:
  1. Abrir o formulário de contato.
  2. Preencher os campos obrigatórios.
  3. Enviar a mensagem.
  4. Verificar a resposta do sistema.
- Resultado esperado: O sistema deve aceitar os dados válidos e apresentar uma confirmação de envio.

**Resultado obtido:** Após preencher e enviar o formulário de contato, o sistema apresentou a mensagem "Thanks for your message! We will contact you shortly.", confirmando o recebimento da mensagem.

**Status:** Aprovado.
---

## 4. Resumo da Execução

| Situação | Quantidade |
|---|---:|
| Total de casos planejados | 9 |
| Aprovados | 0 |
| Reprovados | 0 |
| Não executados | 9 |

*Os resultados serão atualizados conforme os testes forem realizados.*

## 5. Considerações Finais

Os casos de testes foram definidos considerando as funcionalidades e prioridades estabelecidas no plano de testes.

Após a execução, os resultados serão registrados para identificar possíveis falhas e verificar se o sistema atende aos comportamentos esperados.