# language: pt
Funcionalidade: Respeitar o limite semanal de newsletters
  Como assinante
  Quero receber no máximo 2 newsletters por semana
  Para não me sentir bombardeada e não precisar sair da lista

  Contexto:
    Dado que agora é "10/11/2026 09:00"
    E que a assinante "Duda" está ativa na lista

  @feliz @limite
  Esquema do Cenário: Limite de 2 newsletters por semana
    Dado que "Duda" já recebeu <recebidas> nesta semana
    Quando o disparo da newsletter "Informativo #43" é processado
    Então o e-mail "Informativo #43" para "Duda" deve estar "<situacao>"

    Exemplos:
      | recebidas     | situacao                  |
      | 0 newsletters | entregue                  |
      | 1 newsletter  | entregue                  |
      | 2 newsletters | na fila da próxima semana |

  @excecao
  Cenário: E-mail transacional não conta para o limite
    Dado que "Duda" já recebeu 2 newsletters nesta semana
    Quando o e-mail transacional "Confirmação de cadastro" é disparado para "Duda"
    Então o e-mail "Confirmação de cadastro" para "Duda" deve estar "entregue"
    E "Duda" deve ter 2 newsletters recebidas nesta semana

  @alternativo
  Cenário: Newsletter da fila é entregue quando a semana seguinte começa
    Dado que "Duda" tem a newsletter "Informativo #43" na fila da próxima semana
    Quando a semana seguinte começa
    Então o e-mail "Informativo #43" para "Duda" deve estar "entregue"
    E "Duda" deve ter 1 newsletter recebida nesta semana
