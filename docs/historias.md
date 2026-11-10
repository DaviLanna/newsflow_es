# Histórias de usuário — NewsFlow

Quatro histórias, recortadas por fatia vertical. Cada uma aponta para as regras de negócio (RN) que cobre e para o arquivo `.feature` que a comprova.

| ID | Título | Ator | RN | Prioridade |
|---|---|---|---|---|
| US01 | Salvar rascunho automaticamente | Redatora | RN01 | Alta |
| US02 | Aprovar edição antes do envio | Revisor | RN02 | Alta |
| US03 | Agendar envio de newsletter | Gestora | RN03 | Alta |
| US04 | Respeitar o limite semanal de newsletters | Assinante | RN05 | Média |

---

## US01 — Salvar rascunho automaticamente

**Como** redatora
**Quero** que meu texto seja salvo enquanto escrevo
**Para** não perder trabalho quando a conexão cair

**Critérios de aceitação**
- O rascunho é salvo depois de 30 segundos sem digitação; antes disso, nada é salvo.
- Cada salvamento cria uma versão numerada; sem alteração no texto, não há versão nova.
- Apenas as últimas 20 versões ficam disponíveis; a mais antiga sai quando entra a 21ª.
- Restaurar uma versão traz o conteúdo dela de volta sem apagar as versões seguintes.
- Uma versão que já saiu do histórico não pode ser restaurada.

**Regras cobertas:** RN01
**Prioridade:** Alta — perda de conteúdo é a reclamação número um dos redatores.
**Cenários:** `features/us01-rascunho.feature`

---

## US02 — Aprovar edição antes do envio

**Como** revisor
**Quero** aprovar uma edição ou devolvê-la ao rascunho com um comentário
**Para** que nenhuma edição chegue aos assinantes sem uma segunda leitura

**Critérios de aceitação**
- Um revisor aprova uma edição em revisão escrita por outra pessoa.
- O autor não aprova a própria edição, mesmo que também tenha o papel de revisor.
- A reprovação devolve a edição ao rascunho e registra o comentário do revisor.
- A reprovação sem comentário é recusada e a edição continua em revisão.
- Uma edição que não foi aprovada não pode ser agendada.

**Regras cobertas:** RN02
**Prioridade:** Alta — é a trava que impede um erro de chegar a 40 mil pessoas; sem ela, o agendamento (US03) não é seguro.
**Cenários:** `features/us02-aprovacao.feature`

---

## US03 — Agendar envio de newsletter

**Como** gestora de comunicação
**Quero** agendar, reagendar e cancelar o envio de uma edição aprovada
**Para** que ela chegue no melhor horário sem eu precisar apertar o botão na hora

**Critérios de aceitação**
- O envio só pode ser agendado com pelo menos 15 minutos de antecedência, no horário de Brasília.
- Um envio agendado pode ser reagendado no máximo 2 vezes.
- O cancelamento é aceito até 5 minutos antes do horário marcado, inclusive.
- O horário agendado é exibido no fuso America/Sao_Paulo.

**Regras cobertas:** RN03 (a exigência de aprovação, RN02, está coberta em US02)
**Prioridade:** Alta — é a ação central da gestora e a regra com mais fronteiras numéricas.
**Cenários:** `features/us03-agendamento.feature`

---

## US04 — Respeitar o limite semanal de newsletters

**Como** assinante
**Quero** receber no máximo 2 newsletters por semana
**Para** não me sentir bombardeada e não precisar sair da lista

**Critérios de aceitação**
- As duas primeiras newsletters da semana são entregues normalmente.
- A partir da terceira, a newsletter vai para a fila da semana seguinte.
- E-mails transacionais (confirmação de cadastro, recibo) são entregues sempre e não contam para o limite.
- Quando a semana seguinte começa, a fila é entregue e passa a contar para o limite da nova semana.

**Regras cobertas:** RN05
**Prioridade:** Média — protege a lista de descadastros em massa, mas o produto funciona sem ela no curto prazo.
**Cenários:** `features/us04-frequencia.feature`
