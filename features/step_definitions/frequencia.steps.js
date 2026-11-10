// US04 — Respeitar o limite semanal de newsletters (RN05)
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que a assinante {string} está ativa na lista', function (nome) {
  this.servico.cadastrarAssinante(nome)
})

Given('que {string} já recebeu {int} newsletter(s) nesta semana', function (nome, quantidade) {
  for (let i = 1; i <= quantidade; i++) this.servico.processarNewsletter(`Edição anterior ${i}`)
  assert.equal(this.servico.newslettersRecebidasNaSemana(nome), quantidade)
})

Given('que {string} tem a newsletter {string} na fila da próxima semana', function (nome, titulo) {
  this.servico.processarNewsletter('Edição anterior 1')
  this.servico.processarNewsletter('Edição anterior 2')
  this.servico.processarNewsletter(titulo)
  assert.equal(this.servico.situacaoDoEmail(nome, titulo), 'na fila da próxima semana')
})

When('o disparo da newsletter {string} é processado', function (titulo) {
  this.servico.processarNewsletter(titulo)
})

When('o e-mail transacional {string} é disparado para {string}', function (titulo, nome) {
  this.servico.dispararTransacional(nome, titulo)
})

When('a semana seguinte começa', function () {
  this.servico.avancarAte(this.servico.inicioDaProximaSemana())
})

Then('o e-mail {string} para {string} deve estar {string}', function (titulo, nome, situacao) {
  assert.equal(this.servico.situacaoDoEmail(nome, titulo), situacao)
})

Then('{string} deve ter {int} newsletter(s) recebida(s) nesta semana', function (nome, quantidade) {
  assert.equal(this.servico.newslettersRecebidasNaSemana(nome), quantidade)
})
