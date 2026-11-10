// Domínio do NewsFlow em memória, com relógio simulado.
// Nenhuma regra depende do relógio real: o tempo só anda quando um passo manda.

const SEGUNDO = 1000
const MINUTO = 60 * SEGUNDO
const HORA = 60 * MINUTO
const DIA = 24 * HORA

// Brasília (America/Sao_Paulo) está em UTC-3 fixo desde o fim do horário de verão, em 2019.
const FUSO = 'America/Sao_Paulo'
const DESLOCAMENTO_BRASILIA = -3 * HORA

// RN01
const INATIVIDADE_PARA_SALVAR = 30 * SEGUNDO
const MAX_VERSOES = 20
// RN03
const ANTECEDENCIA_MINIMA = 15 * MINUTO
const MAX_REAGENDAMENTOS = 2
const PRAZO_CANCELAMENTO = 5 * MINUTO
// RN05
const LIMITE_SEMANAL = 2

/** "10/11/2026 09:00" no horário de Brasília -> instante em milissegundos. */
function lerDataDeBrasilia (texto) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/.exec(texto)
  if (!m) throw new Error(`Data em formato inesperado: "${texto}" (use dd/mm/aaaa hh:mm)`)
  const [dia, mes, ano, hora, minuto] = m.slice(1).map(Number)
  return Date.UTC(ano, mes - 1, dia, hora, minuto) - DESLOCAMENTO_BRASILIA
}

/** Instante -> "10/11/2026 às 09:30" no horário de Brasília. */
function formatarDataDeBrasilia (instante) {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('pt-BR', {
      timeZone: FUSO, day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date(instante)).map(p => [p.type, p.value])
  )
  return `${partes.day}/${partes.month}/${partes.year} às ${partes.hour}:${partes.minute}`
}

/** Instante da segunda-feira 00:00 (Brasília) da semana que contém o instante dado. */
function inicioDaSemana (instante) {
  const local = new Date(instante + DESLOCAMENTO_BRASILIA)
  const diasDesdeSegunda = (local.getUTCDay() + 6) % 7
  const segundaLocal = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() - diasDesdeSegunda)
  return segundaLocal - DESLOCAMENTO_BRASILIA
}

const ok = mensagem => ({ ok: true, mensagem })
const erro = mensagem => ({ ok: false, mensagem })

class Servico {
  constructor () {
    this.agora = lerDataDeBrasilia('10/11/2026 09:00')
    this.usuario = null
    this.edicoes = []
    this.assinantes = new Map()
    this.semanaAtual = inicioDaSemana(this.agora)
  }

  // ---------- Relógio ----------

  definirAgora (texto) {
    this.agora = lerDataDeBrasilia(texto)
    this.semanaAtual = inicioDaSemana(this.agora)
  }

  avancarRelogio (milissegundos) {
    const destino = this.agora + milissegundos
    for (const edicao of this.edicoes) {
      const momentoDoSalvamento = edicao.ultimaAlteracao + INATIVIDADE_PARA_SALVAR
      if (edicao.alteracaoPendente && momentoDoSalvamento <= destino) {
        this._salvarVersao(edicao, momentoDoSalvamento)
      }
    }
    this.agora = destino
    const semana = inicioDaSemana(this.agora)
    if (semana !== this.semanaAtual) {
      this.semanaAtual = semana
      this._liberarFilas()
    }
  }

  avancarAte (instante) {
    if (instante < this.agora) throw new Error('O relógio não volta no tempo')
    this.avancarRelogio(instante - this.agora)
  }

  inicioDaProximaSemana () {
    return inicioDaSemana(this.agora) + 7 * DIA
  }

  // ---------- Usuários ----------

  autenticar (nome, papel) {
    this.usuario = { nome, papel }
  }

  // ---------- RN01: rascunho e versões ----------

  criarEdicao (titulo, autor) {
    const edicao = {
      titulo,
      autor,
      status: 'rascunho',
      conteudo: '',
      versoes: [],
      proximoNumeroDeVersao: 1,
      alteracaoPendente: false,
      ultimaAlteracao: null,
      comentarios: [],
      disparo: null
    }
    this.edicoes.push(edicao)
    return edicao
  }

  escrever (edicao, texto) {
    edicao.conteudo = texto
    edicao.alteracaoPendente = true
    edicao.ultimaAlteracao = this.agora
  }

  _salvarVersao (edicao, instante) {
    edicao.versoes.push({ numero: edicao.proximoNumeroDeVersao++, conteudo: edicao.conteudo, salvaEm: instante })
    if (edicao.versoes.length > MAX_VERSOES) edicao.versoes.shift()
    edicao.alteracaoPendente = false
  }

  restaurarVersao (edicao, numero) {
    const versao = edicao.versoes.find(v => v.numero === numero)
    if (!versao) return erro('Esta versão não está mais disponível')
    edicao.conteudo = versao.conteudo
    this._salvarVersao(edicao, this.agora)
    return ok(`Versão ${numero} restaurada`)
  }

  // ---------- RN02: aprovação ----------

  enviarParaRevisao (edicao) {
    edicao.status = 'em revisão'
  }

  aprovar (edicao) {
    if (this.usuario?.papel !== 'revisor') return erro('Apenas revisores podem aprovar edições')
    if (this.usuario.nome === edicao.autor) return erro('O autor não pode aprovar a própria edição')
    if (edicao.status !== 'em revisão') return erro('A edição não está em revisão')
    edicao.status = 'aprovada'
    return ok('Edição aprovada')
  }

  reprovar (edicao, comentario) {
    if (this.usuario?.papel !== 'revisor') return erro('Apenas revisores podem reprovar edições')
    if (this.usuario.nome === edicao.autor) return erro('O autor não pode reprovar a própria edição')
    if (edicao.status !== 'em revisão') return erro('A edição não está em revisão')
    if (!comentario || !comentario.trim()) return erro('A reprovação exige um comentário')
    edicao.status = 'rascunho'
    edicao.comentarios.push({ autor: this.usuario.nome, texto: comentario })
    return ok('Edição devolvida ao rascunho')
  }

  // ---------- RN03: agendamento ----------

  agendar (edicao, minutos) {
    if (this.usuario?.papel !== 'gestor') return erro('Apenas gestores podem agendar envios')
    if (edicao.status !== 'aprovada') return erro('A edição precisa ser aprovada antes do envio')
    if (minutos * MINUTO < ANTECEDENCIA_MINIMA) return erro('O envio precisa de ao menos 15 minutos')
    edicao.disparo = { horario: this.agora + minutos * MINUTO, reagendamentos: 0, status: 'agendado' }
    edicao.status = 'agendada'
    return ok('Envio agendado')
  }

  reagendar (edicao, minutos) {
    if (this.usuario?.papel !== 'gestor') return erro('Apenas gestores podem reagendar envios')
    if (edicao.disparo?.status !== 'agendado') return erro('Não há envio agendado')
    if (edicao.disparo.reagendamentos >= MAX_REAGENDAMENTOS) return erro('Limite de 2 reagendamentos atingido')
    if (minutos * MINUTO < ANTECEDENCIA_MINIMA) return erro('O envio precisa de ao menos 15 minutos')
    edicao.disparo.horario = this.agora + minutos * MINUTO
    edicao.disparo.reagendamentos++
    return ok('Envio reagendado')
  }

  cancelar (edicao) {
    if (this.usuario?.papel !== 'gestor') return erro('Apenas gestores podem cancelar envios')
    if (edicao.disparo?.status !== 'agendado') return erro('Não há envio agendado')
    if (edicao.disparo.horario - this.agora < PRAZO_CANCELAMENTO) {
      return erro('O envio só pode ser cancelado até 5 minutos antes')
    }
    edicao.disparo.status = 'cancelado'
    edicao.status = 'aprovada'
    return ok('Envio cancelado')
  }

  horarioAgendado (edicao) {
    return edicao.disparo ? formatarDataDeBrasilia(edicao.disparo.horario) : null
  }

  // ---------- RN05: frequência ----------

  cadastrarAssinante (nome) {
    const assinante = { nome, recebidasPorSemana: new Map(), fila: [], emails: [] }
    this.assinantes.set(nome, assinante)
    return assinante
  }

  processarNewsletter (titulo) {
    for (const assinante of this.assinantes.values()) {
      const email = { titulo, tipo: 'newsletter', status: null, entregueEm: null }
      assinante.emails.push(email)
      this._entregarOuEnfileirar(assinante, email)
    }
  }

  dispararTransacional (nome, titulo) {
    const assinante = this._assinante(nome)
    // Transacionais não passam pelo limite semanal.
    assinante.emails.push({ titulo, tipo: 'transacional', status: 'entregue', entregueEm: this.agora })
  }

  newslettersRecebidasNaSemana (nome) {
    return this._assinante(nome).recebidasPorSemana.get(this.semanaAtual) || 0
  }

  situacaoDoEmail (nome, titulo) {
    const emails = this._assinante(nome).emails.filter(e => e.titulo === titulo)
    return emails.length ? emails[emails.length - 1].status : null
  }

  _entregarOuEnfileirar (assinante, email) {
    const recebidas = assinante.recebidasPorSemana.get(this.semanaAtual) || 0
    if (recebidas < LIMITE_SEMANAL) {
      email.status = 'entregue'
      email.entregueEm = this.agora
      assinante.recebidasPorSemana.set(this.semanaAtual, recebidas + 1)
    } else {
      email.status = 'na fila da próxima semana'
      assinante.fila.push(email)
    }
  }

  _liberarFilas () {
    for (const assinante of this.assinantes.values()) {
      const fila = assinante.fila
      assinante.fila = []
      for (const email of fila) this._entregarOuEnfileirar(assinante, email)
    }
  }

  _assinante (nome) {
    const assinante = this.assinantes.get(nome)
    if (!assinante) throw new Error(`Assinante "${nome}" não existe neste cenário`)
    return assinante
  }
}

module.exports = Servico
module.exports.MINUTO = MINUTO
