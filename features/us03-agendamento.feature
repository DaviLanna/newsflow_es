# language: pt
Funcionalidade: Agendar envio de newsletter
  Como gestora de comunicação
  Quero agendar, reagendar e cancelar o envio de uma edição aprovada
  Para que ela chegue no melhor horário sem eu precisar apertar o botão na hora

  Contexto:
    Dado que agora é "10/11/2026 09:00"
    E que existe a edição "Informativo #42" aprovada
    E que estou autenticada como gestora "Carla"

  @feliz @smoke
  Cenário: Agendamento com antecedência suficiente
    Quando agendo o envio para daqui a 30 minutos
    Então o disparo deve estar agendado para "10/11/2026 às 09:30"
    E devo ver a mensagem "Envio agendado"

  @limite @excecao
  Esquema do Cenário: Antecedência mínima de 15 minutos
    Quando agendo o envio para daqui a <minutos> minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | minutos | mensagem                               |
      | 60      | Envio agendado                         |
      | 16      | Envio agendado                         |
      | 15      | Envio agendado                         |
      | 14      | O envio precisa de ao menos 15 minutos |
      | 0       | O envio precisa de ao menos 15 minutos |

  @limite @excecao
  Esquema do Cenário: No máximo 2 reagendamentos
    Dado que o envio já foi reagendado <reagendamentos>
    Quando reagendo o envio para daqui a 60 minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | reagendamentos | mensagem                             |
      | 0 vezes        | Envio reagendado                     |
      | 1 vez          | Envio reagendado                     |
      | 2 vezes        | Limite de 2 reagendamentos atingido  |

  @limite @excecao
  Esquema do Cenário: Cancelamento até 5 minutos antes do horário marcado
    Dado que o envio está agendado para daqui a 30 minutos
    E que faltam <minutos> minutos para o horário marcado
    Quando cancelo o envio
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | minutos | mensagem                                           |
      | 6       | Envio cancelado                                    |
      | 5       | Envio cancelado                                    |
      | 4       | O envio só pode ser cancelado até 5 minutos antes  |
