/* ============================================================
   Pixel da Meta (anúncios no Instagram/Facebook) — SÓ COM CONSENTIMENTO.

   Pedido do Lucas em 13/11/2026: a agência de marketing da Madê mandou o
   código padrão da Meta. Ele NÃO foi colado no <head>; foi reescrito aqui
   para seguir a LGPD e não vazar o que a pessoa responde no site:

   - Nada da Meta carrega antes do "Aceitar" no aviso de cookies. Recusou
     ou ignorou → nenhum script, nenhum cookie, nenhuma requisição.
   - autoConfig desligado: sem ele, o pixel grava o TEXTO dos botões
     clicados — no "Comece seu projeto" isso seria cidade, segmento e faixa
     de investimento indo para a Meta.
   - Sem correspondência avançada (nenhum nome, e-mail ou telefone).
   - Sem o <noscript><img> do código original (dispararia sem aceite).

   Eventos: PageView aqui; Contact em /falar/ (clique em qualquer botão de
   WhatsApp, com o rótulo do botão — heroi, barra, chat…). Ver falar/index.html.

   O ID mora em <body data-pixel> (decisão 7: dado da casa num lugar só).
   Vazio = desligado. A escolha da pessoa fica em localStorage 'made:cookies'
   ('aceito' | 'recusado'); o link "Preferências de cookies" do rodapé
   ([data-cookies]) reabre o aviso. Política: privacidade/.

   Só dispara no domínio da casa (localhost, github.io e robô de teste não
   contam). Para testar fora dele: ?pixel-teste na URL.
   ============================================================ */
(function () {
  'use strict';

  var DOMINIO = 'www.mademarcenaria.com';
  var CHAVE = 'made:cookies';
  var ID = ((document.body && document.body.getAttribute('data-pixel')) || '').replace(/\D/g, '');

  function ler() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function gravar(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }

  var podeDisparar = !!ID && !navigator.webdriver &&
    (location.hostname === DOMINIO || /[?&]pixel-teste\b/.test(location.search));

  var carregado = false;
  function carregar() {
    if (carregado || !podeDisparar) return;
    carregado = true;
    /* Carregador oficial da Meta (o mesmo do código da agência), sem alteração de lógica. */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('set', 'autoConfig', false, ID);
    window.fbq('init', ID);
    window.fbq('track', 'PageView');
  }

  /* ---------- Aviso de cookies ---------- */
  // Raiz do site a partir do próprio <script src> ("assets/…" ou "../assets/…"):
  // caminho relativo funciona no domínio e na prévia (decisão 29).
  var eu = document.querySelector('script[src$="assets/pixel.js"]');
  var BASE = eu ? eu.getAttribute('src').replace(/assets\/pixel\.js$/, '') : '';

  var CSS =
    '.cookies{position:fixed;z-index:9000;left:16px;bottom:16px;max-width:420px;background:#1C1917;color:#F4EFE7;' +
    'border:1px solid rgb(244 239 231 / .14);border-radius:8px;padding:18px 18px 16px;box-shadow:0 18px 50px -12px rgb(0 0 0 / .5);' +
    'font:400 .88rem/1.5 Inter,"Segoe UI",system-ui,-apple-system,sans-serif}' +
    '.cookies p{margin:0 0 14px}.cookies a{color:#D9C3A1;text-decoration:underline;text-underline-offset:2px}' +
    '.cookies__acoes{display:flex;gap:10px}' +
    '.cookies button{flex:1;font:600 .74rem/1 Inter,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;' +
    'padding:13px 14px;border-radius:999px;cursor:pointer;border:1px solid #F4EFE7}' +
    '.cookies__nao{background:transparent;color:#F4EFE7}.cookies__sim{background:#F4EFE7;color:#1C1917}' +
    '.cookies button:focus-visible{outline:2px solid #D9C3A1;outline-offset:2px}' +
    '@media (max-width:599px){.cookies{left:10px;right:10px;bottom:10px;max-width:none}}';

  var aviso = null;
  function fechar() { if (aviso) { aviso.remove(); aviso = null; } }

  function mostrar() {
    if (aviso || !ID) return;
    if (!document.getElementById('cookies-css')) {
      var st = document.createElement('style'); st.id = 'cookies-css'; st.textContent = CSS; document.head.appendChild(st);
    }
    aviso = document.createElement('div');
    aviso.className = 'cookies';
    aviso.setAttribute('role', 'region');
    aviso.setAttribute('aria-label', 'Aviso de cookies');
    var p = document.createElement('p');
    var txt = document.createElement('span');
    txt.textContent = 'Usamos cookies da Meta (Instagram e Facebook) para medir nossos anúncios. Só ativamos se você aceitar.';
    var link = document.createElement('a');
    link.href = BASE + 'privacidade/';
    link.textContent = 'Política de privacidade';
    p.appendChild(txt); p.appendChild(document.createTextNode(' ')); p.appendChild(link);
    var acoes = document.createElement('div'); acoes.className = 'cookies__acoes';
    var nao = document.createElement('button'); nao.type = 'button'; nao.className = 'cookies__nao'; nao.textContent = 'Recusar';
    var sim = document.createElement('button'); sim.type = 'button'; sim.className = 'cookies__sim'; sim.textContent = 'Aceitar';
    nao.addEventListener('click', function () { gravar('recusado'); fechar(); });
    sim.addEventListener('click', function () { gravar('aceito'); fechar(); carregar(); });
    acoes.appendChild(nao); acoes.appendChild(sim);
    aviso.appendChild(p); aviso.appendChild(acoes);
    document.body.appendChild(aviso);
    if (window.MadeI18n) window.MadeI18n.aplicar(aviso);
  }

  // Reabrir pelo rodapé. Quem tinha aceitado e agora recusa: o pixel já
  // carregado só some ao recarregar — recarrega.
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-cookies]');
    if (!b) return;
    ev.preventDefault();
    var antes = ler();
    fechar(); mostrar();
    if (antes === 'aceito' && aviso) {
      aviso.querySelector('.cookies__nao').addEventListener('click', function () { location.reload(); });
    }
  });

  if (!ID) return;
  var escolha = ler();
  if (escolha === 'aceito') carregar();
  else if (escolha !== 'recusado') mostrar();

  window.MadePixel = { carregar: carregar, mostrar: mostrar, escolha: ler, ativo: podeDisparar };
})();
