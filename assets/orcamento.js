/* ============================================================
   Madê Marcenaria — assistente "Comece seu projeto"

   Conversa guiada que organiza o pedido antes de chegar no WhatsApp:
   tipo de cliente (residencial, comercial, hospedagem), imóvel,
   ambientes, tamanho ou nº de unidades, etapa da obra, projeto de
   arquitetura, estilo, prazo, investimento, cidade e observações.

   "Inteligente" sem servidor e sem IA paga:
   - o roteiro se ramifica (pousada pergunta unidades; casa pergunta m²;
     cada segmento tem a sua lista de ambientes);
   - o campo de texto entende palavras ("apto", "pousada", "reforma",
     "120m", "uns 50 mil") e casa com a opção certa;
   - dicas aparecem quando são verdade para aquele caso (só fatos que a
     dona publicou: projeto em 3D, madeira maciça no litoral);
   - o resumo final é editável item a item e sai formatado, com
     etiquetas (#hospedagem #reforma) para a dona achar no WhatsApp.

   PRIVACIDADE: nada é salvo nem enviado pelo site. As respostas vivem na
   memória desta aba; ao enviar, o texto passa por sessionStorage até
   /falar/ (que apaga na hora) e segue para o wa.me. Quem envia a
   mensagem é a própria pessoa, no WhatsApp dela.
   Tudo que a pessoa digita entra na tela por textContent — nunca HTML.

   PREÇO: o assistente NÃO estima valor (regra da casa: nunca publicar
   preço). A faixa de investimento é pergunta, não promessa.
   ============================================================ */
(function () {
  'use strict';

  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Tradução da TELA (perguntas, opções, resumo). Os valores guardados e a
  // mensagem para a dona ficam em português — ver mensagem().
  function T(txt, vars) {
    if (window.MadeI18n) return window.MadeI18n.t(txt, vars);
    if (vars) Object.keys(vars).forEach(function (k) { txt = txt.split('{' + k + '}').join(vars[k]); });
    return txt;
  }
  function idiomaAtual() { return window.MadeI18n ? window.MadeI18n.idioma() : 'pt'; }
  var LITORAL = ['Garopaba', 'Imbituba', 'Paulo Lopes', 'Laguna', 'Florianópolis', 'São José', 'Palhoça', 'Balneário Camboriú', 'Porto Belo', 'Itajaí'];

  /* ----------------------------------------------------------
     Roteiro. Cada passo: id, rotulo (no resumo), pergunta(r),
     tipo ('opcoes' | 'multi' | 'texto'), opcoes(r), quando(r),
     opcional, dica(r, valor).
     Sinônimos: [opção, palavras que a pessoa pode digitar].
     ---------------------------------------------------------- */
  var AMBIENTES = {
    Residencial: ['Cozinha', 'Quartos', 'Closet', 'Banheiros', 'Sala / painel de TV', 'Área gourmet', 'Escritório', 'Lavanderia', 'Casa inteira'],
    Comercial: ['Balcão / recepção', 'Expositores e vitrines', 'Estações de trabalho', 'Armários e arquivos', 'Copa / cozinha', 'Salão / mesas', 'Ambiente inteiro'],
    Hospedagem: ['Quartos / suítes', 'Recepção', 'Restaurante / café da manhã', 'Áreas comuns', 'Banheiros', 'Cozinha de serviço', 'Tudo']
  };

  var PASSOS = [
    {
      id: 'nome', rotulo: 'Nome', tipo: 'texto', opcional: true,
      placeholder: 'Seu primeiro nome',
      pular: 'Prefiro não dizer',
      pergunta: function () {
        return 'Olá! Sou o assistente da Madê.\nEm uns 2 minutos eu organizo as informações do seu projeto e você envia tudo pronto no WhatsApp.\n\nComo posso te chamar?';
      }
    },
    {
      id: 'segmento', rotulo: 'Tipo de projeto', tipo: 'opcoes',
      pergunta: function (r) { return (r.nome ? T('Prazer, {nome}!', { nome: r.nome }) + ' ' : '') + T('O projeto é para…'); },
      opcoes: function () {
        return [
          ['Residencial', 'casa apartamento apto ape ap residencia residencial moradia lar praia veraneio house home apartment flat condo departamento depto vivienda playa beach'],
          ['Comercial', 'loja comercio comercial escritorio consultorio clinica restaurante cafe bar salao empresa shop store office clinic restaurant salon business commercial local tienda oficina negocio'],
          ['Hospedagem', 'pousada hotel hostel airbnb temporada hospedagem chale inn guesthouse lodge rental posada hospedaje alquiler cabana']
        ];
      }
    },
    {
      id: 'imovel', rotulo: 'Imóvel', tipo: 'opcoes',
      pergunta: function (r) {
        return { Residencial: 'Que tipo de imóvel?', Comercial: 'Que tipo de negócio?', Hospedagem: 'Que tipo de hospedagem?' }[r.segmento];
      },
      opcoes: function (r) {
        return {
          Residencial: [['Casa', 'casa sobrado'], ['Apartamento', 'apartamento apto ape ap cobertura studio'], ['Casa de praia / temporada', 'praia veraneio temporada'], ['Outro', 'outro outra']],
          Comercial: [['Loja', 'loja varejo'], ['Escritório ou consultório', 'escritorio consultorio sala coworking'], ['Restaurante, bar ou café', 'restaurante bar cafe cafeteria lanchonete padaria'], ['Clínica ou salão', 'clinica salao estetica barbearia'], ['Outro', 'outro outra']],
          Hospedagem: [['Pousada', 'pousada'], ['Hotel', 'hotel'], ['Hostel', 'hostel albergue'], ['Imóvel de aluguel por temporada', 'airbnb temporada aluguel chale']]
        }[r.segmento];
      },
      dica: function (r) {
        if (r.segmento === 'Hospedagem') return 'Para hospedagem, conte também se os quartos seguem um padrão: ajuda a Madê a pensar o projeto por unidade.';
        return '';
      }
    },
    {
      id: 'unidades', rotulo: 'Unidades', tipo: 'opcoes',
      quando: function (r) { return r.segmento === 'Hospedagem'; },
      pergunta: function () { return 'Quantos quartos ou unidades entram no projeto?'; },
      opcoes: function () { return [['1 a 5', ''], ['6 a 15', ''], ['16 a 40', ''], ['Mais de 40', ''], ['Ainda não sei', 'nao sei']]; }
    },
    {
      id: 'ambientes', rotulo: 'Ambientes', tipo: 'multi',
      pergunta: function () { return 'Quais ambientes entram? Pode escolher vários.'; },
      opcoes: function (r) {
        return (AMBIENTES[r.segmento] || AMBIENTES.Residencial).map(function (a) { return [a, a]; }).concat([['Ainda não sei', 'nao sei']]);
      }
    },
    {
      id: 'tamanho', rotulo: 'Tamanho', tipo: 'opcoes',
      quando: function (r) { return r.segmento !== 'Hospedagem'; },
      pergunta: function () { return 'Qual o tamanho aproximado do imóvel?'; },
      opcoes: function () { return [['Até 60 m²', ''], ['60 a 120 m²', ''], ['120 a 250 m²', ''], ['Mais de 250 m²', ''], ['Não sei', 'nao sei']]; },
      numero: function (n) { return n <= 60 ? 'Até 60 m²' : n <= 120 ? '60 a 120 m²' : n <= 250 ? '120 a 250 m²' : 'Mais de 250 m²'; }
    },
    {
      id: 'etapa', rotulo: 'Etapa da obra', tipo: 'opcoes',
      pergunta: function () { return 'Em que pé está a obra?'; },
      opcoes: function () {
        return [['Na planta ou em construção', 'planta construcao construindo obra nova construction building pozo construccion'], ['Em reforma', 'reforma reformando renovation renovating remodel'], ['Pronto e vazio', 'pronto vazio novo chave finished empty new terminado vacio'], ['Já mobiliado, quero renovar', 'mobiliado renovar trocar furnished refresh amueblado']];
      }
    },
    {
      id: 'arquitetura', rotulo: 'Projeto de arquitetura', tipo: 'opcoes',
      pergunta: function () { return 'Já existe projeto de arquitetura ou de interiores?'; },
      opcoes: function () {
        return [['Sim, com arquiteto(a)', 'sim arquiteto arquiteta designer projeto pronto yes architect arquitecta'], ['Tenho referências e ideias', 'referencia ideia pinterest foto references ideas referencias ideas'], ['Quero que a Madê desenhe', 'nao madê made desenhe voces design disenen']];
      },
      dica: function (r, v) {
        if (v === 'Quero que a Madê desenhe') return 'A Madê apresenta o projeto em 3D antes de produzir, para você ajustar proporções, cores e materiais.';
        if (v === 'Sim, com arquiteto(a)') return 'No WhatsApp, mande o projeto (PDF ou imagens) junto com esta mensagem: agiliza muito.';
        if (v === 'Tenho referências e ideias') return 'Separe as fotos de referência para mandar no WhatsApp. Prints do Pinterest e do Instagram valem.';
        return '';
      }
    },
    {
      id: 'estilo', rotulo: 'Estilo', tipo: 'multi', opcional: true,
      pergunta: function () { return 'Algum estilo em mente? (opcional)'; },
      opcoes: function () {
        return [['Moderno', 'moderno contemporaneo'], ['Madeira natural', 'madeira natural amadeirado'], ['Rústico / demolição', 'rustico demolicao'], ['Minimalista', 'minimalista clean'], ['Clássico', 'classico'], ['Ainda não sei', 'nao sei']];
      }
    },
    {
      id: 'prazo', rotulo: 'Prazo', tipo: 'opcoes',
      pergunta: function () { return 'Para quando você precisa?'; },
      opcoes: function () { return [['Até 2 meses', 'urgente rapido logo urgent asap soon pronto'], ['2 a 4 meses', ''], ['4 a 6 meses', ''], ['Sem pressa', 'sem pressa tranquilo rush apuro']]; }
    },
    {
      id: 'investimento', rotulo: 'Investimento previsto', tipo: 'opcoes',
      pergunta: function () { return 'Tem uma faixa de investimento em mente? Isso ajuda a Madê a sugerir materiais que cabem no seu orçamento.'; },
      opcoes: function () { return [['Até R$ 30 mil', ''], ['R$ 30 a 80 mil', ''], ['R$ 80 a 150 mil', ''], ['Acima de R$ 150 mil', ''], ['Prefiro conversar', 'conversar depois nao sei']]; },
      numero: function (n, texto) {
        if (/mil|k\b|thousand/.test(texto) && n < 10000) n = n * 1000;
        return n <= 30000 ? 'Até R$ 30 mil' : n <= 80000 ? 'R$ 30 a 80 mil' : n <= 150000 ? 'R$ 80 a 150 mil' : 'Acima de R$ 150 mil';
      }
    },
    {
      id: 'cidade', rotulo: 'Cidade', tipo: 'opcoes',
      pergunta: function () { return 'Em que cidade fica o imóvel?'; },
      // Cidades pedidas pelo dono em 17/10/2026; nomes de cidade não se traduzem.
      opcoes: function () {
        return [['Garopaba', 'garopaba ferrugem siriu'], ['Imbituba', 'imbituba rosa praia do rosa ibiraquera'], ['Paulo Lopes', 'paulo lopes'], ['Laguna', 'laguna'],
          ['Florianópolis', 'florianopolis floripa ilha'], ['São José', 'sao jose'], ['Palhoça', 'palhoca pinheira'], ['Balneário Camboriú', 'balneario camboriu bc'],
          ['Porto Belo', 'porto belo'], ['Itajaí', 'itajai'], ['Outra cidade', 'outra outro outros other otra']];
      },
      livre: true,
      dica: function (r, v) {
        if (LITORAL.indexOf(v) !== -1) return 'No litoral, a Madê usa rodapés e molduras em madeira maciça, para o móvel resistir melhor à maresia.';
        return '';
      }
    },
    {
      id: 'obs', rotulo: 'Observações', tipo: 'texto', opcional: true,
      placeholder: 'Medidas, o que incomoda hoje, uma ideia…',
      pular: 'Nada a acrescentar',
      pergunta: function () { return 'Quer contar mais alguma coisa? Medidas, o que incomoda hoje, uma ideia que você viu por aí…'; }
    },
    // Extras: não são perguntados. Chegam do configurador "Monte seu ambiente"
    // e do moodboard (fotos curtidas) e entram no resumo e na mensagem.
    { id: 'combinacao', rotulo: 'Combinação que montei no site', extra: true },
    { id: 'referencias', rotulo: 'Referências que curti', extra: true }
  ];

  /* ----------------------------------------------------------
     Estado
     ---------------------------------------------------------- */
  var r = {};               // respostas
  var atual = -1;           // índice do passo na lista PASSOS
  var historico = [];       // índices visitados, para o "voltar"
  var editando = false;     // veio do resumo para corrigir um item
  var selecao = [];         // seleção em andamento num passo 'multi'
  var montado = false;
  var el = {};
  var ultimoFoco = null;

  function normaliza(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function ativo(p) { if (p.extra) return !!(r[p.id] && r[p.id].length); return !p.quando || p.quando(r); }
  function perguntavel(p) { return !p.extra && ativo(p); }
  function proximo(de) { for (var i = de + 1; i < PASSOS.length; i++) if (perguntavel(PASSOS[i])) return i; return -1; }
  function totalAtivos() { return PASSOS.filter(perguntavel).length; }
  function posicao(i) { var n = 0; for (var k = 0; k <= i; k++) if (perguntavel(PASSOS[k])) n++; return n; }
  function lerFavoritos() {
    var f = window.MadeFavoritos ? window.MadeFavoritos.lista() : [];
    if (f.length) r.referencias = f; else delete r.referencias;
  }

  /* ----------------------------------------------------------
     Interface
     ---------------------------------------------------------- */
  var ICONE = {
    fechar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    voltar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    enviar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    zap: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-1-1.1-1.3-1.7-.1-.2 0-.4.1-.5l.4-.5.3-.4v-.5l-.7-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.6.6-.9 1.3-.9 2.1 0 .9.4 1.8 1 2.6 1.1 1.6 2.6 2.9 4.4 3.6.5.2.9.3 1.3.4.5.1 1 .1 1.5 0 .6-.2 1.1-.6 1.4-1.1.1-.3.2-.7.1-1l-.4-.2z"/></svg>'
  };

  function montar() {
    if (montado) return;
    montado = true;
    var imgLanc = document.querySelector('.lancador img');
    var logo = imgLanc ? imgLanc.getAttribute('src') : 'assets/logo.png';

    el.fundo = document.createElement('div');
    el.fundo.className = 'orc-fundo';
    el.caixa = document.createElement('div');
    el.caixa.className = 'orc';
    el.caixa.setAttribute('data-sem-traducao', '');
    el.caixa.setAttribute('role', 'dialog');
    el.caixa.setAttribute('aria-modal', 'true');
    el.caixa.setAttribute('aria-labelledby', 'orc-titulo');
    // Estrutura fixa (sem nenhum dado da pessoa): pode ir por innerHTML.
    el.caixa.innerHTML =
      '<div class="orc__topo">' +
        '<button class="orc__voltar" type="button" aria-label="Voltar uma pergunta" hidden>' + ICONE.voltar + '</button>' +
        '<img src="' + logo + '" alt="" width="40" height="40">' +
        '<div><b id="orc-titulo">Comece seu projeto</b><small>Madê Marcenaria</small></div>' +
        '<button class="orc__fechar" type="button" aria-label="Fechar o assistente">' + ICONE.fechar + '</button>' +
      '</div>' +
      '<div class="orc__progresso" aria-hidden="true"><span></span></div>' +
      '<div class="orc__log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<div class="orc__rodape">' +
        '<div class="orc__opcoes"></div>' +
        '<form class="orc__form" autocomplete="off">' +
          '<label class="visualmente-oculto" for="orc-campo">Sua resposta</label>' +
          '<input id="orc-campo" type="text" maxlength="400" enterkeyhint="send">' +
          '<button type="submit" aria-label="Enviar resposta">' + ICONE.enviar + '</button>' +
        '</form>' +
        '<p class="orc__aviso">Nada fica salvo no site. Suas respostas vão só na mensagem que você enviar.</p>' +
      '</div>';
    document.body.appendChild(el.fundo);
    document.body.appendChild(el.caixa);
    traduzirMoldura();

    el.log = el.caixa.querySelector('.orc__log');
    el.opcoes = el.caixa.querySelector('.orc__opcoes');
    el.form = el.caixa.querySelector('.orc__form');
    el.campo = el.caixa.querySelector('#orc-campo');
    el.barra = el.caixa.querySelector('.orc__progresso span');
    el.voltar = el.caixa.querySelector('.orc__voltar');

    el.caixa.querySelector('.orc__fechar').addEventListener('click', fechar);
    el.fundo.addEventListener('click', fechar);
    el.voltar.addEventListener('click', voltar);
    el.form.addEventListener('submit', function (e) { e.preventDefault(); responderTexto(el.campo.value); });
    el.caixa.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') prenderFoco(e);
    });
    // Esc fecha de qualquer lugar enquanto está aberto — inclusive no instante
    // em que abriu e o foco ainda não chegou dentro da janela.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && el.caixa.classList.contains('aberto')) { e.preventDefault(); fechar(); }
    });
  }

  function traduzirMoldura() {
    if (!el.caixa) return;
    el.caixa.querySelector('#orc-titulo').textContent = T('Comece seu projeto');
    el.caixa.querySelector('.orc__topo small').textContent = T('Madê Marcenaria');
    el.caixa.querySelector('.orc__aviso').textContent = T('Nada fica salvo no site. Suas respostas vão só na mensagem que você enviar.');
    el.caixa.querySelector('label[for="orc-campo"]').textContent = T('Sua resposta');
    el.caixa.querySelector('.orc__form button').setAttribute('aria-label', T('Enviar resposta'));
    el.caixa.querySelector('.orc__fechar').setAttribute('aria-label', T('Fechar o assistente'));
    el.caixa.querySelector('.orc__voltar').setAttribute('aria-label', T('Voltar uma pergunta'));
    el.caixa.style.setProperty('--rotulo-dica', JSON.stringify(T('Dica · ')));
  }

  // Trocou o idioma com o assistente aberto: moldura, opções e resumo se refazem.
  document.addEventListener('made:idioma', function () {
    if (!montado) return;
    traduzirMoldura();
    if (atual === -2) resumo();
    else if (atual >= 0 && atual < PASSOS.length && !esperandoCidade) desenharOpcoes(PASSOS[atual]);
  });

  function prenderFoco(e) {
    var f = el.caixa.querySelectorAll('button:not([hidden]), input, [href]');
    var lista = Array.prototype.filter.call(f, function (x) { return x.offsetParent !== null; });
    if (!lista.length) return;
    var primeiro = lista[0], ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  }

  function rolarFim() { el.log.scrollTop = el.log.scrollHeight; }

  function bolha(texto, quem) {
    var d = document.createElement('div');
    d.className = 'msg msg--' + quem;
    d.textContent = texto;
    el.log.appendChild(d);
    rolarFim();
    return d;
  }

  // Cada mudança de passo ganha um número. Uma resposta rápida (antes de a
  // pergunta seguinte terminar de "digitar") não pode deixar um desenho
  // atrasado pintar a pergunta velha por cima do passo novo.
  var vez = 0;
  function digitando(depois) {
    var minha = vez;
    var seguro = function () { if (minha === vez) depois(); };
    if (reduzido) { seguro(); return; }
    var d = document.createElement('div');
    d.className = 'digitando';
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<i></i><i></i><i></i>';
    el.log.appendChild(d);
    rolarFim();
    setTimeout(function () { d.remove(); seguro(); }, 520);
  }

  function limparRodape() {
    el.opcoes.textContent = '';
    el.campo.value = '';
    el.form.hidden = false;
    var acoes = el.caixa.querySelector('.orc__acoes');
    if (acoes) acoes.remove();
  }

  function progresso() {
    var pos = atual === -2 ? totalAtivos() : posicao(atual) - 1;
    el.barra.style.width = Math.round((pos / totalAtivos()) * 100) + '%';
    el.voltar.hidden = historico.length === 0 || atual === -2;
  }

  /* ----------------------------------------------------------
     Fluxo
     ---------------------------------------------------------- */
  function perguntar(i) {
    vez++;
    atual = i;
    var p = PASSOS[i];
    progresso();
    limparRodape();
    digitando(function () {
      bolha(T(p.pergunta(r)), 'bot');
      desenharOpcoes(p);
    });
  }

  function botao(texto, classe, aoClicar, pressionado) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'opcao' + (classe ? ' ' + classe : '');
    b.textContent = texto;
    if (pressionado !== undefined) b.setAttribute('aria-pressed', pressionado ? 'true' : 'false');
    b.addEventListener('click', aoClicar);
    el.opcoes.appendChild(b);
    return b;
  }

  function desenharOpcoes(p) {
    el.opcoes.textContent = '';
    el.campo.placeholder = T(p.placeholder || (p.tipo === 'texto' ? 'Escreva aqui' : 'Ou escreva com suas palavras'));
    if (p.tipo === 'opcoes') {
      p.opcoes(r).forEach(function (o) { botao(T(o[0]), '', function () { registrar(p, o[0]); }); });
    } else if (p.tipo === 'multi') {
      selecao = (r[p.id] || []).slice();
      p.opcoes(r).forEach(function (o) {
        var b = botao(T(o[0]), '', function () {
          var k = selecao.indexOf(o[0]);
          if (k === -1) selecao.push(o[0]); else selecao.splice(k, 1);
          b.setAttribute('aria-pressed', k === -1 ? 'true' : 'false');
        }, selecao.indexOf(o[0]) !== -1);
      });
      botao(T('Continuar →'), 'opcao--secundaria', function () {
        if (!selecao.length && !p.opcional) { bolha(T('Escolha pelo menos uma opção, ou "Ainda não sei".'), 'bot'); return; }
        registrar(p, selecao.slice());
      });
    }
    if (p.opcional && p.pular) botao(T(p.pular), 'opcao--secundaria', function () { registrar(p, ''); });
    if (p.opcional && p.tipo === 'multi') botao(T('Pular'), 'opcao--secundaria', function () { registrar(p, []); });
    // Pergunta de texto: foco no campo. De opção: foco na 1ª opção (no celular
    // isso não abre o teclado por cima dos botões).
    var alvo = p.tipo === 'texto' ? el.campo : el.opcoes.querySelector('button');
    if (alvo) alvo.focus({ preventScroll: true });
    // As opções mudam a altura do rodapé: rola de novo até a última mensagem.
    requestAnimationFrame(rolarFim);
  }

  /* Texto livre → opção. Procura a opção cujo nome ou sinônimos aparecem
     no que a pessoa escreveu; números viram faixa quando o passo sabe. */
  function entender(p, texto) {
    var t = normaliza(texto);
    if (!t) return null;
    if (p.id === 'nome') {
      // "oi, meu nome é Ana" · "hi, my name is John" · "hola, me llamo Lucía" → só o nome
      var nome = texto.trim()
        .replace(/^(oi|ol[aá]|hi|hello|hey|hola|buenas)[,!.\s]*/i, '')
        .replace(/^(meu nome (é|e)|me chamo|sou (a |o )?|aqui (é|e)|my name is|i['’]?m|i am|this is|call me|me llamo|mi nombre es|soy)\s+/i, '')
        .split(/[,.!]/)[0].trim();
      return nome.split(/\s+/).slice(0, 3).join(' ').slice(0, 40) || null;
    }
    if (p.tipo === 'texto') return texto.trim().slice(0, 400);
    var opcoes = p.opcoes(r);
    var achadas = [];
    opcoes.forEach(function (o) {
      var palavras = (normaliza(o[0]) + ' ' + normaliza(T(o[0])) + ' ' + normaliza(o[1])).split(' ').filter(function (w) { return w.length > 2; });
      var bate = palavras.some(function (w) { return (' ' + t + ' ').indexOf(' ' + w) !== -1; });
      if (bate) achadas.push(o[0]);
    });
    if (p.numero) {
      var m = t.replace(/(\d)\s+(\d{3})\b/g, '$1$2').match(/\d+(?:[.,]\d+)?/);
      if (m) return p.numero(parseFloat(m[0].replace(',', '.').replace(/\.(?=\d{3}\b)/, '')), t);
    }
    if (p.tipo === 'multi') return achadas.length ? achadas : null;
    if (achadas.length) return achadas[0];
    if (p.livre) return texto.trim().slice(0, 60);
    return null;
  }

  function responderTexto(texto) {
    if (esperandoCidade) { responderCidade(texto); return; }
    if (atual < 0) return;
    var p = PASSOS[atual];
    var v = entender(p, texto);
    if (v === null) {
      if (!texto.trim() && p.opcional) { registrar(p, p.tipo === 'multi' ? [] : ''); return; }
      bolha(texto.trim() || '…', 'eu');
      digitando(function () { bolha(T('Não consegui entender. Pode escolher uma das opções abaixo?'), 'bot'); });
      el.campo.value = '';
      return;
    }
    if (p.tipo === 'multi') v = Array.from(new Set((selecao || []).concat(v)));
    registrar(p, v, texto.trim());
  }

  function registrar(p, valor, digitado) {
    vez++;
    var anterior = r[p.id];
    r[p.id] = valor;
    // Mudou o segmento: imóvel e ambientes do segmento antigo não valem mais.
    if (p.id === 'segmento' && anterior && anterior !== valor) {
      delete r.imovel; delete r.ambientes; delete r.unidades; delete r.tamanho;
    }
    var mostrar = Array.isArray(valor) ? (valor.length ? valor.map(function (v) { return T(v); }).join(', ') : T('Pular')) : (valor ? (p.tipo === 'texto' ? valor : T(valor)) : T(p.pular || 'Pular'));
    if (digitado && !Array.isArray(valor) && digitado !== valor && p.tipo !== 'texto') mostrar = digitado + '  →  ' + T(valor);
    bolha(mostrar, 'eu');
    limparRodape();
    historico.push(atual);

    var dica = p.dica ? p.dica(r, valor) : '';
    var seguir = function () {
      if (p.id === 'cidade' && valor === 'Outra cidade') { perguntarCidade(); return; }
      // Corrigindo pelo resumo: volta ao resumo — salvo quando trocou o
      // segmento, que reabre imóvel e ambientes daquele segmento.
      if (editando && !(p.id === 'segmento' && anterior !== valor)) { editando = false; resumo(); return; }
      editando = false;
      var n = proximo(atual);
      if (n === -1) resumo(); else perguntar(n);
    };
    if (dica) digitando(function () { bolha(T(dica), 'dica'); seguir(); }); else seguir();
  }

  var esperandoCidade = false;
  function perguntarCidade() {
    limparRodape();
    digitando(function () {
      bolha(T('Qual cidade?'), 'bot');
      el.campo.placeholder = T('Nome da cidade');
      esperandoCidade = true;
      el.campo.focus();
    });
  }
  function responderCidade(texto) {
    var v = String(texto || '').trim().slice(0, 60);
    if (!v) return;
    esperandoCidade = false;
    r.cidade = v;
    bolha(v, 'eu');
    limparRodape();
    if (editando) { editando = false; resumo(); return; }
    var n = proximo(PASSOS.findIndex(function (x) { return x.id === 'cidade'; }));
    if (n === -1) resumo(); else perguntar(n);
  }

  function voltar() {
    if (!historico.length) return;
    var i = historico.pop();
    editando = false;
    esperandoCidade = false;
    var p = PASSOS[i];
    delete r[p.id];
    bolha(T('Voltando para: {r}', { r: T(p.rotulo).toLowerCase() }), 'dica');
    perguntar(i);
  }

  /* ----------------------------------------------------------
     Resumo e envio
     ---------------------------------------------------------- */
  function valorTexto(id) {
    var v = r[id];
    if (Array.isArray(v)) return v.join(', ');
    return v || '';
  }

  // Valor como aparece NA TELA (traduzido); texto livre fica como foi digitado.
  function exibir(p) {
    var v = r[p.id];
    if (p.id === 'combinacao') return r.combinacao || '';
    if (p.tipo === 'texto') return v || '';
    if (p.id === 'cidade') return v === 'Outra cidade' ? T(v) : (v || '');  // nome de cidade não se traduz
    if (Array.isArray(v)) return v.map(function (x) { return T(x); }).join(', ');
    return v ? T(v) : '';
  }

  function linhas() {
    var out = [];
    PASSOS.forEach(function (p, i) {
      if (!ativo(p)) return;
      var v = valorTexto(p.id);
      if (!v) return;
      out.push({ i: i, rotulo: p.rotulo, valor: v });
    });
    return out;
  }

  function etiquetas() {
    var t = [];
    if (r.segmento) t.push(r.segmento);
    if (r.imovel && r.imovel !== 'Outro') t.push(r.imovel.split(/[ ,/]/)[0]);
    if (r.etapa) t.push(r.etapa.indexOf('reforma') !== -1 ? 'reforma' : r.etapa.indexOf('planta') !== -1 ? 'obra' : r.etapa.indexOf('vazio') !== -1 ? 'pronto' : 'renovar');
    if (r.prazo) t.push('prazo ' + r.prazo.replace(/ /g, ''));
    return t.map(function (x) { return '#' + normaliza(x).replace(/ /g, '-'); }).join(' ');
  }

  /* Número do "Comece seu projeto": MD-AAMMDD-XXXX (data + 4 caracteres sorteados).
     Não é sequencial (o site não tem servidor), mas é único na prática e
     serve para a dona e o cliente se referirem ao mesmo pedido. Gerado uma
     vez por conversa; "Recomeçar" gera outro. */
  var numero = '';
  function numeroPedido() {
    if (numero) return numero;
    var d = new Date(), dois = function (n) { return String(n).padStart(2, '0'); };
    var sorte = '';
    var abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem 0/O e 1/I, que se confundem ditando
    try { var a = new Uint32Array(4); crypto.getRandomValues(a); for (var i = 0; i < 4; i++) sorte += abc[a[i] % abc.length]; }
    catch (e) { for (var j = 0; j < 4; j++) sorte += abc[Math.floor(Math.random() * abc.length)]; }
    numero = 'MD-' + String(d.getFullYear()).slice(2) + dois(d.getMonth() + 1) + dois(d.getDate()) + '-' + sorte;
    return numero;
  }

  /* Mensagem para a dona, em português, organizada em blocos para ler
     rápido no WhatsApp: cabeçalho com número, seções com título em
     negrito, listas um item por linha, o essencial em negrito. */
  function mensagem() {
    var d = new Date(), dois = function (n) { return String(n).padStart(2, '0'); };
    var data = dois(d.getDate()) + '/' + dois(d.getMonth() + 1) + '/' + d.getFullYear() + ' às ' + dois(d.getHours()) + 'h' + dois(d.getMinutes());
    var lista = function (v) { return (Array.isArray(v) ? v : String(v).split(' · ')).map(function (x) { return '   • ' + x; }); };
    var linha = function (rot, v, forte) { return v ? rot + ': ' + (forte ? '*' + v + '*' : v) : null; };
    var bloco = function (titulo, itens) {
      itens = itens.filter(function (x) { return x !== null && x !== undefined && x !== ''; });
      if (!itens.length) return [];
      var out = ['', '*▸ ' + titulo + '*'];
      itens.forEach(function (x) { out = out.concat(x); });
      return out;
    };
    var ambientes = r.ambientes && r.ambientes.length ? ['Ambientes:'].concat(lista(r.ambientes)) : null;
    var estilo = r.estilo && r.estilo.length ? linha('Estilo', r.estilo.join(', ')) : null;
    var refs = r.referencias && r.referencias.length ? ['Referências que curti no site:'].concat(lista(r.referencias)) : null;
    var combo = r.combinacao ? ['Combinação que montei no site:'].concat(lista(r.combinacaoPt || r.combinacao)) : null;

    var m = [
      '*NOVO PROJETO Nº ' + numeroPedido() + '*',
      '_Madê Marcenaria · enviado pelo site em ' + data + '_',
      '',
      'Olá, Madê! Quero começar o meu projeto.'
    ];
    m = m.concat(bloco('CLIENTE', [
      linha('Nome', r.nome, true),
      idiomaAtual() !== 'pt' && window.MadeI18n ? linha('Idioma', window.MadeI18n.nomeIdioma(), true) : null
    ]));
    m = m.concat(bloco('PROJETO', [
      linha('Tipo', r.segmento, true),
      linha('Imóvel', r.imovel),
      linha('Unidades', r.unidades),
      linha('Tamanho', r.tamanho),
      ambientes
    ]));
    m = m.concat(bloco('OBRA E PRAZO', [
      linha('Etapa', r.etapa),
      linha('Projeto de arquitetura', r.arquitetura),
      linha('Prazo', r.prazo, true),
      linha('Investimento previsto', r.investimento),
      linha('Cidade', r.cidade, true)
    ]));
    m = m.concat(bloco('ESTILO E REFERÊNCIAS', [estilo, combo, refs]));
    m = m.concat(bloco('OBSERVAÇÕES', [r.obs || null]));
    m.push('', '━━━━━━━━━━━━', 'Posso mandar fotos e medidas do espaço por aqui.', '', etiquetas());
    return m.join('\n');
  }

  function resumo() {
    vez++;
    if (!r.sem_referencias) lerFavoritos();
    atual = -2;
    progresso();
    limparRodape();
    el.form.hidden = true;
    digitando(function () {
      bolha(r.nome ? T('Pronto, {nome}! Confira o resumo. Se algo estiver errado, toque em "corrigir".', { nome: r.nome }) : T('Pronto! Confira o resumo. Se algo estiver errado, toque em "corrigir".'), 'bot');
      var card = document.createElement('div');
      card.className = 'orc__resumo';
      var h = document.createElement('h4'); h.textContent = T('Seu projeto'); card.appendChild(h);
      var num = document.createElement('p'); num.className = 'orc__numero';
      num.textContent = T('Projeto nº {n}', { n: numeroPedido() }); card.appendChild(num);
      var dl = document.createElement('dl');
      linhas().forEach(function (l) {
        var row = document.createElement('div'); row.className = 'linha-r';
        var box = document.createElement('div');
        var dt = document.createElement('dt'); dt.textContent = T(l.rotulo);
        var dd = document.createElement('dd'); dd.textContent = exibir(PASSOS[l.i]);
        box.appendChild(dt); box.appendChild(dd);
        var c = document.createElement('button'); c.type = 'button'; c.className = 'corrigir';
        var extra = PASSOS[l.i].extra;
        c.textContent = T(extra ? 'remover' : 'corrigir');
        c.setAttribute('aria-label', T(extra ? 'Remover {r}' : 'Corrigir {r}', { r: T(l.rotulo).toLowerCase() }));
        c.addEventListener('click', function () {
          if (extra) { r[PASSOS[l.i].id] = PASSOS[l.i].id === 'referencias' ? [] : ''; r['sem_' + PASSOS[l.i].id] = true; resumo(); return; }
          editando = true; bolha(T('Corrigir: {r}', { r: T(l.rotulo).toLowerCase() }), 'dica'); perguntar(l.i);
        });
        row.appendChild(box); row.appendChild(c); dl.appendChild(row);
      });
      card.appendChild(dl);
      el.log.appendChild(card);
      rolarFim();

      var acoes = document.createElement('div');
      acoes.className = 'orc__acoes';
      var zap = document.createElement('button');
      zap.type = 'button'; zap.className = 'btn btn--bronze';
      zap.innerHTML = ICONE.zap + '<span></span>'; zap.querySelector('span').textContent = T('Enviar pelo WhatsApp');
      zap.addEventListener('click', enviar);
      var reiniciar = document.createElement('button');
      reiniciar.type = 'button'; reiniciar.className = 'opcao opcao--secundaria';
      reiniciar.style.justifySelf = 'center';
      reiniciar.textContent = T('Recomeçar');
      reiniciar.addEventListener('click', function () { r = {}; historico = []; editando = false; numero = ''; el.log.textContent = ''; perguntar(0); });
      acoes.appendChild(zap); acoes.appendChild(reiniciar);
      el.caixa.querySelector('.orc__rodape').insertBefore(acoes, el.caixa.querySelector('.orc__aviso'));
      zap.focus();
    });
  }

  function enviar() {
    var texto = mensagem();
    var numero = (document.body.getAttribute('data-zap') || '').replace(/\D/g, '');
    try {
      sessionStorage.setItem('made:mensagem', texto);
      location.href = 'falar/?de=chat';  // relativo: funciona no domínio e na prévia do GitHub
    } catch (e) {
      // Sem sessionStorage (aba privada restrita): vai direto, sem a contagem.
      location.href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
    }
  }

  /* ----------------------------------------------------------
     Abrir / fechar
     ---------------------------------------------------------- */
  function abrir(segmento, extras) {
    extras = extras || {};
    montar();
    if (extras.combinacao) { r.combinacao = extras.combinacao; r.combinacaoPt = extras.combinacaoPt || extras.combinacao; delete r.sem_combinacao; }
    if (!r.sem_referencias) lerFavoritos();
    ultimoFoco = document.activeElement;
    el.fundo.classList.add('aberto');
    el.caixa.classList.add('aberto');
    document.documentElement.style.overflow = 'hidden';
    var lanc = document.querySelector('.lancador'); if (lanc) lanc.setAttribute('aria-expanded', 'true');
    if (segmento && !r.segmento) {
      // Veio de um cartão "Residencial / Comercial / Hospedagem": já sabe o segmento.
      if (atual === -1) {
        r.segmento = segmento;
        historico = [];
        digitando(function () {
          bolha(T('Olá! Sou o assistente da Madê. Vamos organizar o seu projeto {s} em uns 2 minutos.', { s: T(segmento.toLowerCase()) }), 'bot');
          perguntar(PASSOS.findIndex(function (p) { return p.id === 'imovel'; }));
        });
        return;
      }
    }
    var recebeu = extras.combinacao ? T('Recebi a combinação que você montou: {c}. Ela vai junto no resumo.', { c: extras.combinacao }) : '';
    if (atual === -1) {
      if (recebeu) { digitando(function () { bolha(recebeu, 'dica'); perguntar(0); }); }
      else perguntar(0);
    } else if (atual === -2) {
      if (recebeu) bolha(recebeu, 'dica');
      resumo();
    } else {
      if (recebeu) bolha(recebeu, 'dica');
      setTimeout(function () { var b = el.opcoes.querySelector('button') || el.campo; if (b) b.focus(); }, 50);
    }
  }

  function fechar() {
    if (!el.caixa) return;
    el.fundo.classList.remove('aberto');
    el.caixa.classList.remove('aberto');
    document.documentElement.style.overflow = '';
    var lanc = document.querySelector('.lancador'); if (lanc) lanc.setAttribute('aria-expanded', 'false');
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  document.addEventListener('click', function (e) {
    var gatilho = e.target.closest('[data-orcamento]');
    if (!gatilho) return;
    e.preventDefault();
    abrir(gatilho.getAttribute('data-orcamento') || '');
  });

  // Atalho para campanha: /#orcamento abre o assistente direto.
  if (location.hash === '#orcamento') setTimeout(function () { abrir(''); }, 300);

  // Exposto só para o teste automatizado (scripts/capturar.mjs).
  window.__orcamento = { abrir: abrir, respostas: function () { return r; }, mensagem: function () { if (!r.sem_referencias) lerFavoritos(); return mensagem(); } };
  // API pública para o configurador e o moodboard.
  window.MadeOrcamento = { abrir: function (opts) { opts = opts || {}; abrir(opts.segmento || '', opts); } };
})();
