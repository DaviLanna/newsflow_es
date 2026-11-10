// US01 — Salvar rascunho automaticamente (RN01)
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que existe a edição {string} em rascunho', function (titulo) {
  this.edicao = this.servico.criarEdicao(titulo, this.servico.usuario.nome)
})

Given('que escrevi {string} na edição', function (texto) {
  this.servico.escrever(this.edicao, texto)
})

Given('que a edição tem {int} versões salvas', function (quantidade) {
  for (let i = 1; i <= quantidade; i++) {
    this.servico.escrever(this.edicao, `Texto da versão ${i}`)
    this.avancarSegundos(30)
  }
})

When('espero {int} segundos sem digitar', function (segundos) {
  this.avancarSegundos(segundos)
})

When('restauro a versão {int}', function (numero) {
  this.resultado = this.servico.restaurarVersao(this.edicao, numero)
})

Then('a quantidade de versões salvas deve ser {int}', function (quantidade) {
  assert.equal(this.edicao.versoes.length, quantidade)
})

Then('a versão mais antiga disponível deve ser a {int}', function (numero) {
  assert.equal(this.edicao.versoes[0].numero, numero)
})

Then('a versão {int} deve continuar disponível', function (numero) {
  assert.ok(this.edicao.versoes.some(v => v.numero === numero), `A versão ${numero} sumiu do histórico`)
})

Then('o conteúdo da edição deve ser {string}', function (texto) {
  assert.equal(this.edicao.conteudo, texto)
})
