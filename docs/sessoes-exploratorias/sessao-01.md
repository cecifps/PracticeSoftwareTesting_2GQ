# Sessão de Teste Exploratório 01

## 1. Informações da sessão

- **Sistema:** Practice Software Testing
- **Responsável:** Membro 2
- **Tipo de teste:** Teste exploratório
- **Objetivo:** Explorar as funcionalidades do sistema e identificar possíveis comportamentos inesperados.

## 2. Áreas exploradas

- Cadastro e login de usuários.
- Pesquisa de produtos.
- Carrinho de compras.
- Processo de checkout.
- Lista de favoritos.
- Formulário de contato.

## 3. Atividades realizadas

Durante a exploração, foram realizadas navegações pelas principais áreas do sistema, verificando o funcionamento dos recursos e observando as mensagens apresentadas ao usuário.

Também foram testadas situações com informações incorretas e diferentes interações com os produtos.

## 4. Resultados observados

- O cadastro exige formatos específicos para telefone, e-mail e data de nascimento.
- O sistema rejeita senhas identificadas em vazamentos de dados.
- O login impede o acesso quando as credenciais estão incorretas.
- A pesquisa apresentou produtos relacionados ao termo informado.
- O carrinho permitiu adicionar e remover produtos.
- O checkout apresentou confirmação de pagamento.
- A funcionalidade de favoritos apresentou inicialmente uma mensagem de autorização negada, mas funcionou após uma nova tentativa.
- O formulário de contato apresentou confirmação após o envio.

## 5. Conclusão

A exploração permitiu observar o comportamento das principais funcionalidades do sistema. A maioria dos recursos funcionou conforme esperado, mas foram identificadas mensagens e comportamentos que merecem atenção durante os testes.

## 6. Teste adicional — Pesquisa sem resultados

- **Busca realizada:** produto_inexistente_999
- **Resultado obtido:** O sistema apresentou a mensagem "0 products found" e informou que não havia produtos encontrados.
- **Comportamento:** Conforme esperado.
- **Status:** Aprovado.

## 7. Teste adicional — Pesquisa vazia

- **Busca realizada:** Campo de pesquisa vazio.
- **Resultado obtido:** Ao pressionar Enter com o campo de pesquisa vazio, o sistema não apresentou nenhuma mudança visível.
- **Comportamento:** O sistema permaneceu na mesma tela.
- **Status:** Observação registrada.