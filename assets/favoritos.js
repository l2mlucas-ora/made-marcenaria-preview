/* ============================================================
   Madê Marcenaria — moodboard (fotos curtidas)

   Cada foto do mosaico tem um coração. O que a pessoa curte vira o
   "seu moodboard": um contador flutuante, e a lista vai junto na
   mensagem do pré-orçamento ("Referências que curti: Verde-sálvia,
   Banco ripado"). É o jeito mais curto de a dona saber o gosto do
   cliente antes da primeira conversa.

   Fica só no navegador de quem visita (localStorage, com try/catch:
   aba privada ou armazenamento bloqueado = funciona só nesta visita).
   Nada vai para servidor nenhum.
   ============================================================ */
(function () {
  'use strict';

  var CHAVE = 'made:moodboard';
  var CORACAO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3s-7.6-4.6-9.2-9.4C1.6 7.3 3.9 4 7.3 4c2 0 3.6 1.1 4.7 2.6C13.1 5.1 14.7 4 16.7 4c3.4 0 5.7 3.3 4.5 6.9-1.6 4.8-9.2 9.4-9.2 9.4z"/></svg>';

  function T(txt, vars) {
    if (window.MadeI18n) return window.MadeI18n.t(txt, vars);
    if (vars) Object.keys(vars).forEach(function (k) { txt = txt.split('{' + k + '}').join(vars[k]); });
    return txt;
  }
  var lista = [];
  try { lista = JSON.parse(localStorage.getItem(CHAVE) || '[]'); if (!Array.isArray(lista)) lista = []; } catch (e) { lista = []; }
  function gravar() { try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch (e) {} }

  var pecas = document.querySelectorAll('.peca');
  if (!pecas.length) return;

  // Contador flutuante
  var chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'moodboard';
  chip.setAttribute('aria-live', 'polite');
  chip.setAttribute('data-sem-traducao', '');
  chip.innerHTML = CORACAO + '<span class="moodboard__texto"></span>';
  document.body.appendChild(chip);
  chip.addEventListener('click', function () {
    if (window.MadeOrcamento) window.MadeOrcamento.abrir({});
  });

  function atualizarChip(pulsar) {
    var n = lista.length;
    chip.querySelector('.moodboard__texto').textContent = n === 1 ? T('1 no seu moodboard · enviar') : T('{n} no seu moodboard · enviar', { n: n });
    chip.classList.toggle('visivel', n > 0);
    if (pulsar) { chip.classList.remove('pulsa'); void chip.offsetWidth; chip.classList.add('pulsa'); }
  }

  pecas.forEach(function (peca) {
    var elTitulo = peca.querySelector('figcaption b');
    // Sempre o título em português (a página pode já estar em inglês/espanhol).
    var titulo = elTitulo ? (window.MadeI18n ? window.MadeI18n.original(elTitulo) : elTitulo.textContent.trim()) : '';
    if (!titulo) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'curtir';
    b.setAttribute('data-sem-traducao', '');
    b.innerHTML = CORACAO;
    var marcar = function () {
      var sim = lista.indexOf(titulo) !== -1;
      b.setAttribute('aria-pressed', sim ? 'true' : 'false');
      b.setAttribute('aria-label', T(sim ? 'Tirar do moodboard: {t}' : 'Curtir e guardar no moodboard: {t}', { t: T(titulo) }));
    };
    b.addEventListener('click', function () {
      var i = lista.indexOf(titulo);
      if (i === -1) lista.push(titulo); else lista.splice(i, 1);
      gravar(); marcar(); atualizarChip(i === -1);
    });
    marcar();
    document.addEventListener('made:idioma', marcar);
    peca.appendChild(b);
  });
  atualizarChip(false);
  document.addEventListener('made:idioma', function () { atualizarChip(false); });

  window.MadeFavoritos = {
    lista: function () { return lista.slice(); },
    tem: function (nome) { return lista.indexOf(nome) !== -1; },
    // Itens que não são foto do mosaico (ex.: um padrão de MDF do catálogo).
    alternar: function (nome) {
      var i = lista.indexOf(nome);
      if (i === -1) lista.push(nome); else lista.splice(i, 1);
      gravar(); atualizarChip(i === -1);
      return i === -1;
    }
  };
})();
