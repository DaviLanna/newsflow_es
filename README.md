# NewsFlow · BDD com Cucumber.js

Quatro histórias de usuário do NewsFlow, os cenários em Gherkin que as comprovam e a suíte Cucumber.js que os executa sobre um domínio em memória.

## Como rodar

```bash
npm install
npm test            # executa a suíte e gera relatorios/cucumber-report.html
npm run test:dry    # valida sintaxe e confere se todo passo tem implementação
npm run test:smoke  # só os cenários @smoke
```

Requer Node.js 18 ou superior.

## O que está aqui

| Caminho | Conteúdo |
|---|---|
| `docs/historias.md` | US01–US04 com critérios de aceitação, RNs e prioridade |
| `features/*.feature` | Um arquivo por história, todos em `# language: pt` |
| `features/step_definitions/` | Steps por história + `comum.steps.js` com os passos compartilhados |
| `features/support/dominio.js` | Regras do NewsFlow em memória, com relógio simulado |
| `features/support/world.js` | World recriado a cada cenário e o tipo de parâmetro `{papel}` |
| `relatorios/` | Relatório HTML gerado pelo `npm test` |

## Rastreabilidade

| História | Regra | Arquivo | Cenários (com exemplos) |
|---|---|---|---|
| US01 Salvar rascunho automaticamente | RN01 | `us01-rascunho.feature` | 7 |
| US02 Aprovar edição antes do envio | RN02 | `us02-aprovacao.feature` | 5 |
| US03 Agendar envio de newsletter | RN03 | `us03-agendamento.feature` | 12 |
| US04 Respeitar o limite semanal | RN05 | `us04-frequencia.feature` | 5 |

Os Esquemas do Cenário testam cada fronteira no valor exato e nos vizinhos: 29/30 segundos (rascunho), 14/15/16 minutos (antecedência), 0/1/2 reagendamentos, 4/5/6 minutos (cancelamento) e 0/1/2 newsletters na semana.

Tags: `@feliz`, `@excecao`, `@alternativo`, `@limite` e `@smoke`.

## Fora de escopo

- **RN04 Segmentação**: a deduplicação entre segmentos depende de uma base de assinantes com interseções. Ficou fora para concentrar o agendamento nas fronteiras de tempo da RN03.
- **RN06 Descadastro**: o duplo opt-in de 48 horas é uma história própria do assinante. Entre as duas histórias do assinante, o limite de frequência (RN05) protege mais a lista no dia a dia.
- **RN07 Falha de entrega**: o ator é a Operação e o comportamento depende de respostas do provedor de e-mail (hard e soft bounce), que não existem num domínio em memória.
- **RN08 Notificação push**: é outro canal, com regras próprias (janela das 22h às 8h e 3 por dia). Num recorte de quatro histórias, ficou atrás das regras do e-mail.

## Decisões de implementação

- **Relógio simulado.** O tempo só anda quando um passo manda (`espero 30 segundos sem digitar`, `faltam 5 minutos`). Não há `sleep` nem dependência da data real, e o cenário roda igual em qualquer dia.
- **Fuso.** Datas são lidas e exibidas em America/Sao_Paulo. O domínio usa UTC-3 fixo, válido desde o fim do horário de verão em 2019.
- **Steps reutilizáveis.** `devo ver a mensagem {string}`, `a edição deve estar {string}`, `que agora é {string}` e a autenticação servem a mais de uma funcionalidade. `agendo o envio para daqui a {int} minutos` é usado em US02 e US03.
- **Plural nos Esquemas.** A expressão `vez(es)` do Cucumber casa com "vez" ou "vezes", não com o texto literal "vez(es)". Por isso as tabelas trazem a palavra junto do número ("1 vez", "2 vezes") e os steps usam `vez/vezes` e `newsletter(s)`.
- **Fluxo real nos pré-requisitos.** "Existe a edição aprovada" passa pela escrita, pela revisão e pela aprovação de outra pessoa, em vez de forçar o status.

## Saída do `npm test`

<!-- Cole aqui a saída do npm test depois de rodar na máquina de vocês. -->

```
(colar a saída aqui)
```
