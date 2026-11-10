# language: pt
Funcionalidade: Aprovar edição antes do envio
  Como revisor
  Quero aprovar uma edição ou devolvê-la ao rascunho com um comentário
  Para que nenhuma edição chegue aos assinantes sem uma segunda leitura

  Contexto:
    Dado que a redatora "Ana" enviou a edição "Informativo #42" para revisão

  @feliz @smoke
  Cenário: Revisor aprova a edição de outra pessoa
    Dado que estou autenticado como revisor "Bruno"
    Quando aprovo a edição
    Então a edição deve estar "aprovada"
    E devo ver a mensagem "Edição aprovada"

  @excecao
  Cenário: Autora não pode aprovar a própria edição
    Dado que estou autenticada como revisora "Ana"
    Quando aprovo a edição
    Então devo ver a mensagem "O autor não pode aprovar a própria edição"
    E a edição deve estar "em revisão"

  @alternativo
  Cenário: Reprovação devolve a edição ao rascunho com comentário
    Dado que estou autenticado como revisor "Bruno"
    Quando reprovo a edição com o comentário "Corrigir a data do evento no segundo parágrafo"
    Então a edição deve estar "rascunho"
    E a edição deve ter o comentário "Corrigir a data do evento no segundo parágrafo"

  @excecao
  Cenário: Reprovação sem comentário é recusada
    Dado que estou autenticado como revisor "Bruno"
    Quando reprovo a edição sem comentário
    Então devo ver a mensagem "A reprovação exige um comentário"
    E a edição deve estar "em revisão"

  @excecao
  Cenário: Edição não aprovada não pode ser agendada
    Dado que estou autenticada como gestora "Carla"
    Quando agendo o envio para daqui a 30 minutos
    Então devo ver a mensagem "A edição precisa ser aprovada antes do envio"
    E a edição deve estar "em revisão"
