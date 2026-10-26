/* ============================================================
   Madê Marcenaria — "Escolha seu MDF" (explorador do catálogo)

   O MDF é o material da maioria dos planejados da Madê. Esta seção deixa
   o cliente passear pelos padrões premium da Arauco, Duratex, Berneck
   e Guararapes:
   filtra por família (cores sólidas, amadeirados, madeiras brasileiras,
   alto brilho, texturas), por marca, busca pelo nome, e vê a amostra
   grande numa porta de verdade (com puxador).

   Dali ele pode:
   - aplicar o padrão nas portas ou nos aéreos do "Monte seu ambiente";
   - guardar no moodboard (vai como referência no "Comece seu projeto").

   Dados em assets/mdf-catalogo.js. As cores na tela são aproximadas —
   o aviso fica visível ao lado do catálogo.
   ============================================================ */
(function () {
  'use strict';

  var raiz = document.getElementById('mdf');
  var CAT = window.MadeCatalogoMDF;
  if (!raiz || !CAT) return;

  function T(txt, vars) {
    if (window.MadeI18n) return window.MadeI18n.t(txt, vars);
    if (vars) Object.keys(vars).forEach(function (k) { txt = txt.split('{' + k + '}').join(vars[k]); });
    return txt;
  }

  var FAMILIAS = [
    ['todas', 'Todos'],
    ['solido', 'Cores sólidas'],
    ['madeira', 'Amadeirados'],
    ['brasileira', 'Madeiras brasileiras'],
    ['brilho', 'Alto brilho'],
    ['textura', 'Texturas']
  ];
  var NOME_FAMILIA = { solido: 'Cor sólida', madeira: 'Amadeirado', brasileira: 'Madeira brasileira', brilho: 'Alto brilho', textura: 'Textura' };

  var filtro = { familia: 'todas', marca: 'todas', made: false, busca: '' };
  var escolhido = CAT.filter(function (x) { return x.id === 'a-salvia'; })[0] || CAT[0];

  var el = {
    familias: raiz.querySelector('.mdf__familias'),
    marcas: raiz.querySelector('.mdf__marcas'),
    busca: raiz.querySelector('.mdf__busca input'),
    grade: raiz.querySelector('.mdf__grade'),
    contagem: raiz.querySelector('.mdf__contagem'),
    detalhe: raiz.querySelector('.mdf__detalhe')
  };

  function normaliza(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function fundo(item) {
    // Mesma linguagem das amostras do configurador: classe por família + --cor.
    return 'amostra-mdf amostra-mdf--' + item.familia;
  }

  /* ---------- Filtros ---------- */
  function montarFiltros() {
    el.familias.textContent = '';
    FAMILIAS.forEach(function (f) {
      var n = f[0] === 'todas' ? CAT.length : CAT.filter(function (x) { return x.familia === f[0]; }).length;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'mdf__chip'; b.dataset.familia = f[0];
      b.innerHTML = '<span></span><small></small>';
      b.querySelector('span').textContent = T(f[1]);
      b.querySelector('small').textContent = n;
      b.addEventListener('click', function () { filtro.familia = f[0]; desenhar(); });
      el.familias.appendChild(b);
    });
    el.marcas.textContent = '';
    [['todas', 'Todas as marcas'], ['Arauco', 'Arauco'], ['Duratex', 'Duratex'], ['Berneck', 'Berneck'], ['Guararapes', 'Guararapes'], ['made', 'Usados pela Madê']].forEach(function (m) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'mdf__chip mdf__chip--leve'; b.dataset.marca = m[0];
      b.textContent = T(m[1]);
      b.addEventListener('click', function () {
        if (m[0] === 'made') { filtro.made = !filtro.made; }
        else { filtro.marca = m[0]; }
        desenhar();
      });
      el.marcas.appendChild(b);
    });
    el.busca.placeholder = T('Buscar: Freijó, Sálvia…');
    el.busca.setAttribute('aria-label', T('Buscar padrão de MDF pelo nome'));
  }

  function lista() {
    var b = normaliza(filtro.busca);
    return CAT.filter(function (x) {
      if (filtro.familia !== 'todas' && x.familia !== filtro.familia) return false;
      if (filtro.marca !== 'todas' && x.marca !== filtro.marca) return false;
      if (filtro.made && !x.made) return false;
      if (b && normaliza(x.nome + ' ' + x.linha + ' ' + x.marca).indexOf(b) === -1) return false;
      return true;
    });
  }

  /* ---------- Grade ---------- */
  function desenhar() {
    el.familias.querySelectorAll('.mdf__chip').forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.familia === filtro.familia ? 'true' : 'false'); });
    el.marcas.querySelectorAll('.mdf__chip').forEach(function (c) {
      var on = c.dataset.marca === 'made' ? filtro.made : c.dataset.marca === filtro.marca;
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var itens = lista();
    el.contagem.textContent = itens.length === 1 ? T('1 padrão') : T('{n} padrões', { n: itens.length });
    el.grade.textContent = '';
    if (!itens.length) {
      var v = document.createElement('p'); v.className = 'mdf__vazio'; v.textContent = T('Nenhum padrão com esse filtro. Tente outro nome ou família.');
      el.grade.appendChild(v);
      return;
    }
    itens.forEach(function (x) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'mdf__item'; b.dataset.id = x.id;
      b.setAttribute('aria-pressed', x.id === escolhido.id ? 'true' : 'false');
      var a = document.createElement('span'); a.className = fundo(x); a.style.setProperty('--cor', x.cor); a.setAttribute('aria-hidden', 'true');
      if (x.made) { var m = document.createElement('i'); m.className = 'mdf__selo'; m.textContent = 'Madê'; m.title = T('Usado em projeto da Madê'); a.appendChild(m); }
      var n = document.createElement('b'); n.textContent = x.nome;
      var s = document.createElement('small'); s.textContent = x.marca + ' · ' + x.linha;
      b.appendChild(a); b.appendChild(n); b.appendChild(s);
      b.addEventListener('click', function () { escolhido = x; desenhar(); detalhe(true); });
      el.grade.appendChild(b);
    });
  }

  /* ---------- Detalhe ---------- */
  function noMoodboard(x) { return 'MDF ' + x.nome + ' (' + x.marca + ', ' + x.linha + ')'; }

  function detalhe(rolarNoCelular) {
    var x = escolhido;
    var d = el.detalhe;
    // A prévia em 3D (assets/cena3d.js) é reaproveitada: recriar o canvas a cada
    // clique abriria um contexto WebGL novo por padrão.
    var prev3d = d.querySelector('.mdf__previa.tem-3d');
    d.textContent = '';
    var prev = prev3d || document.createElement('div');
    if (!prev3d) {
      prev.className = 'mdf__previa';
      // Sem 3D: duas portas em CSS com puxador — o padrão "virando móvel".
      prev.innerHTML = '<div class="mdf__porta"><i></i></div><div class="mdf__porta"><i></i></div>';
      prev.querySelectorAll('.mdf__porta').forEach(function (p) { p.className = 'mdf__porta ' + fundo(x); p.style.setProperty('--cor', x.cor); });
    }
    d.appendChild(prev);
    document.dispatchEvent(new CustomEvent('made:mdf', { detail: x }));

    var info = document.createElement('div'); info.className = 'mdf__info';
    var k = document.createElement('p'); k.className = 'kicker'; k.textContent = T(NOME_FAMILIA[x.familia]);
    var h = document.createElement('h3'); h.textContent = x.nome;
    var dl = document.createElement('dl');
    [['Fabricante', x.marca], ['Linha / acabamento', x.linha]].forEach(function (par) {
      var div = document.createElement('div');
      var dt = document.createElement('dt'); dt.textContent = T(par[0]);
      var dd = document.createElement('dd'); dd.textContent = par[1];
      div.appendChild(dt); div.appendChild(dd); dl.appendChild(div);
    });
    if (x.made) {
      var div = document.createElement('div');
      var dt = document.createElement('dt'); dt.textContent = T('Usado pela Madê em');
      var dd = document.createElement('dd'); dd.textContent = T(x.made);
      div.appendChild(dt); div.appendChild(dd); dl.appendChild(div);
    }
    info.appendChild(k); info.appendChild(h); info.appendChild(dl);

    var acoes = document.createElement('div'); acoes.className = 'mdf__acoes';
    var b1 = document.createElement('button'); b1.type = 'button'; b1.className = 'btn btn--bronze'; b1.textContent = T('Ver nas portas');
    b1.addEventListener('click', function () { aplicar('p'); });
    var b2 = document.createElement('button'); b2.type = 'button'; b2.className = 'btn btn--linha'; b2.textContent = T('Ver nos aéreos e painéis');
    b2.addEventListener('click', function () { aplicar('s'); });
    var fav = window.MadeFavoritos;
    var b3 = document.createElement('button'); b3.type = 'button'; b3.className = 'link-seta mdf__curtir';
    var marcarFav = function () {
      var tem = fav && fav.tem(noMoodboard(x));
      b3.textContent = tem ? T('♥ No seu moodboard') : T('♡ Guardar no moodboard');
      b3.setAttribute('aria-pressed', tem ? 'true' : 'false');
    };
    b3.addEventListener('click', function () { if (fav) { fav.alternar(noMoodboard(x)); marcarFav(); } });
    marcarFav();
    acoes.appendChild(b1); acoes.appendChild(b2); acoes.appendChild(b3);
    info.appendChild(acoes);
    d.appendChild(info);

    if (rolarNoCelular && window.matchMedia('(max-width: 899px)').matches) d.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function aplicar(slot) {
    if (!window.MadeMonte) return;
    window.MadeMonte.aplicarMDF(slot, escolhido);
    var alvo = document.getElementById('monte');
    if (alvo) alvo.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  el.busca.addEventListener('input', function () { filtro.busca = el.busca.value.slice(0, 40); desenhar(); });

  montarFiltros();
  desenhar();
  detalhe(false);
  document.addEventListener('made:idioma', function () { montarFiltros(); desenhar(); detalhe(false); });

  window.MadeMDF = { escolher: function (id) { var x = CAT.filter(function (i) { return i.id === id; })[0]; if (x) { escolhido = x; desenhar(); detalhe(false); } }, escolhido: function () { return escolhido; } };
})();
