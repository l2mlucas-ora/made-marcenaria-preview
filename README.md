# Madê Marcenaria — site

Site institucional da **Madê Marcenaria** (ambientes planejados em Garopaba, Imbituba e região, SC). HTML, CSS e JavaScript puros, sem build: publicar é `git push` (GitHub Pages).

- `index.html` — o site (uma página).
- `links/` — link da bio do Instagram (`noindex`).
- `falar/` — passagem de todo botão de WhatsApp: conta a visita e segue para o `wa.me`.
- `assets/styles.css` — fonte da verdade visual (tokens no topo).
- `assets/site.js` — menu, topo fixo, revelação, filtro da galeria, lightbox. Sem biblioteca.
- `assets/medir.js` — Cloudflare Web Analytics; token vazio = desligado.

Rodar local: `python -m http.server 8093 --directory .` → http://localhost:8093

Site por [Extrema Consultoria](https://extremaconsultoria.com.br).
