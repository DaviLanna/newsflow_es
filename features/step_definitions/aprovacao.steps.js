// US02 — Aprovar edição antes do envio (RN02)
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que a redatora {string} enviou a edição {string} para revisão', function (autora, titulo) {
  this.servico.autenticar(autora, 'redator')
  this.edicao = this.servico.criarEdicao(titulo, autora)
  this.servico.enviarParaRevisao(this.edicao)
})

When('aprovo a edição', function () {
  this.resultado = this.servico.aprovar(this.edicao)
})

When('reprovo a edição com o comentário {string}', function (comentario) {
  this.resultado = this.servico.reprovar(this.edicao, comentario)
})

When('reprovo a edição sem comentário', function () {
  this.resultado = this.servico.reprovar(this.edicao, '')
})

Then('a edição deve ter o comentário {string}', function (texto) {
  assert.ok(this.edicao.comentarios.some(c => c.texto === texto), `Comentário não encontrado: "${texto}"`)
})
