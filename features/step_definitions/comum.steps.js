// Passos usados por mais de uma funcionalidade.
const { Given, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que estou autenticado/autenticada como {papel} {string}', function (papel, nome) {
  this.servico.autenticar(nome, papel)
})

Given('que agora é {string}', function (dataHora) {
  this.servico.definirAgora(dataHora)
})

Then('devo ver a mensagem {string}', function (esperada) {
  assert.ok(this.resultado, 'Nenhuma ação foi executada neste cenário')
  assert.equal(this.resultado.mensagem, esperada)
})

Then('a edição deve estar {string}', function (status) {
  assert.equal(this.edicao.status, status)
})
