/* ============================================================
   Medição de acesso — Cloudflare Web Analytics.

   Sem cookie e sem dado pessoal: conta visitas, páginas, origem e país.
   Não precisa de aviso de consentimento, e nada aqui identifica quem visita.

   O token mora só aqui. Vem do painel da Cloudflare:
   Analytics & Logs → Web Analytics → <domínio> → JS snippet
   (o valor de "token" dentro de data-cf-beacon). Não é segredo: ele sai
   em toda página que o usa. Vazio = medição desligada, site segue.

   O "Automatic setup" do painel não serve: ele injeta o script pelo proxy
   da Cloudflare, e o DNS aqui é "DNS only" de propósito (sem isso o GitHub
   Pages não emite o HTTPS).

   Clique no WhatsApp não é evento (a Cloudflare não tem evento
   personalizado): todo botão passa por /falar/, que conta como página e
   segue para o wa.me. Ver falar/index.html.
   ============================================================ */
(function () {
  var TOKEN = '';
  // Domínio da casa (CLAUDE.md, "Domínio"): só ele conta visita.
  var DOMINIO = 'www.mademarcenaria.com';

  if (!TOKEN) return;
  // Localhost, pré-visualização e o endereço do github.io não contam.
  if (location.hostname !== DOMINIO) return;
  // Robôs de teste também não (capturar.mjs): cada captura seria uma visita falsa.
  if (navigator.webdriver) return;

  var s = document.createElement('script');
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  // spa: false — /falar/ troca o endereço com replaceState, que o modo SPA
  // contaria como outra visita.
  s.setAttribute('data-cf-beacon', JSON.stringify({ token: TOKEN, spa: false }));
  document.head.appendChild(s);
  // /falar/ usa isto para saber se há medição a esperar.
  window.medidor = s;
})();
