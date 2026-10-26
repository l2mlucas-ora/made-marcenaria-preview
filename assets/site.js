/* ============================================================
   Madê Marcenaria — site.js

   JavaScript puro, sem biblioteca, sem build. O site é HTML servido
   direto e é para continuar assim. O que precisa de interação aqui
   cabe em cem linhas: menu do celular, topo fixo, revelação na
   rolagem, filtro da galeria e um lightbox.

   Os dados da casa (WhatsApp, Instagram) vêm de atributos no <body>,
   num lugar só. Os botões de WhatsApp NÃO montam wa.me aqui: apontam
   para /falar/?de=<botão>, que conta o clique e segue (ver falar/).
   ============================================================ */
(function () {
  'use strict';

  var corpo = document.body;
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function T(txt) { return window.MadeI18n ? window.MadeI18n.t(txt) : txt; }

  /* ----------------------------------------------------------
     Tema claro / escuro. Sem escolha guardada, segue o sistema; o
     botão grava a escolha (o <head> a aplica antes de pintar).
     ---------------------------------------------------------- */
  var raizHtml = document.documentElement;
  var sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)');
  function temaAtual() { return raizHtml.getAttribute('data-tema') || (sistemaEscuro.matches ? 'escuro' : 'claro'); }
  function marcarTema() {
    var escuro = temaAtual() === 'escuro';
    // O atributo explícito também liga os ícones (sol/lua) no CSS.
    if (!raizHtml.getAttribute('data-tema')) raizHtml.setAttribute('data-tema', escuro ? 'escuro' : 'claro');
    document.querySelectorAll('[data-tema-botao]').forEach(function (b) {
      b.setAttribute('aria-label', T(escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro'));
      b.setAttribute('aria-pressed', escuro ? 'true' : 'false');
    });
    var cor = document.querySelector('meta[name="theme-color"]');
    if (cor) cor.setAttribute('content', escuro ? '#15120F' : '#1C1917');
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-tema-botao]')) return;
    var novo = temaAtual() === 'escuro' ? 'claro' : 'escuro';
    raizHtml.setAttribute('data-tema', novo);
    try { localStorage.setItem('made:tema', novo); } catch (err) {}
    marcarTema();
  });
  marcarTema();
  document.addEventListener('made:idioma', marcarTema);

  /* ----------------------------------------------------------
     Telefone e Instagram: tudo que tem data-tel / data-insta recebe o
     destino a partir do <body>. Sem valor, o link fica apagado em vez
     de quebrado.
     ---------------------------------------------------------- */
  function ligar(seletor, montar) {
    var els = document.querySelectorAll(seletor);
    for (var i = 0; i < els.length; i++) {
      var destino = montar();
      if (!destino) {
        els[i].setAttribute('aria-disabled', 'true');
        els[i].removeAttribute('href');
        continue;
      }
      els[i].setAttribute('href', destino);
    }
  }
  var zap = (corpo.getAttribute('data-zap') || '').replace(/\D/g, '');
  var insta = (corpo.getAttribute('data-insta') || '').replace(/^@/, '');
  ligar('[data-tel]', function () { return zap ? 'tel:+' + zap : ''; });
  ligar('[data-insta-link]', function () { return insta ? 'https://www.instagram.com/' + insta + '/' : ''; });
  // Botões de WhatsApp: sem número confirmado, desligam (o /falar/ também
  // tem o número, mas não se manda ninguém a uma conversa que não existe).
  if (!zap) {
    var zaps = document.querySelectorAll('a[href*="falar/?de="]');
    for (var z = 0; z < zaps.length; z++) {
      zaps[z].setAttribute('aria-disabled', 'true');
      zaps[z].removeAttribute('href');
    }
  }

  /* ----------------------------------------------------------
     Menu no celular
     ---------------------------------------------------------- */
  var botao = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.setAttribute('aria-label', T(aberto ? 'Fechar menu' : 'Abrir menu'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { menu.classList.remove('aberto'); botao.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) botao.click();
    });
  }

  /* ----------------------------------------------------------
     Topo fixo e barra de ação: um observador numa âncora, não um
     listener de scroll (que dispara dezenas de vezes por segundo e
     trava o dedo num celular fraco).
     ---------------------------------------------------------- */
  var topo = document.querySelector('.topo');
  var barra = document.querySelector('.barra-fixa');
  var inicio = document.getElementById('inicio-sentinela');
  var ancora = document.getElementById('fim-do-heroi');
  if ('IntersectionObserver' in window && topo && inicio) {
    // O topo fica transparente só enquanto a página está no começo: assim
    // que o primeiro bloco do herói passa por baixo dele, vira creme — senão
    // o texto do herói rola por trás do menu.
    new IntersectionObserver(function (entradas) {
      topo.classList.toggle('fixo', !entradas[0].isIntersecting);
    }).observe(inicio);
  } else if (topo) {
    topo.classList.add('fixo');
  }
  var lancador = document.querySelector('.lancador');
  if ('IntersectionObserver' in window && ancora && (barra || lancador)) {
    // A barra do celular e o botão flutuante do "Comece seu projeto" só aparecem
    // depois que o herói (que já tem os botões) saiu da tela.
    new IntersectionObserver(function (entradas) {
      var passou = entradas[0].boundingClientRect.top < 0 && !entradas[0].isIntersecting;
      if (barra) barra.classList.toggle('visivel', passou);
      if (lancador) lancador.classList.toggle('visivel', passou);
    }).observe(ancora);
  }

  /* ----------------------------------------------------------
     Parallax leve do herói — só enquanto ele está na tela.
     ---------------------------------------------------------- */
  var fundo = document.querySelector('.heroi__fundo');
  var heroi = document.querySelector('.heroi');
  if (fundo && heroi && !reduzido && 'IntersectionObserver' in window) {
    var naTela = true, agendado = false;
    var aplicar = function () { fundo.style.transform = 'translateY(' + (window.scrollY * 0.16).toFixed(1) + 'px)'; };
    new IntersectionObserver(function (e) { naTela = e[0].isIntersecting; if (naTela) aplicar(); }).observe(heroi);
    window.addEventListener('scroll', function () {
      if (!naTela || agendado) return;
      agendado = true;
      requestAnimationFrame(function () { aplicar(); agendado = false; });
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     Luz que segue o mouse na capa — um brilho quente sobre os anéis
     do tronco. Só onde há mouse, só com movimento permitido, e preso a
     requestAnimationFrame (nada de recalcular a cada pixel).
     ---------------------------------------------------------- */
  var luz = document.querySelector('.heroi__luz');
  if (luz && heroi && !reduzido && window.matchMedia('(hover: hover)').matches) {
    var pedido = false, px = 0, py = 0;
    heroi.addEventListener('pointermove', function (e) {
      var caixa = heroi.getBoundingClientRect();
      px = ((e.clientX - caixa.left) / caixa.width) * 100;
      py = ((e.clientY - caixa.top) / caixa.height) * 100;
      if (pedido) return;
      pedido = true;
      requestAnimationFrame(function () { luz.style.setProperty('--x', px.toFixed(1) + '%'); luz.style.setProperty('--y', py.toFixed(1) + '%'); luz.classList.add('ativa'); pedido = false; });
    });
    heroi.addEventListener('pointerleave', function () { luz.classList.remove('ativa'); });
  }

  /* ----------------------------------------------------------
     Revelação na rolagem — uma vez só.
     ---------------------------------------------------------- */
  var reveláveis = document.querySelectorAll('.sobe');
  if (reduzido || !('IntersectionObserver' in window)) {
    for (var r = 0; r < reveláveis.length; r++) reveláveis[r].classList.add('visivel');
  } else {
    var olho = new IntersectionObserver(function (entradas, obs) {
      for (var k = 0; k < entradas.length; k++) {
        if (!entradas[k].isIntersecting) continue;
        entradas[k].target.classList.add('visivel');
        obs.unobserve(entradas[k].target);
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    for (var j = 0; j < reveláveis.length; j++) olho.observe(reveláveis[j]);
  }

  /* ----------------------------------------------------------
     Histórias — abas entre os projetos em destaque (setas do teclado
     andam entre as abas) e fotos em sequência dentro de cada um.
     Sem JS, as histórias aparecem uma embaixo da outra.
     ---------------------------------------------------------- */
  var abas = document.querySelectorAll('.historias__aba');
  var historias = document.querySelectorAll('.historia');
  if (abas.length) {
    var escolherHistoria = function (aba, focar) {
      for (var h = 0; h < abas.length; h++) {
        var sim = abas[h] === aba;
        abas[h].setAttribute('aria-selected', sim ? 'true' : 'false');
        abas[h].tabIndex = sim ? 0 : -1;
        var painel = document.getElementById(abas[h].getAttribute('aria-controls'));
        painel.hidden = !sim;
        if (sim && !reduzido) { painel.classList.remove('entrando'); void painel.offsetWidth; painel.classList.add('entrando'); }
      }
      if (focar) aba.focus();
      aba.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    for (var h0 = 1; h0 < historias.length; h0++) historias[h0].hidden = true;
    for (var h1 = 0; h1 < abas.length; h1++) {
      abas[h1].addEventListener('click', function () { escolherHistoria(this, false); });
      abas[h1].addEventListener('keydown', function (e) {
        var i = Array.prototype.indexOf.call(abas, this), novo = -1;
        if (e.key === 'ArrowRight') novo = (i + 1) % abas.length;
        else if (e.key === 'ArrowLeft') novo = (i - 1 + abas.length) % abas.length;
        else if (e.key === 'Home') novo = 0;
        else if (e.key === 'End') novo = abas.length - 1;
        if (novo < 0) return;
        e.preventDefault();
        escolherHistoria(abas[novo], true);
      });
    }
    // Link direto para um capítulo (o link da bio usa #historia-adega etc.): abre a aba e rola até a seção.
    var abrirPeloEndereco = function () {
      var alvo = location.hash.match(/^#historia-([\w-]+)$/);
      var aba = alvo && document.getElementById('aba-' + alvo[1]);
      if (!aba) return;
      escolherHistoria(aba, false);
      // Instantâneo: a rolagem suave começava antes de as fotos carregarem e parava no meio da página.
      document.getElementById('historias').scrollIntoView({ behavior: 'instant', block: 'start' });
    };
    abrirPeloEndereco();
    if (document.readyState !== 'complete') window.addEventListener('load', abrirPeloEndereco, { once: true });
    window.addEventListener('hashchange', abrirPeloEndereco);
    document.querySelectorAll('.historia__nav').forEach(function (nav) {
      var fotos = nav.parentNode.querySelectorAll('figure img');
      var conta = nav.querySelector('.historia__conta');
      var atualFoto = 0;
      nav.addEventListener('click', function (e) {
        var b = e.target.closest('[data-passo]');
        if (!b) return;
        fotos[atualFoto].hidden = true;
        atualFoto = (atualFoto + Number(b.getAttribute('data-passo')) + fotos.length) % fotos.length;
        fotos[atualFoto].hidden = false;
        conta.textContent = (atualFoto + 1) + ' / ' + fotos.length;
      });
    });
  }

  /* ----------------------------------------------------------
     Filtro da galeria por ambiente (data-ambiente).
     ---------------------------------------------------------- */
  var filtros = document.querySelectorAll('.filtro');
  var projetos = document.querySelectorAll('.projeto');
  var pecas = document.querySelectorAll('.peca');
  for (var f = 0; f < filtros.length; f++) {
    filtros[f].addEventListener('click', function () {
      var alvo = this.getAttribute('data-filtro');
      for (var a = 0; a < filtros.length; a++) filtros[a].setAttribute('aria-pressed', filtros[a] === this ? 'true' : 'false');
      for (var p = 0; p < pecas.length; p++) {
        var mostra = alvo === 'todos' || pecas[p].getAttribute('data-ambiente') === alvo;
        pecas[p].hidden = !mostra;
      }
    });
  }

  /* ----------------------------------------------------------
     Lightbox — abre a foto do projeto em tela cheia. Esc fecha,
     setas navegam entre os projetos visíveis.
     ---------------------------------------------------------- */
  var caixa = document.getElementById('lightbox');
  if (caixa && projetos.length) {
    var imgGrande = caixa.querySelector('img');
    var legenda = caixa.querySelector('figcaption');
    var atual = -1, ultimoFoco = null;

    var visiveis = function () {
      var lista = [];
      for (var i = 0; i < projetos.length; i++) { var pc = projetos[i].closest('.peca'); if (!(pc && pc.hidden)) lista.push(projetos[i]); }
      return lista;
    };
    var mostrar = function (i) {
      var lista = visiveis();
      if (!lista.length) return;
      atual = (i + lista.length) % lista.length;
      var el = lista[atual];
      var img = el.querySelector('img');
      imgGrande.src = el.getAttribute('data-grande') || img.getAttribute('src');
      imgGrande.alt = img.getAttribute('alt') || '';
      var b = el.querySelector('b'), s = el.querySelector('small');
      legenda.textContent = (b ? b.textContent : '') + (s ? ' — ' + s.textContent : '');
    };
    var abrir = function (el) {
      ultimoFoco = el;
      caixa.classList.add('aberto');
      caixa.setAttribute('aria-hidden', 'false');
      corpo.style.overflow = 'hidden';
      mostrar(visiveis().indexOf(el));
      caixa.querySelector('.lightbox__fechar').focus();
    };
    var fechar = function () {
      caixa.classList.remove('aberto');
      caixa.setAttribute('aria-hidden', 'true');
      corpo.style.overflow = '';
      imgGrande.removeAttribute('src');
      if (ultimoFoco) ultimoFoco.focus();
    };

    for (var q = 0; q < projetos.length; q++) {
      projetos[q].addEventListener('click', function () { abrir(this); });
    }
    caixa.querySelector('.lightbox__fechar').addEventListener('click', fechar);
    caixa.querySelector('.lightbox__ant').addEventListener('click', function () { mostrar(atual - 1); });
    caixa.querySelector('.lightbox__prox').addEventListener('click', function () { mostrar(atual + 1); });
    caixa.addEventListener('click', function (e) { if (e.target === caixa) fechar(); });
    document.addEventListener('keydown', function (e) {
      if (!caixa.classList.contains('aberto')) return;
      if (e.key === 'Escape') fechar();
      if (e.key === 'ArrowLeft') mostrar(atual - 1);
      if (e.key === 'ArrowRight') mostrar(atual + 1);
    });
  }

  /* ----------------------------------------------------------
     Ano no rodapé — para ninguém publicar "2026" em 2030.
     ---------------------------------------------------------- */
  var ano = document.querySelector('[data-ano]');
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
