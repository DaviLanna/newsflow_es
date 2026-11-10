const { setWorldConstructor, defineParameterType } = require('@cucumber/cucumber')
const Servico = require('./dominio')

// {papel} aceita a forma masculina e a feminina e devolve o papel do sistema.
defineParameterType({
  name: 'papel',
  regexp: /redatora?|revisora?|gestora?/,
  transformer: texto => texto.replace(/a$/, '')
})

// Recriado antes de cada cenário: nenhum estado passa de um cenário para outro.
class MundoDoNewsFlow {
  constructor () {
    this.servico = new Servico()
    this.edicao = null
    this.resultado = null
  }

  avancarSegundos (segundos) {
    this.servico.avancarRelogio(segundos * 1000)
  }

  avancarMinutos (minutos) {
    this.servico.avancarRelogio(minutos * Servico.MINUTO)
  }
}

setWorldConstructor(MundoDoNewsFlow)
