# language: pt
Funcionalidade: Salvar rascunho automaticamente
  Como redatora
  Quero que meu texto seja salvo enquanto escrevo
  Para não perder trabalho quando a conexão cair

  Contexto:
    Dado que estou autenticada como redatora "Ana"
    E que existe a edição "Informativo #42" em rascunho

  @feliz @smoke
  Cenário: Texto é salvo depois de 30 segundos sem digitar
    Dado que escrevi "Novidades de novembro" na edição
    Quando espero 30 segundos sem digitar
    Então a quantidade de versões salvas deve ser 1
    E o conteúdo da edição deve ser "Novidades de novembro"

  @limite
  Esquema do Cenário: Intervalo de inatividade para o salvamento automático
    Dado que escrevi "Novidades de novembro" na edição
    Quando espero <segundos> segundos sem digitar
    Então a quantidade de versões salvas deve ser <versoes>

    Exemplos:
      | segundos | versoes |
      | 29       | 0       |
      | 30       | 1       |
      | 90       | 1       |

  @limite
  Cenário: Apenas as últimas 20 versões ficam no histórico
    Dado que a edição tem 20 versões salvas
    E que escrevi "Parágrafo novo" na edição
    Quando espero 30 segundos sem digitar
    Então a quantidade de versões salvas deve ser 20
    E a versão mais antiga disponível deve ser a 2

  @feliz
  Cenário: Restaurar uma versão sem apagar as seguintes
    Dado que a edição tem 5 versões salvas
    Quando restauro a versão 2
    Então o conteúdo da edição deve ser "Texto da versão 2"
    E a versão 5 deve continuar disponível

  @excecao
  Cenário: Versão que saiu do histórico não pode ser restaurada
    Dado que a edição tem 25 versões salvas
    Quando restauro a versão 3
    Então devo ver a mensagem "Esta versão não está mais disponível"
    E o conteúdo da edição deve ser "Texto da versão 25"
