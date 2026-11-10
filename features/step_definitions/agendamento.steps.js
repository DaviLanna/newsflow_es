// US03 — Agendar envio de newsletter (RN03)
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')
const { MINUTO } = require('../support/dominio')

// Percorre o fluxo real: escrita, revisão e aprovação por outra pessoa.
Given('que existe a edição {string} aprovada', function (titulo) {
  this.servico.autenticar('Ana', 'redator')
  this.edicao = this.servico.criarEdicao(titulo, 'Ana')
  this.servico.enviarParaRevisao(this.edicao)
  this.servico.autenticar('Bruno', 'revisor')
  this.servico.aprovar(this.edicao)
})

Given('que o envio está agendado para daqui a {int} minutos', function (minutos) {
  const resultado = this.servico.agendar(this.edicao, minutos)
  assert.ok(resultado.ok, resultado.mensagem)
})

Given('que o envio já foi reagendado {int} vez/vezes', function (vezes) {
  assert.ok(this.servico.agendar(this.edicao, 30).ok)
  for (let i = 0; i < vezes; i++) {
    const resultado = this.servico.reagendar(this.edicao, 60)
    assert.ok(resultado.ok, resultado.mensagem)
  }
})

Given('que faltam {int} minutos para o horário marcado', function (minutos) {
  this.servico.avancarAte(this.edicao.disparo.horario - minutos * MINUTO)
})

When('agendo o envio para daqui a {int} minutos', function (minutos) {
  this.resultado = this.servico.agendar(this.edicao, minutos)
})

When('reagendo o envio para daqui a {int} minutos', function (minutos) {
  this.resultado = this.servico.reagendar(this.edicao, minutos)
})

When('cancelo o envio', function () {
  this.resultado = this.servico.cancelar(this.edicao)
})

Then('o disparo deve estar agendado para {string}', function (horario) {
  assert.equal(this.edicao.disparo?.status, 'agendado')
  assert.equal(this.servico.horarioAgendado(this.edicao), horario)
})
