/* ============================================================
   Madê Marcenaria — "Monte seu ambiente" (configurador visual)

   A pessoa escolhe o ambiente (cozinha, quarto e closet, área gourmet,
   banheiro) e os acabamentos, e a ilustração muda na hora. Os materiais
   são os que a dona cita nas legendas do Instagram (Verde-sálvia,
   Carvalho Malva, Cumaru, Grápia, Frapê, Cafelatte, Beige Matt, Gianduia,
   pedra São Gabriel…), e as "paletas prontas" reproduzem projetos reais.

   O desenho é SVG gerado aqui mesmo — sem biblioteca, sem imagem pesada.
   Madeira e pedra ganham textura por filtro (feTurbulence), por isso as
   portas "parecem" madeira, e não só uma cor chapada.

   A combinação escolhida:
   - vai junto no pré-orçamento (window.MadeOrcamento.abrir);
   - pode virar link para compartilhar (#monte=cozinha-salvia-…), útil
     para mandar ao cônjuge ou ao arquiteto. Nada pessoal vai no link.

   É ilustração para inspirar: as cores são aproximadas, e o texto diz
   isso na tela. A Madê apresenta amostras e o projeto em 3D de verdade.
   ============================================================ */
(function () {
  'use strict';

  var raiz = document.getElementById('monte');
  if (!raiz) return;
  function T(txt, vars) {
    if (window.MadeI18n) return window.MadeI18n.t(txt, vars);
    if (vars) Object.keys(vars).forEach(function (k) { txt = txt.split('{' + k + '}').join(vars[k]); });
    return txt;
  }

  /* ---------- Catálogo (nomes como a dona escreve nas legendas) ---------- */
  var MAT = {
    salvia:    { nome: 'Verde-sálvia',   cor: '#6F7A63', tipo: 'laca' },
    branco:    { nome: 'Branco',         cor: '#ECE9E3', tipo: 'laca' },
    cinza:     { nome: 'Cinza',          cor: '#9B9D99', tipo: 'laca' },
    beige:     { nome: 'Beige Matt',     cor: '#D3C8B8', tipo: 'laca' },
    frape:     { nome: 'Frapê',          cor: '#CBC4B8', tipo: 'laca' },
    cafelatte: { nome: 'Cafelatte',      cor: '#A68E77', tipo: 'laca' },
    gianduia:  { nome: 'Gianduia',       cor: '#5C4A3F', tipo: 'trama' },
    malva:     { nome: 'Carvalho Malva', cor: '#C4A27C', tipo: 'madeira' },
    cumaru:    { nome: 'Cumaru',         cor: '#AD7F55', tipo: 'madeira' },
    grapia:    { nome: 'Grápia',         cor: '#B4813F', tipo: 'madeira' }
  };
  // Padrões do catálogo de MDF (assets/mdf-catalogo.js) também valem aqui:
  // aparecem nas amostras quando escolhidos pelo explorador "Escolha seu MDF".
  var CURADOS = Object.keys(MAT);
  (window.MadeCatalogoMDF || []).forEach(function (x) {
    if (!MAT[x.id]) MAT[x.id] = { nome: x.nome, cor: x.cor, tipo: window.MadeCatalogoMDF.tipoDesenho(x.familia), marca: x.marca, linha: x.linha };
  });

  var TAMPO = {
    quartzo:    { nome: 'Branco',            cor: '#F0EEE9', tipo: 'pedra-clara' },
    saogabriel: { nome: 'Pedra São Gabriel', cor: '#262524', tipo: 'pedra' },
    madeira:    { nome: 'Madeira maciça',    cor: '#C2873F', tipo: 'madeira' }
  };
  var PUX = {
    escovado: { nome: 'Escovado', cor: '#B9BBBD' },
    dourado:  { nome: 'Dourado',  cor: '#C9A35B' },
    preto:    { nome: 'Preto',    cor: '#252321' },
    cava:     { nome: 'Cava, sem puxador', cor: null }
  };
  var AMB = {
    cozinha:  { nome: 'Cozinha',         rot: ['Portas e torre', 'Aéreos e prateleiras', 'Bancada'] },
    quarto:   { nome: 'Quarto e closet', rot: ['Portas do armário', 'Painel da cabeceira', 'Tampo dos criados'] },
    gourmet:  { nome: 'Área gourmet',    rot: ['Portas ripadas', 'Prateleiras', 'Bancada'] },
    banheiro: { nome: 'Banheiro',        rot: ['Gabinete', 'Nicho', 'Bancada'] }
  };
  // Paletas prontas: cada uma reproduz um projeto publicado no Instagram.
  var PRONTAS = [
    { nome: 'Verde-sálvia',              nota: 'Cozinha com aço escovado',   e: { amb: 'cozinha',  p: 'salvia',  s: 'branco',  t: 'quartzo',    h: 'escovado', led: 1 } },
    { nome: 'Carvalho Malva',            nota: 'Com pedra São Gabriel',      e: { amb: 'cozinha',  p: 'malva',   s: 'malva',   t: 'saogabriel', h: 'preto',    led: 1 } },
    { nome: 'Monocromática',             nota: 'Beige Matt, sem puxador',    e: { amb: 'cozinha',  p: 'beige',   s: 'beige',   t: 'quartzo',    h: 'cava',     led: 0 } },
    { nome: 'Closet em Cumaru',          nota: 'Madeira de ponta a ponta',   e: { amb: 'quarto',   p: 'cumaru',  s: 'cumaru',  t: 'quartzo',    h: 'escovado', led: 1 } },
    { nome: 'Quarto Frapê e Cafelatte',  nota: 'Tons neutros que crescem junto', e: { amb: 'quarto', p: 'frape', s: 'cafelatte', t: 'quartzo',  h: 'escovado', led: 0 } },
    { nome: 'Grápia natural',            nota: 'Ripado na churrasqueira',    e: { amb: 'gourmet',  p: 'grapia',  s: 'grapia',  t: 'saogabriel', h: 'preto',    led: 1 } }
  ];

  var estado = { amb: 'cozinha', p: 'salvia', s: 'branco', t: 'quartzo', h: 'escovado', led: 1 };

  /* ---------- Desenho ---------- */
  var W = 1200, H = 760, PISO = 640;

  // Gerador pseudoaleatório com semente: a parede de pedra sai sempre igual.
  function sorteio(semente) { var s = semente; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  function clarear(hex, f) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var m = function (c) { return Math.max(0, Math.min(255, Math.round(f >= 0 ? c + (255 - c) * f : c * (1 + f)))); };
    return '#' + ((1 << 24) + (m(r) << 16) + (m(g) << 8) + m(b)).toString(16).slice(1);
  }

  function textura(id, mat, orient) {
    var o = '<pattern id="' + id + '" patternUnits="userSpaceOnUse" width="' + W + '" height="' + H + '">' +
      '<rect width="' + W + '" height="' + H + '" fill="' + mat.cor + '"/>';
    if (mat.tipo === 'madeira') o += '<rect width="' + W + '" height="' + H + '" filter="url(#mv-veio-' + orient + ')" opacity=".34"/>';
    if (mat.tipo === 'trama') o += '<rect width="' + W + '" height="' + H + '" filter="url(#mv-trama)" opacity=".22"/>';
    if (mat.tipo === 'brilho') o += '<rect width="' + W + '" height="' + H + '" fill="url(#mv-reflexo)"/>';
    if (mat.tipo === 'pedra') o += '<rect width="' + W + '" height="' + H + '" filter="url(#mv-pintas)" opacity=".5"/>';
    if (mat.tipo === 'pedra-clara') o += '<rect width="' + W + '" height="' + H + '" filter="url(#mv-veios-pedra)" opacity=".12"/>';
    return o + '</pattern>';
  }

  function defs() {
    var pux = PUX[estado.h];
    var metal = pux.cor || '#999';
    return '<defs>' +
      '<filter id="mv-veio-v" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.09 0.0035" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.12  0 0 0 0 0.07  0 0 0 0 0.03  1.9 0 0 0 -0.78"/></filter>' +
      '<filter id="mv-veio-h" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0035 0.09" numOctaves="3" seed="3"/><feColorMatrix values="0 0 0 0 0.12  0 0 0 0 0.07  0 0 0 0 0.03  1.9 0 0 0 -0.78"/></filter>' +
      '<filter id="mv-trama" x="0" y="0" width="100%" height="100%"><feTurbulence type="turbulence" baseFrequency="0.55 0.18" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2 0 0 0 -0.9"/></filter>' +
      '<filter id="mv-pintas" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  3 0 0 0 -1.95"/></filter>' +
      '<filter id="mv-veios-pedra" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="4" seed="2"/><feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.3  0 0 0 0 0.3  2.2 0 0 0 -1.1"/></filter>' +
      '<filter id="mv-desfoque" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>' +
      '<filter id="mv-sombra" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>' +
      '<linearGradient id="mv-parede" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFEAE2"/><stop offset="1" stop-color="#E3DACD"/></linearGradient>' +
      '<linearGradient id="mv-piso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2C6B5"/><stop offset="1" stop-color="#BDAF9C"/></linearGradient>' +
      '<linearGradient id="mv-brilho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>' +
      '<linearGradient id="mv-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + clarear(metal, .45) + '"/><stop offset=".5" stop-color="' + metal + '"/><stop offset="1" stop-color="' + clarear(metal, -.35) + '"/></linearGradient>' +
      '<linearGradient id="mv-luz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD596" stop-opacity=".62"/><stop offset="1" stop-color="#FFD596" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="mv-luz-cima" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFD596" stop-opacity=".5"/><stop offset="1" stop-color="#FFD596" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="mv-reflexo" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(1200 760)"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset=".47" stop-color="#fff" stop-opacity=".22"/><stop offset=".52" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="mv-vidro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A3836"/><stop offset=".55" stop-color="#1B1A19"/><stop offset="1" stop-color="#2C2A28"/></linearGradient>' +
      '<linearGradient id="mv-espelho" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E4E8EA"/><stop offset=".6" stop-color="#C6CDD1"/><stop offset="1" stop-color="#B3BBC0"/></linearGradient>' +
      textura('mv-p', MAT[estado.p], 'v') + textura('mv-s', MAT[estado.s], 'h') + textura('mv-t', TAMPO[estado.t], 'h') +
      '</defs>';
  }

  function r(x, y, w, h, fill, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"' + (extra || '') + '/>'; }

  // Puxador: posição t (topo), b (base), l (esquerda), d (direita).
  function puxador(x, y, w, h, pos) {
    if (estado.h === 'cava') {
      if (pos === 'b') return r(x, y + h - 7, w, 7, 'rgba(0,0,0,.32)');
      if (pos === 'l' || pos === 'd') return r(pos === 'l' ? x : x + w - 7, y, 7, h, 'rgba(0,0,0,.28)');
      return r(x, y, w, 7, 'rgba(0,0,0,.32)');
    }
    var f = 'url(#mv-metal)', s = ' rx="2.5"';
    if (pos === 't') return r(x + w / 2 - Math.min(60, w * .35), y + 16, Math.min(120, w * .7), 6, f, s);
    if (pos === 'b') return r(x + w / 2 - Math.min(60, w * .35), y + h - 22, Math.min(120, w * .7), 6, f, s);
    var hh = Math.min(160, h * .35), yy = y + h / 2 - hh / 2;
    return r(pos === 'l' ? x + 16 : x + w - 22, yy, 6, hh, f, s);
  }

  function porta(x, y, w, h, slot, pos) {
    return r(x, y, w, h, 'url(#mv-' + slot + ')') + r(x, y, w, h, 'url(#mv-brilho)') +
      r(x + .75, y + .75, w - 1.5, h - 1.5, 'none', ' stroke="rgba(0,0,0,.2)" stroke-width="1.5"') + (pos ? puxador(x, y, w, h, pos) : '');
  }

  function tampo(x, y, w, h) {
    return r(x, y, w, h, 'url(#mv-t)') + r(x, y, w, 2, 'rgba(255,255,255,.35)') + r(x, y + h, w, 6, 'rgba(0,0,0,.12)');
  }

  function led(x, y, w, paraCima) {
    if (!estado.led) return r(x, y, w, 3, 'rgba(0,0,0,.18)');
    return paraCima
      ? r(x, y - 90, w, 90, 'url(#mv-luz-cima)') + r(x, y - 3, w, 3, '#FFE7BF')
      : r(x, y, w, 3, '#FFE7BF') + r(x, y + 3, w, 120, 'url(#mv-luz)');
  }

  function sombra(cx, cy, rx) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="14" fill="rgba(40,30,20,.28)" filter="url(#mv-sombra)"/>'; }
  function rodape(x, w) { return r(x, PISO - 10, w, 10, '#2B2622'); }

  function fundo(tipo) {
    var o = r(0, 0, W, PISO, 'url(#mv-parede)') + r(0, PISO, W, H - PISO, 'url(#mv-piso)') + r(0, PISO, W, 2, 'rgba(0,0,0,.12)');
    if (tipo === 'azulejo') { for (var gx = 0; gx < W; gx += 60) o += r(gx, 0, 1, PISO, 'rgba(0,0,0,.05)'); for (var gy = 0; gy < PISO; gy += 60) o += r(0, gy, W, 1, 'rgba(0,0,0,.05)'); }
    for (var px = 0; px < W; px += 150) o += r(px, PISO, 1, H - PISO, 'rgba(0,0,0,.06)');
    return o;
  }

  function planta(x, y) {
    return '<path d="M' + (x - 16) + ' ' + y + 'h32l-5 30h-22z" fill="#B9A58C"/>' +
      '<ellipse cx="' + (x - 10) + '" cy="' + (y - 14) + '" rx="12" ry="18" fill="#6E7E5E" transform="rotate(-24 ' + (x - 10) + ' ' + (y - 14) + ')"/>' +
      '<ellipse cx="' + (x + 10) + '" cy="' + (y - 16) + '" rx="11" ry="19" fill="#7D8D6B" transform="rotate(22 ' + (x + 10) + ' ' + (y - 16) + ')"/>' +
      '<ellipse cx="' + x + '" cy="' + (y - 26) + '" rx="9" ry="18" fill="#62724F"/>';
  }

  var CENAS = {
    cozinha: function () {
      var o = fundo();
      // Revestimento entre bancada e aéreos
      o += r(340, 300, 770, 152, 'rgba(255,255,255,.28)');
      for (var ty = 338; ty < 452; ty += 38) o += r(340, ty, 770, 1, 'rgba(0,0,0,.05)');
      // Torre
      o += porta(90, 110, 240, 188, 'p', 'b');
      o += r(90, 298, 240, 176, 'url(#mv-p)') + r(90, 298, 240, 176, 'rgba(0,0,0,.12)');
      o += r(108, 312, 204, 62, 'url(#mv-vidro)', ' rx="3"') + r(126, 330, 120, 26, 'rgba(255,255,255,.06)', ' rx="2"') + r(270, 336, 26, 14, '#3a3a3a', ' rx="2"');
      o += r(108, 384, 204, 80, 'url(#mv-vidro)', ' rx="3"') + r(122, 392, 176, 6, 'url(#mv-metal)', ' rx="3"') + r(126, 408, 168, 44, 'rgba(255,255,255,.05)', ' rx="2"');
      o += porta(90, 474, 240, 156, 'p', 't') + rodape(90, 240);
      // Aéreos e LED
      o += porta(340, 140, 180, 160, 's', 'b') + porta(520, 140, 180, 160, 's', 'b') + led(340, 300, 360);
      // Prateleiras abertas
      o += r(730, 170, 380, 14, 'url(#mv-s)') + r(730, 170, 380, 14, 'url(#mv-brilho)') + r(730, 250, 380, 14, 'url(#mv-s)') + r(730, 250, 380, 14, 'url(#mv-brilho)');
      o += led(730, 264, 380);
      o += planta(780, 170) + r(840, 128, 26, 42, '#DCD3C5', ' rx="4"') + r(872, 138, 22, 32, '#CBBFAE', ' rx="4"') + r(960, 140, 70, 10, '#8E7D69') + r(966, 130, 58, 10, '#B5A18A') + r(1040, 120, 34, 50, '#E8E2D8', ' rx="16"');
      o += r(770, 214, 46, 36, '#EFEAE2', ' rx="6"') + r(830, 224, 30, 26, '#D9CFC1', ' rx="5"') + planta(1060, 250) + r(930, 228, 80, 22, '#A69580', ' rx="3"');
      // Bancada, portas de baixo, cuba e torneira
      o += tampo(334, 452, 782, 20);
      for (var i = 0; i < 5; i++) o += porta(340 + i * 154, 472, 154, 158, 'p', 't');
      o += rodape(340, 770);
      o += '<path d="M905 452V412q0-14 14-14h14q10 0 10 10v10" fill="none" stroke="#6B6B6B" stroke-width="5" stroke-linecap="round"/>';
      // Pendentes
      [880, 1000].forEach(function (x) {
        o += r(x - 1, 0, 2, 92, '#3A3633') + '<path d="M' + (x - 26) + ' 118a26 26 0 0 1 52 0z" fill="#2B2724"/>';
        if (estado.led) o += '<ellipse cx="' + x + '" cy="150" rx="70" ry="40" fill="#FFD596" opacity=".28" filter="url(#mv-desfoque)"/>';
      });
      o += sombra(600, PISO + 6, 520);
      return o;
    },

    quarto: function () {
      var o = fundo();
      // Armário: três portas de giro
      o += porta(80, 90, 160, 540, 'p', 'd') + porta(240, 90, 160, 540, 'p', 'l') + porta(400, 90, 160, 540, 'p', 'l') + rodape(80, 480);
      // Painel da cabeceira (ripado) com LED por cima
      o += r(660, 290, 400, 350, 'url(#mv-s)') + r(660, 290, 400, 350, 'url(#mv-brilho)');
      for (var x = 680; x < 1060; x += 20) o += r(x, 290, 2, 350, 'rgba(0,0,0,.14)');
      o += led(660, 290, 400);
      // Cama
      o += r(700, 560, 320, 72, '#D6CDBF', ' rx="6"') + r(700, 516, 320, 52, '#F1ECE4', ' rx="12"');
      o += r(722, 486, 126, 42, '#F8F5F0', ' rx="16"') + r(872, 486, 126, 42, '#F8F5F0', ' rx="16"');
      o += r(700, 548, 320, 34, '#CFC4B4', ' rx="8"') + r(700, 548, 320, 6, 'rgba(255,255,255,.3)');
      // Criados-mudos suspensos
      [578, 1070].forEach(function (cx) {
        o += r(cx, 539, 72, 6, 'url(#mv-t)') + porta(cx, 545, 72, 50, 'p', 't') + sombra(cx + 36, 618, 40);
        o += r(cx + 26, 508, 20, 31, '#E9E1D3', ' rx="9"') + r(cx + 34, 500, 4, 10, '#8A7B69');
        if (estado.led) o += '<ellipse cx="' + (cx + 36) + '" cy="505" rx="34" ry="26" fill="#FFD596" opacity=".35" filter="url(#mv-desfoque)"/>';
      });
      o += sombra(860, PISO + 4, 200) + sombra(320, PISO + 6, 250);
      return o;
    },

    gourmet: function () {
      var o = fundo();
      // Parede de pedra
      o += r(70, 50, 350, 590, '#8F8980');
      var sor = sorteio(42);
      for (var y = 50; y < 640; y += 30) {
        var x = 70 - sor() * 40;
        while (x < 420) {
          var w = 38 + sor() * 52, tom = 120 + Math.round(sor() * 70);
          var c = 'rgb(' + tom + ',' + (tom - 4) + ',' + (tom - 10) + ')';
          var x0 = Math.max(70, x + 2), x1 = Math.min(420, x + w - 2);
          if (x1 > x0) o += r(x0, y + 2, x1 - x0, 26, c, ' rx="5"');
          x += w;
        }
      }
      // Churrasqueira
      o += r(150, 300, 190, 150, '#1C1A18', ' rx="4"');
      for (var gx = 162; gx < 335; gx += 14) o += r(gx, 400, 4, 40, '#4A4642');
      o += '<ellipse cx="245" cy="425" rx="60" ry="14" fill="#E8833A" opacity=".35" filter="url(#mv-desfoque)"/>';
      o += tampo(120, 450, 250, 16);
      // Prateleiras com LED
      [200, 300].forEach(function (yy) { o += r(470, yy, 610, 14, 'url(#mv-s)') + r(470, yy, 610, 14, 'url(#mv-brilho)') + led(470, yy + 14, 610); });
      o += r(500, 150, 16, 50, '#4C5A3E', ' rx="5"') + r(524, 160, 16, 40, '#6E4A2F', ' rx="5"') + r(548, 156, 16, 44, '#3F4A35', ' rx="5"');
      o += r(700, 170, 90, 30, '#D8CCBA', ' rx="4"') + planta(930, 200) + r(1000, 172, 40, 28, '#EDE6DA', ' rx="12"');
      o += r(520, 268, 22, 32, 'rgba(255,255,255,.55)', ' rx="5"') + r(550, 268, 22, 32, 'rgba(255,255,255,.55)', ' rx="5"') + r(640, 262, 120, 38, '#B9A58C', ' rx="4"') + planta(1030, 300);
      // Bancada e portas ripadas
      o += tampo(430, 452, 690, 20);
      o += r(436, 472, 678, 158, '#2A2420');
      for (var sx = 440; sx < 1110; sx += 22) o += r(sx, 474, 16, 154, 'url(#mv-p)') + r(sx, 474, 16, 154, 'url(#mv-brilho)');
      // Ripado abre por toque: sem puxador aparente, só as divisões das portas.
      for (var d = 1; d < 4; d++) o += r(436 + d * 170, 472, 2, 158, 'rgba(0,0,0,.35)');
      o += rodape(436, 678) + sombra(780, PISO + 6, 360);
      return o;
    },

    banheiro: function () {
      var o = fundo('azulejo');
      // Espelho com LED atrás
      if (estado.led) o += r(410, 100, 380, 320, '#FFD596', ' rx="36" opacity=".75" filter="url(#mv-desfoque)"');
      o += r(430, 120, 340, 280, 'url(#mv-espelho)', ' rx="24"') + '<path d="M470 380L640 140h50L520 380z" fill="#fff" opacity=".18"/>';
      // Nicho
      o += r(920, 170, 140, 400, 'url(#mv-s)') + r(934, 184, 112, 372, 'rgba(0,0,0,.14)');
      [304, 430].forEach(function (yy) { o += r(934, yy, 112, 10, 'url(#mv-s)'); });
      o += led(934, 184, 112);
      o += r(950, 262, 34, 42, '#EDE8E0', ' rx="17"') + r(990, 270, 40, 34, '#DCD2C3', ' rx="17"') + r(952, 390, 18, 40, '#F2EEE7', ' rx="4"') + r(976, 398, 16, 32, '#BFAF98', ' rx="4"') + planta(1010, 556);
      // Bancada, cuba de apoio e torneira
      o += tampo(330, 452, 540, 20);
      o += '<path d="M512 452q0-34 88-34t88 34z" fill="#FBFAF8"/><path d="M512 452q0-34 88-34t88 34" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="2"/>';
      o += '<path d="M650 452V398q0-10-10-10h-26" fill="none" stroke="#7A7A7A" stroke-width="5" stroke-linecap="round"/>';
      // Gabinete suspenso
      o += porta(336, 472, 264, 128, 'p', 't') + porta(600, 472, 264, 128, 'p', 't') + sombra(600, 640, 260);
      o += planta(250, 640);
      return o;
    }
  };

  /* ---------- Interface ---------- */
  var el = {
    palco: raiz.querySelector('.monte__palco'),
    controles: raiz.querySelector('.monte__controles'),
    prontas: raiz.querySelector('.monte__prontas'),
    resumo: raiz.querySelector('.monte__resumo'),
    aviso: raiz.querySelector('.monte__aviso')
  };

  // emPt = true: versão em português, para a mensagem que chega à dona.
  function descricao(emPt) {
    var tr = emPt ? function (x) { return x; } : T;
    var a = AMB[estado.amb];
    var nomeMat = function (k) { var m = MAT[k]; return m.marca ? 'MDF ' + m.nome + ' (' + m.marca + ')' : tr(m.nome); };
    return [tr(a.nome), tr(a.rot[0]) + ': ' + nomeMat(estado.p), tr(a.rot[1]) + ': ' + nomeMat(estado.s), tr(a.rot[2]) + ': ' + tr(TAMPO[estado.t].nome),
      emPt ? 'Puxador: ' + PUX[estado.h].nome : T('Puxador: {m}', { m: T(PUX[estado.h].nome) }), tr(estado.led ? 'Com fita de LED' : 'Sem LED')];
  }

  function desenhar() {
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + T('Ilustração: {d}', { d: descricao().join(', ') }).replace(/"/g, '') + '" preserveAspectRatio="xMidYMid slice">' +
      defs() + CENAS[estado.amb]() + '</svg>';
    el.palco.innerHTML = svg; // só conteúdo nosso, sem nada digitado pela pessoa
    el.palco.classList.remove('troca'); void el.palco.offsetWidth; el.palco.classList.add('troca');
    el.resumo.textContent = '';
    descricao().forEach(function (t, i) { var s = document.createElement('span'); s.textContent = t; if (i === 0) s.className = 'monte__resumo-amb'; el.resumo.appendChild(s); });
    marcarControles();
  }

  function grupo(titulo, chave, itens, comAmostra) {
    var g = document.createElement('div');
    g.className = 'monte__grupo';
    var h = document.createElement('p'); h.className = 'monte__rotulo'; h.textContent = titulo; h.id = 'mt-' + chave;
    var l = document.createElement('div'); l.className = 'monte__opcoes' + (comAmostra ? ' monte__opcoes--amostras' : '');
    l.setAttribute('role', 'radiogroup'); l.setAttribute('aria-labelledby', h.id);
    Object.keys(itens).forEach(function (k) {
      var it = itens[k], b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.chave = chave; b.dataset.valor = k;
      if (comAmostra) {
        b.className = 'amostra amostra--' + (it.tipo || 'laca');
        b.style.setProperty('--cor', it.cor || '#ddd');
        b.setAttribute('aria-label', T(it.nome));
        var n = document.createElement('span'); n.className = 'amostra__nome'; n.textContent = T(it.nome); b.appendChild(n);
      } else {
        b.className = 'monte__pilula'; b.textContent = T(it.nome);
      }
      b.addEventListener('click', function () { estado[chave] = k; desenhar(); });
      l.appendChild(b);
    });
    g.appendChild(h); g.appendChild(l);
    return g;
  }

  function montarControles() {
    el.controles.textContent = '';
    var a = AMB[estado.amb];
    el.controles.appendChild(grupo(T('Ambiente'), 'amb', AMB, false));
    var visiveis = {};
    CURADOS.concat([estado.p, estado.s]).forEach(function (k) { if (MAT[k]) visiveis[k] = MAT[k]; });
    el.controles.appendChild(grupo(T(a.rot[0]), 'p', visiveis, true));
    el.controles.appendChild(grupo(T(a.rot[1]), 's', visiveis, true));
    el.controles.appendChild(grupo(T(a.rot[2]), 't', TAMPO, true));
    el.controles.appendChild(grupo(T('Puxador'), 'h', PUX, false));
    var g = document.createElement('div'); g.className = 'monte__grupo monte__grupo--led';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'interruptor'; b.setAttribute('role', 'switch');
    b.innerHTML = '<span class="interruptor__trilho"><span></span></span><span class="interruptor__texto"></span>';
    b.querySelector('.interruptor__texto').textContent = T('Fita de LED');
    b.addEventListener('click', function () { estado.led = estado.led ? 0 : 1; desenhar(); });
    g.appendChild(b); el.controles.appendChild(g);
  }

  function marcarControles() {
    // Rótulos dos acabamentos mudam com o ambiente (portas × gabinete × ripado…)
    var a = AMB[estado.amb], rot = el.controles.querySelectorAll('.monte__rotulo');
    if (rot[1]) rot[1].textContent = T(a.rot[0]);
    if (rot[2]) rot[2].textContent = T(a.rot[1]);
    if (rot[3]) rot[3].textContent = T(a.rot[2]);
    el.controles.querySelectorAll('[role="radio"]').forEach(function (b) {
      var sel = String(estado[b.dataset.chave]) === b.dataset.valor;
      b.setAttribute('aria-checked', sel ? 'true' : 'false');
      b.tabIndex = sel ? 0 : -1;
    });
    var sw = el.controles.querySelector('.interruptor'); if (sw) sw.setAttribute('aria-checked', estado.led ? 'true' : 'false');
    el.prontas.querySelectorAll('.pronta').forEach(function (b, i) {
      var e = PRONTAS[i].e, igual = Object.keys(e).every(function (k) { return String(e[k]) === String(estado[k]); });
      b.setAttribute('aria-pressed', igual ? 'true' : 'false');
    });
  }

  // Setas do teclado dentro de cada grupo de opções (padrão de radiogroup).
  el.controles.addEventListener('keydown', function (e) {
    var b = e.target.closest('[role="radio"]'); if (!b) return;
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].indexOf(e.key) === -1) return;
    e.preventDefault();
    var irmaos = Array.prototype.slice.call(b.parentNode.children);
    var i = irmaos.indexOf(b) + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1);
    var alvo = irmaos[(i + irmaos.length) % irmaos.length];
    alvo.click(); alvo.focus();
  });

  function montarProntas() {
    el.prontas.textContent = '';
    PRONTAS.forEach(function (pr) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'pronta'; b.setAttribute('aria-pressed', 'false');
      var cores = document.createElement('span'); cores.className = 'pronta__cores'; cores.setAttribute('aria-hidden', 'true');
      [MAT[pr.e.p].cor, MAT[pr.e.s].cor, TAMPO[pr.e.t].cor].forEach(function (c) { var i = document.createElement('i'); i.style.background = c; cores.appendChild(i); });
      var t = document.createElement('b'); t.textContent = T(pr.nome);
      var n = document.createElement('small'); n.textContent = T(AMB[pr.e.amb].nome) + ' · ' + T(pr.nota);
      b.appendChild(cores); b.appendChild(t); b.appendChild(n);
      b.addEventListener('click', function () { Object.assign(estado, pr.e); desenhar(); });
      el.prontas.appendChild(b);
    });
  }

  /* ---------- Compartilhar e enviar ---------- */
  var ORDEM = ['amb', 'p', 's', 't', 'h', 'led'];
  function codigo() { return ORDEM.map(function (k) { return estado[k]; }).join('-'); }
  function lerCodigo(c) {
    var v = String(c || '').split('-');
    if (v.length !== 6 || !AMB[v[0]] || !MAT[v[1]] || !MAT[v[2]] || !TAMPO[v[3]] || !PUX[v[4]]) return false;
    estado = { amb: v[0], p: v[1], s: v[2], t: v[3], h: v[4], led: v[5] === '1' ? 1 : 0 };
    return true;
  }

  function avisar(texto) {
    el.aviso.textContent = texto;
    el.aviso.classList.add('visivel');
    clearTimeout(avisar.t); avisar.t = setTimeout(function () { el.aviso.classList.remove('visivel'); }, 2600);
  }

  raiz.querySelector('[data-monte="compartilhar"]').addEventListener('click', function () {
    var url = location.origin + location.pathname + '#monte=' + codigo();
    var feito = function () { avisar(T('Link copiado. É só colar no WhatsApp.')); };
    if (navigator.share && matchMedia('(pointer: coarse)').matches) {
      navigator.share({ title: T('Minha combinação na Madê'), text: descricao().join(' · '), url: url }).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(feito, function () { prompt(T('Copie o link:'), url); });
    else prompt(T('Copie o link:'), url);
  });

  raiz.querySelector('[data-monte="enviar"]').addEventListener('click', function () {
    if (window.MadeOrcamento) window.MadeOrcamento.abrir({ combinacao: descricao().join(' · '), combinacaoPt: descricao(true).join(' · ') });
  });

  // API para outros módulos (testes, link da bio)
  window.MadeMonte = {
    estado: function () { return Object.assign({}, estado); }, descricao: descricao, codigo: codigo,
    // Vem do explorador "Escolha seu MDF": slot 'p' (portas) ou 's' (aéreos/painéis).
    aplicarMDF: function (slot, item) {
      if (!MAT[item.id]) MAT[item.id] = { nome: item.nome, cor: item.cor, tipo: window.MadeCatalogoMDF.tipoDesenho(item.familia), marca: item.marca, linha: item.linha };
      estado[slot === 's' ? 's' : 'p'] = item.id;
      montarControles(); desenhar();
    }
  };

  /* ---------- Início ---------- */
  var hash = location.hash || '';
  if (hash.indexOf('#monte=') === 0) lerCodigo(decodeURIComponent(hash.slice(7)));
  montarProntas();
  montarControles();
  desenhar();
  document.addEventListener('made:idioma', function () { montarProntas(); montarControles(); desenhar(); });
  if (hash.indexOf('#monte') === 0) setTimeout(function () { raiz.scrollIntoView({ behavior: 'auto', block: 'start' }); }, 50);
})();
