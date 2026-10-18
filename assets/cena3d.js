/* ============================================================
   Madê Marcenaria — 3D de verdade (Three.js, hospedado no site)

   Substitui as ilustrações chapadas por cenas 3D com luz, sombra e
   reflexo, que o cliente gira arrastando:
   - "MDF premium": um armário com o padrão escolhido;
   - "Monte seu ambiente": cozinha, quarto e closet, área gourmet e
     banheiro, com os acabamentos da combinação.

   Como fica leve:
   - O Three.js (assets/vendor/three, MIT) só é baixado quando a pessoa
     chega perto dessas seções (import dinâmico) — a capa não paga nada.
   - Desenha sob demanda: só quando algo muda ou a pessoa gira; parado,
     não gasta bateria. Fora da tela, nem isso.
   - Texturas (veio de madeira, trama, pedra) são geradas aqui, em canvas,
     a partir da cor do padrão — nenhuma imagem extra para baixar.

   Sem WebGL (aparelho antigo, navegador bloqueando), nada acontece: a
   ilustração SVG de antes continua lá.

   As cores do MDF são aproximadas (o site diz isso); o 3D é inspiração,
   não projeto executivo.
   ============================================================ */

function temWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch (e) { return false; }
}

const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const T = (txt) => (window.MadeI18n ? window.MadeI18n.t(txt) : txt);

let libs = null;
async function carregar() {
  if (libs) return libs;
  const THREE = await import('three');
  const { OrbitControls } = await import('three/addons/OrbitControls.js');
  const { RoomEnvironment } = await import('three/addons/RoomEnvironment.js');
  const { RoundedBoxGeometry } = await import('three/addons/RoundedBoxGeometry.js');
  libs = { THREE, OrbitControls, RoomEnvironment, RoundedBoxGeometry };
  return libs;
}

/* ---------- Sorteio com semente: a mesma madeira sai sempre igual ---------- */
function sorteio(semente) {
  let a = semente >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* ---------- Texturas em canvas ---------- */
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function ruido(ctx, w, h, R, forca) {
  const img = ctx.getImageData(0, 0, w, h), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (R() - 0.5) * forca; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  ctx.putImageData(img, 0, 0);
}

// Veio de madeira vertical (portas). Faixas de tom + fibras onduladas + "catedrais" + poros.
function canvasMadeira(cor) {
  const w = 512, h = 1024, c = canvas(w, h), ctx = c.getContext('2d'), R = sorteio(hash(cor));
  ctx.fillStyle = cor; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 16; i++) {
    const x = R() * w, bw = 20 + R() * 90, a = 0.04 + R() * 0.09;
    const g = ctx.createLinearGradient(x - bw, 0, x + bw, 0);
    const tom = R() < 0.55 ? `rgba(30,15,5,${a})` : `rgba(255,245,230,${a * 0.8})`;
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, tom); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - bw, 0, bw * 2, h);
  }
  for (let i = 0; i < 280; i++) {
    const x = R() * w, amp = 2 + R() * 9, f = 0.003 + R() * 0.009, fase = R() * 6.28, deriva = (R() - 0.5) * 34;
    ctx.beginPath();
    for (let y = 0; y <= h; y += 8) { const xx = x + Math.sin(y * f + fase) * amp + deriva * (y / h); y ? ctx.lineTo(xx, y) : ctx.moveTo(xx, y); }
    ctx.strokeStyle = `rgba(45,22,6,${0.04 + R() * 0.15})`; ctx.lineWidth = 0.4 + R() * 1.7; ctx.stroke();
  }
  for (let k = 0; k < 3; k++) {
    const cx = R() * w, cy = R() * h;
    for (let j = 0; j < 11; j++) {
      ctx.beginPath(); ctx.ellipse(cx, cy, 7 + j * 7, 70 + j * 26, 0, Math.PI * 1.06, Math.PI * 1.94);
      ctx.strokeStyle = `rgba(45,22,6,${0.04 + R() * 0.08})`; ctx.lineWidth = 1; ctx.stroke();
    }
  }
  ruido(ctx, w, h, R, 12);
  return c;
}

function canvasLaca(cor) {
  const c = canvas(256, 256), ctx = c.getContext('2d'), R = sorteio(hash(cor + 'l'));
  ctx.fillStyle = cor; ctx.fillRect(0, 0, 256, 256); ruido(ctx, 256, 256, R, 5); return c;
}

function canvasTrama(cor) {
  const c = canvas(512, 512), ctx = c.getContext('2d'), R = sorteio(hash(cor + 't'));
  ctx.fillStyle = cor; ctx.fillRect(0, 0, 512, 512);
  for (let i = -512; i < 512; i += 4) {
    ctx.strokeStyle = `rgba(0,0,0,${0.05 + R() * 0.05})`; ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 512, 512); ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${0.03 + R() * 0.03})`; ctx.beginPath(); ctx.moveTo(i + 512, 0); ctx.lineTo(i, 512); ctx.stroke();
  }
  ruido(ctx, 512, 512, R, 14); return c;
}

function canvasSaoGabriel(cor) {
  const c = canvas(1024, 256), ctx = c.getContext('2d'), R = sorteio(91);
  ctx.fillStyle = cor; ctx.fillRect(0, 0, 1024, 256);
  for (let i = 0; i < 2600; i++) { const x = R() * 1024, y = R() * 256, r = 0.4 + R() * 1.6; ctx.fillStyle = `rgba(${200 + R() * 55},${200 + R() * 55},${200 + R() * 55},${0.15 + R() * 0.45})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.28); ctx.fill(); }
  ruido(ctx, 1024, 256, R, 10); return c;
}

function canvasQuartzo(cor) {
  const c = canvas(1024, 256), ctx = c.getContext('2d'), R = sorteio(17);
  ctx.fillStyle = cor; ctx.fillRect(0, 0, 1024, 256);
  for (let i = 0; i < 9; i++) {
    ctx.beginPath(); let x = R() * 1024, y = R() * 256; ctx.moveTo(x, y);
    for (let k = 0; k < 6; k++) { x += 60 + R() * 120; y += (R() - 0.5) * 90; ctx.quadraticCurveTo(x - 50, y + (R() - 0.5) * 60, x, y); }
    ctx.strokeStyle = `rgba(120,115,110,${0.06 + R() * 0.08})`; ctx.lineWidth = 0.6 + R() * 1.6; ctx.stroke();
  }
  ruido(ctx, 1024, 256, R, 6); return c;
}

function canvasPedraParede() {
  const c = canvas(1024, 1024), ctx = c.getContext('2d'), R = sorteio(42);
  ctx.fillStyle = '#5E5852'; ctx.fillRect(0, 0, 1024, 1024);
  for (let y = 0; y < 1024; y += 56) {
    let x = -R() * 60;
    while (x < 1024) {
      const w = 70 + R() * 110, t = 120 + Math.round(R() * 70);
      ctx.fillStyle = `rgb(${t},${t - 4},${t - 11})`;
      const r = 10; ctx.beginPath(); ctx.roundRect(x + 4, y + 4, w - 8, 48, r); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(x + 8, y + 6, w - 16, 6);
      x += w;
    }
  }
  ruido(ctx, 1024, 1024, R, 26); return c;
}

function canvasAzulejo(base, junta, n) {
  const c = canvas(1024, 1024), ctx = c.getContext('2d'), R = sorteio(7);
  ctx.fillStyle = base; ctx.fillRect(0, 0, 1024, 1024); ruido(ctx, 1024, 1024, R, 6);
  ctx.fillStyle = junta; const p = 1024 / n;
  for (let i = 0; i <= n; i++) { ctx.fillRect(i * p - 1.5, 0, 3, 1024); ctx.fillRect(0, i * p - 1.5, 1024, 3); }
  return c;
}

/* ============================================================
   Palco: renderizador + cena + câmera + controles, sob demanda
   ============================================================ */
class Palco {
  constructor(L, alvo, opcoes) {
    const { THREE, OrbitControls, RoomEnvironment } = L;
    this.L = L; this.alvo = alvo; this.op = opcoes;
    this.cacheTex = new Map(); this.cacheMat = new Map();

    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.02;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.domElement.className = 'palco3d';
    r.domElement.setAttribute('aria-hidden', 'true');
    alvo.appendChild(r.domElement);

    const cena = this.cena = new THREE.Scene();
    cena.background = new THREE.Color('#E9E2D7');
    const pmrem = new THREE.PMREMGenerator(r);
    cena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    cena.environmentIntensity = 0.55;

    cena.add(new THREE.HemisphereLight(0xfff4e6, 0x8a7a68, 0.35));
    const sol = this.sol = new THREE.DirectionalLight(0xfff0dc, 2.3);
    sol.position.set(-2.6, 4.2, 4.4); sol.castShadow = true;
    sol.shadow.mapSize.set(2048, 2048); sol.shadow.bias = -0.0004; sol.shadow.normalBias = 0.02; sol.shadow.radius = 4;
    Object.assign(sol.shadow.camera, { left: -4, right: 4, top: 4, bottom: -2, near: 0.5, far: 14 });
    cena.add(sol);
    const preenchimento = new THREE.DirectionalLight(0xe4ecff, 0.35); preenchimento.position.set(3, 2, 3); cena.add(preenchimento);

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.05, 40);
    const ctl = this.controles = new OrbitControls(this.camera, r.domElement);
    ctl.enablePan = false; ctl.enableDamping = !reduzido; ctl.dampingFactor = 0.08; ctl.rotateSpeed = 0.6;
    ctl.minPolarAngle = 1.0; ctl.maxPolarAngle = 1.62; ctl.minAzimuthAngle = -0.65; ctl.maxAzimuthAngle = 0.65;
    ctl.enableZoom = true; ctl.zoomSpeed = 0.6;
    ctl.addEventListener('change', () => this.pedir());
    ctl.addEventListener('start', () => alvo.classList.add('girou'));

    this.grupo = null; this.visivel = true; this.pedido = false;
    new ResizeObserver(() => this.ajustar()).observe(alvo);
    new IntersectionObserver((e) => { this.visivel = e[0].isIntersecting; if (this.visivel) this.pedir(); }).observe(alvo);
    this.ajustar();

    // Dica de interação, uma vez
    const dica = document.createElement('span'); dica.className = 'giro-dica'; dica.setAttribute('aria-hidden', 'true');
    dica.textContent = T('Arraste para girar'); alvo.appendChild(dica); this.dica = dica;
    document.addEventListener('made:idioma', () => { dica.textContent = T('Arraste para girar'); });
    alvo.classList.add('tem-3d');
  }

  ajustar() {
    const w = this.alvo.clientWidth, h = this.alvo.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.pedir();
  }

  pedir() {
    if (this.pedido) return; this.pedido = true;
    requestAnimationFrame(() => {
      this.pedido = false;
      if (!this.visivel) return;
      const mexeu = this.controles.update();
      this.renderer.render(this.cena, this.camera);
      if (mexeu) this.pedir();
    });
  }

  enquadrar(pos, alvo) {
    this.camera.position.set(pos[0], pos[1], pos[2]);
    this.controles.target.set(alvo[0], alvo[1], alvo[2]);
    this.controles.update();
  }

  trocar(grupo) {
    if (this.grupo) {
      this.cena.remove(this.grupo);
      this.grupo.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    }
    this.grupo = grupo; this.cena.add(grupo); this.pedir();
  }

  /* ---------- texturas e materiais (com cache) ---------- */
  tex(tipo, cor, girar) {
    const { THREE } = this.L, k = tipo + cor + (girar ? 'h' : 'v');
    if (this.cacheTex.has(k)) return this.cacheTex.get(k);
    const fonte = { madeira: canvasMadeira, laca: canvasLaca, trama: canvasTrama, pedra: canvasSaoGabriel, 'pedra-clara': canvasQuartzo }[tipo] || canvasLaca;
    const t = new THREE.CanvasTexture(fonte(cor));
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    if (girar && tipo === 'madeira') { t.center.set(0.5, 0.5); t.rotation = Math.PI / 2; }
    this.cacheTex.set(k, t); return t;
  }

  mat(m, girar) {
    const { THREE } = this.L, k = m.tipo + m.cor + (girar ? 'h' : 'v');
    if (this.cacheMat.has(k)) return this.cacheMat.get(k);
    let mt;
    if (m.tipo === 'brilho') mt = new THREE.MeshPhysicalMaterial({ color: m.cor, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.2 });
    else if (m.tipo === 'madeira') mt = new THREE.MeshStandardMaterial({ map: this.tex('madeira', m.cor, girar), roughness: 0.5 });
    else if (m.tipo === 'trama') mt = new THREE.MeshStandardMaterial({ map: this.tex('trama', m.cor), roughness: 0.74 });
    else if (m.tipo === 'pedra') mt = new THREE.MeshStandardMaterial({ map: this.tex('pedra', m.cor), roughness: 0.36 });
    else if (m.tipo === 'pedra-clara') mt = new THREE.MeshPhysicalMaterial({ map: this.tex('pedra-clara', m.cor), roughness: 0.2, clearcoat: 0.4 });
    else mt = new THREE.MeshStandardMaterial({ map: this.tex('laca', m.cor), roughness: 0.62 });
    this.cacheMat.set(k, mt); return mt;
  }

  simples(cor, rug, metal, extra) {
    const { THREE } = this.L, k = 's' + cor + rug + metal + JSON.stringify(extra || {});
    if (this.cacheMat.has(k)) return this.cacheMat.get(k);
    const mt = new THREE.MeshStandardMaterial(Object.assign({ color: cor, roughness: rug, metalness: metal || 0 }, extra || {}));
    this.cacheMat.set(k, mt); return mt;
  }

  imagem(nome, fonte, repetir) {
    const { THREE } = this.L;
    if (this.cacheTex.has(nome)) return this.cacheTex.get(nome);
    const t = new THREE.CanvasTexture(fonte()); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    if (repetir) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repetir[0], repetir[1]); }
    this.cacheTex.set(nome, t); return t;
  }
}

/* ============================================================
   Peças de marcenaria (metros; parede em z = 0, frente para +z)
   ============================================================ */
function oficina(P) {
  const { THREE, RoundedBoxGeometry } = P.L;
  const g = new THREE.Group();

  const caixa = (w, h, d, mat, x, y0, z0, raio) => {
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, raio === undefined ? 0.004 : raio), mat);
    m.position.set(x, y0 + h / 2, z0 + d / 2); m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
  };

  const metalPux = (h) => {
    if (h === 'preto') return P.simples('#1E1D1C', 0.42, 0.5);
    if (h === 'dourado') return P.simples('#C9A35B', 0.26, 1);
    return P.simples('#C4C6C8', 0.34, 1);
  };

  // Porta: x0/y0 = canto inferior esquerdo; zf = plano da frente. pux: t, b, l, r.
  const porta = (x0, y0, w, h, mat, zf, pux, estiloPux) => {
    const folga = 0.003;
    caixa(w - folga * 2, h - folga * 2, 0.018, mat, x0 + w / 2, y0 + folga, zf - 0.018, 0.0025);
    if (!pux) return;
    if (estiloPux === 'cava') {
      const esc = P.simples('#151413', 0.8);
      if (pux === 't') caixa(w - 0.01, 0.012, 0.004, esc, x0 + w / 2, y0 + h - 0.02, zf - 0.002, 0.001);
      else if (pux === 'b') caixa(w - 0.01, 0.012, 0.004, esc, x0 + w / 2, y0 + 0.008, zf - 0.002, 0.001);
      else caixa(0.012, h - 0.01, 0.004, esc, pux === 'l' ? x0 + 0.008 : x0 + w - 0.008, y0 + 0.005, zf - 0.002, 0.001);
      return;
    }
    const mm = metalPux(estiloPux);
    if (pux === 't' || pux === 'b') {
      const L = Math.min(0.32, w * 0.6), y = pux === 't' ? y0 + h - 0.06 : y0 + 0.05;
      caixa(L, 0.012, 0.012, mm, x0 + w / 2, y, zf + 0.022, 0.005);
      caixa(0.01, 0.01, 0.024, mm, x0 + w / 2 - L / 2 + 0.03, y + 0.001, zf, 0.004);
      caixa(0.01, 0.01, 0.024, mm, x0 + w / 2 + L / 2 - 0.03, y + 0.001, zf, 0.004);
    } else {
      const L = Math.min(0.42, h * 0.38), x = pux === 'l' ? x0 + 0.05 : x0 + w - 0.05;
      caixa(0.012, L, 0.012, mm, x, y0 + h / 2 - L / 2, zf + 0.022, 0.005);
      caixa(0.01, 0.01, 0.024, mm, x, y0 + h / 2 - L / 2 + 0.03, zf, 0.004);
      caixa(0.01, 0.01, 0.024, mm, x, y0 + h / 2 + L / 2 - 0.04, zf, 0.004);
    }
  };

  // Fita de LED: barra que brilha + luzes quentes que lavam a superfície de baixo/cima
  const led = (x0, x1, y, z, ligado, paraCima) => {
    if (!ligado) return;
    const barra = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.006, 0.014), new THREE.MeshStandardMaterial({ color: '#fff3dc', emissive: '#ffd9a0', emissiveIntensity: 4 }));
    barra.position.set((x0 + x1) / 2, y, z); g.add(barra);
    const n = Math.max(2, Math.round((x1 - x0) / 0.7));
    for (let i = 0; i < n; i++) {
      const luz = new THREE.PointLight(0xffc98a, 0.55, 1.4, 1.6);
      luz.position.set(x0 + (i + 0.5) * (x1 - x0) / n, y + (paraCima ? 0.08 : -0.08), z + 0.06); g.add(luz);
    }
  };

  const parede = (cor, textura) => {
    const mat = textura ? new THREE.MeshStandardMaterial({ map: textura, roughness: 0.92 }) : P.simples(cor || '#EEE8DF', 0.95);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), mat); m.position.set(0, 2.5, 0); m.receiveShadow = true; g.add(m);
  };
  const piso = (textura) => {
    const mat = new THREE.MeshStandardMaterial({ map: textura, roughness: 0.55 });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), mat); m.rotation.x = -Math.PI / 2; m.position.set(0, 0, 4); m.receiveShadow = true; g.add(m);
  };
  const rodape = (x0, x1, z) => caixa(x1 - x0, 0.1, 0.02, P.simples('#2B2622', 0.7), (x0 + x1) / 2, 0, z - 0.06, 0.002);

  const planta = (x, y, z, esc) => {
    const s = esc || 1;
    const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * s, 0.055 * s, 0.14 * s, 24), P.simples('#BDA990', 0.85));
    vaso.position.set(x, y + 0.07 * s, z); vaso.castShadow = true; g.add(vaso);
    const folha = P.simples('#6B7C5A', 0.7);
    const R = sorteio(Math.round(x * 1000 + y * 100));
    for (let i = 0; i < 9; i++) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.05 * s, 12, 10), folha);
      f.scale.set(0.55, 1.6, 0.25);
      f.position.set(x + (R() - 0.5) * 0.12 * s, y + (0.2 + R() * 0.14) * s, z + (R() - 0.5) * 0.1 * s);
      f.rotation.set((R() - 0.5) * 0.8, R() * 3, (R() - 0.5) * 1.2); f.castShadow = true; g.add(f);
    }
  };

  const vasilha = (x, y, z, r, h, cor) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.92, h, 28), P.simples(cor, 0.5)); m.position.set(x, y + h / 2, z); m.castShadow = true; g.add(m); };

  return { g, caixa, porta, led, parede, piso, rodape, planta, vasilha, metalPux };
}

function pisoClaro(P) { return P.imagem('piso', () => canvasAzulejo('#D8CFC2', 'rgba(120,105,90,.35)', 4), [6, 5]); }

/* ---------- Cena: armário do explorador de MDF ---------- */
function cenaArmario(P, m) {
  const o = oficina(P); const mat = P.mat(m);
  o.parede('#EDE7DE'); o.piso(pisoClaro(P));
  const w = 1.5, h = 2.2, d = 0.58, x0 = -w / 2, zf = d;
  o.caixa(w, h - 0.1, d - 0.02, mat, 0, 0.1, 0);              // corpo
  o.rodape(x0, x0 + w, zf);
  const n = 3, pw = w / n;
  for (let i = 0; i < n; i++) o.porta(x0 + i * pw, 0.1, pw, h - 0.1, mat, zf + 0.001, i === 0 ? 'r' : 'l', 'escovado');
  o.planta(1.15, 0, 0.35, 1.6);
  return o.g;
}

/* ---------- Cenas do configurador ---------- */
const CENAS = {
  cozinha(P, s) {
    const o = oficina(P), mp = P.mat(s.p), ms = P.mat(s.s), mt = P.mat(s.t, true);
    o.parede('#EEE8DF'); o.piso(pisoClaro(P));
    // Torre quente
    o.caixa(0.62, 2.1, 0.58, mp, -1.42, 0.1, 0);
    o.porta(-1.73, 1.5, 0.62, 0.7, mp, 0.581, 'b', s.h);
    const vidro = new P.L.THREE.MeshPhysicalMaterial({ color: '#141414', roughness: 0.06, metalness: 0.2, clearcoat: 1 });
    o.caixa(0.56, 0.36, 0.02, vidro, -1.42, 1.1, 0.565, 0.004);
    o.caixa(0.56, 0.2, 0.02, vidro, -1.42, 0.86, 0.565, 0.004);
    o.caixa(0.46, 0.012, 0.012, o.metalPux('escovado'), -1.42, 1.41, 0.6, 0.005);
    o.porta(-1.73, 0.1, 0.62, 0.74, mp, 0.581, 't', s.h);
    o.rodape(-1.73, -1.11, 0.58);
    // Balcão
    o.caixa(2.8, 0.78, 0.56, mp, 0.3, 0.1, 0);
    for (let i = 0; i < 4; i++) o.porta(-1.1 + i * 0.7, 0.1, 0.7, 0.78, mp, 0.581, 't', s.h);
    o.rodape(-1.1, 1.7, 0.58);
    o.caixa(2.84, 0.03, 0.62, mt, 0.3, 0.88, 0, 0.003);
    // Cooktop e torneira
    o.caixa(0.6, 0.006, 0.5, vidro, 0.15, 0.91, 0.05, 0.004);
    const aco = o.metalPux('escovado');
    const tubo = new P.L.THREE.Mesh(new P.L.THREE.CylinderGeometry(0.012, 0.012, 0.32, 16), aco); tubo.position.set(1.15, 1.07, 0.18); tubo.castShadow = true; o.g.add(tubo);
    const arco = new P.L.THREE.Mesh(new P.L.THREE.TorusGeometry(0.08, 0.012, 12, 24, Math.PI), aco); arco.position.set(1.15, 1.23, 0.26); arco.rotation.y = Math.PI / 2; o.g.add(arco);
    // Aéreos + LED
    o.caixa(1.68, 0.7, 0.34, ms, -0.26, 1.45, 0);
    o.porta(-1.1, 1.45, 0.84, 0.7, ms, 0.341, 'b', s.h); o.porta(-0.26, 1.45, 0.84, 0.7, ms, 0.341, 'b', s.h);
    o.led(-1.08, 0.56, 1.444, 0.3, s.led);
    // Prateleiras abertas
    [1.5, 1.86].forEach((y) => { o.caixa(1.08, 0.03, 0.26, ms, 1.18, y, 0, 0.002); o.led(0.66, 1.7, y - 0.004, 0.22, s.led); });
    o.planta(0.86, 1.53, 0.12, 0.9); o.vasilha(1.08, 1.53, 0.12, 0.045, 0.16, '#E8E2D8'); o.vasilha(1.2, 1.53, 0.12, 0.04, 0.12, '#CBBFAE');
    o.caixa(0.26, 0.04, 0.18, P.simples('#8E7D69', 0.8), 1.5, 1.53, 0.04); o.caixa(0.22, 0.04, 0.17, P.simples('#B5A18A', 0.8), 1.5, 1.57, 0.05);
    o.vasilha(0.9, 1.89, 0.12, 0.06, 0.08, '#EFEAE2'); o.planta(1.55, 1.89, 0.12, 0.8);
    P.enquadrar([0.7, 1.55, 4.7], [0.05, 1.08, 0.3]);
    return o.g;
  },

  quarto(P, s) {
    const o = oficina(P), mp = P.mat(s.p), ms = P.mat(s.s), mt = P.mat(s.t, true);
    o.parede('#ECE5DB'); o.piso(pisoClaro(P));
    // Armário
    o.caixa(1.6, 2.3, 0.58, mp, -1.7, 0.1, 0);
    [['r'], ['l'], ['l']].forEach((p, i) => o.porta(-2.5 + i * 0.5334, 0.1, 0.5334, 2.3, mp, 0.581, p[0], s.h));
    o.rodape(-2.5, -0.9, 0.58);
    // Painel da cabeceira ripado + LED
    o.caixa(2.4, 1.5, 0.03, ms, 1.0, 0.0, 0);
    for (let x = -0.16; x < 2.18; x += 0.06) o.caixa(0.04, 1.5, 0.025, ms, x, 0.0, 0.03, 0.002);
    o.led(-0.18, 2.18, 1.505, 0.04, s.led, true);
    // Cama
    const tecido = P.simples('#D3CABD', 0.95), branco = P.simples('#F2EDE6', 0.9), manta = P.simples('#BFB3A2', 0.95);
    o.caixa(1.66, 0.32, 2.05, tecido, 1.0, 0.0, 0.06, 0.03);
    o.caixa(1.6, 0.24, 2.0, branco, 1.0, 0.32, 0.08, 0.06);
    o.caixa(0.62, 0.16, 0.34, branco, 0.62, 0.56, 0.12, 0.07); o.caixa(0.62, 0.16, 0.34, branco, 1.38, 0.56, 0.12, 0.07);
    o.caixa(1.66, 0.05, 0.9, manta, 1.0, 0.54, 1.16, 0.02);
    // Criados suspensos com tampo
    [-0.47, 2.47].forEach((x) => {
      o.caixa(0.46, 0.2, 0.4, mp, x, 0.42, 0.04);
      o.caixa(0.46, 0.02, 0.4, mt, x, 0.62, 0.04, 0.002);
      o.vasilha(x, 0.64, 0.24, 0.05, 0.18, '#E7DFD2');
      const cupula = new P.L.THREE.Mesh(new P.L.THREE.SphereGeometry(0.08, 20, 16), new P.L.THREE.MeshStandardMaterial({ color: '#F4EBDD', emissive: '#FFD9A0', emissiveIntensity: s.led ? 1.4 : 0 }));
      cupula.position.set(x, 0.9, 0.24); o.g.add(cupula);
      if (s.led) { const l = new P.L.THREE.PointLight(0xffc98a, 0.6, 1.6, 1.8); l.position.set(x, 0.92, 0.3); o.g.add(l); }
    });
    P.enquadrar([0.0, 1.55, 6.0], [0.0, 0.95, 0.6]);
    return o.g;
  },

  gourmet(P, s) {
    const o = oficina(P), mp = P.mat(s.p), ms = P.mat(s.s), mt = P.mat(s.t, true), T3 = P.L.THREE;
    o.parede('#ECE5DB'); o.piso(pisoClaro(P));
    // Parede de pedra com churrasqueira
    const pedra = new T3.MeshStandardMaterial({ map: P.imagem('pedra-parede', canvasPedraParede, [1.4, 2.6]), roughness: 0.95 });
    o.caixa(1.5, 2.6, 0.12, pedra, -1.55, 0, 0, 0.01);
    o.caixa(0.86, 0.6, 0.06, P.simples('#121110', 0.9), -1.55, 0.92, 0.08, 0.01);
    const brasa = new T3.Mesh(new T3.BoxGeometry(0.7, 0.04, 0.05), new T3.MeshStandardMaterial({ color: '#4a1a08', emissive: '#E8682A', emissiveIntensity: 2.2 }));
    brasa.position.set(-1.55, 0.97, 0.12); o.g.add(brasa);
    o.caixa(1.2, 0.04, 0.3, mt, -1.55, 0.86, 0.04, 0.003);
    // Balcão com portas ripadas
    o.caixa(2.6, 0.78, 0.56, P.simples('#2A2420', 0.8), 0.6, 0.1, 0);
    for (let x = -0.68; x < 1.89; x += 0.042) o.caixa(0.03, 0.74, 0.02, mp, x, 0.12, 0.565, 0.003);
    o.rodape(-0.7, 1.9, 0.58);
    o.caixa(2.64, 0.035, 0.62, mt, 0.6, 0.88, 0, 0.003);
    // Prateleiras + LED + objetos
    [1.45, 1.85].forEach((y) => { o.caixa(2.2, 0.035, 0.28, ms, 0.6, y, 0, 0.002); o.led(-0.48, 1.68, y - 0.004, 0.24, s.led); });
    const garrafa = (x, cor) => { const m = new T3.Mesh(new T3.CylinderGeometry(0.035, 0.035, 0.28, 20), new T3.MeshPhysicalMaterial({ color: cor, roughness: 0.1, transmission: 0, clearcoat: 1 })); m.position.set(x, 1.625, 0.12); m.castShadow = true; o.g.add(m); };
    garrafa(-0.3, '#2E3A27'); garrafa(-0.2, '#4A2A1A'); garrafa(-0.1, '#2C3326');
    o.vasilha(0.4, 1.485, 0.12, 0.09, 0.08, '#D8CCBA'); o.planta(1.3, 1.485, 0.12, 0.9); o.planta(0.0, 1.885, 0.12, 0.8); o.vasilha(0.9, 1.885, 0.12, 0.05, 0.14, '#EDE6DA');
    P.enquadrar([0.2, 1.55, 5.0], [0.1, 1.05, 0.3]);
    return o.g;
  },

  banheiro(P, s) {
    const o = oficina(P), mp = P.mat(s.p), ms = P.mat(s.s), mt = P.mat(s.t, true), T3 = P.L.THREE;
    o.parede(null, P.imagem('azulejo-parede', () => canvasAzulejo('#E9E3DA', 'rgba(150,140,128,.4)', 6), [3, 1.5]));
    o.piso(pisoClaro(P));
    // Espelho com LED atrás
    if (s.led) {
      const halo = new T3.Mesh(new T3.CircleGeometry(0.52, 64), new T3.MeshBasicMaterial({ color: '#FFDDA8', transparent: true, opacity: 0.85 }));
      halo.position.set(0, 1.55, 0.004); o.g.add(halo);
      const l = new T3.PointLight(0xffc98a, 0.9, 2.2, 1.6); l.position.set(0, 1.55, 0.15); o.g.add(l);
    }
    const espelho = new T3.Mesh(new T3.CylinderGeometry(0.46, 0.46, 0.02, 64), new T3.MeshStandardMaterial({ color: '#E3E9EC', metalness: 0.55, roughness: 0.08, envMapIntensity: 1.6 }));
    espelho.rotation.x = Math.PI / 2; espelho.position.set(0, 1.55, 0.03); o.g.add(espelho);
    // Gabinete suspenso + bancada + cuba de apoio
    o.caixa(1.2, 0.34, 0.5, mp, 0, 0.5, 0);
    o.porta(-0.6, 0.5, 0.6, 0.34, mp, 0.501, 't', s.h); o.porta(0, 0.5, 0.6, 0.34, mp, 0.501, 't', s.h);
    o.caixa(1.24, 0.03, 0.52, mt, 0, 0.84, 0, 0.003);
    const perfil = [[0, 0], [0.14, 0.005], [0.2, 0.04], [0.21, 0.12], [0.2, 0.125], [0.19, 0.05], [0.13, 0.015], [0, 0.012]].map((p) => new T3.Vector2(p[0], p[1]));
    const cuba = new T3.Mesh(new T3.LatheGeometry(perfil, 48), P.simples('#FBFAF8', 0.18)); cuba.position.set(0, 0.87, 0.24); cuba.castShadow = true; o.g.add(cuba);
    const aco = o.metalPux(s.h === 'dourado' ? 'dourado' : s.h === 'preto' ? 'preto' : 'escovado');
    const tubo = new T3.Mesh(new T3.CylinderGeometry(0.012, 0.012, 0.3, 16), aco); tubo.position.set(0.28, 1.02, 0.12); o.g.add(tubo);
    const bico = new T3.Mesh(new T3.CylinderGeometry(0.01, 0.01, 0.16, 16), aco); bico.rotation.x = Math.PI / 2; bico.position.set(0.28, 1.16, 0.2); o.g.add(bico);
    // Nicho
    // Nicho aberto: laterais, topo, base e fundo — dá para ver o que tem dentro.
    o.caixa(0.42, 1.2, 0.02, P.simples('#CFC6B9', 0.9), 1.2, 0.85, 0);
    o.caixa(0.03, 1.2, 0.16, ms, 1.005, 0.85, 0, 0.002); o.caixa(0.03, 1.2, 0.16, ms, 1.395, 0.85, 0, 0.002);
    o.caixa(0.42, 0.03, 0.16, ms, 1.2, 2.02, 0, 0.002); o.caixa(0.42, 0.03, 0.16, ms, 1.2, 0.85, 0, 0.002);
    [1.25, 1.62].forEach((y) => o.caixa(0.34, 0.025, 0.14, ms, 1.2, y, 0.0, 0.002));
    o.led(1.04, 1.36, 2.01, 0.1, s.led);
    o.vasilha(1.12, 1.275, 0.07, 0.05, 0.1, '#EDE8E0'); o.vasilha(1.27, 1.275, 0.07, 0.045, 0.1, '#DCD2C3'); o.vasilha(1.2, 1.645, 0.07, 0.03, 0.16, '#BFAF98');
    o.planta(-0.95, 0, 0.3, 1.5);
    P.enquadrar([0.35, 1.4, 3.9], [0.25, 1.1, 0.25]);
    return o.g;
  }
};

/* ============================================================
   Ligação com o configurador e com o explorador de MDF
   ============================================================ */
function quandoPerto(el, fn) {
  if (!('IntersectionObserver' in window)) { fn(); return; }
  const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { io.disconnect(); fn(); } }, { rootMargin: '700px 0px' });
  io.observe(el);
}

function iniciarMonte(palcoEl) {
  quandoPerto(palcoEl, async () => {
    let L; try { L = await carregar(); } catch (e) { return; }
    const P = new Palco(L, palcoEl);
    let ultimoAmb = null;
    const desenhar = (s) => {
      if (!s) return;
      const enquadrar = P.enquadrar.bind(P);
      // Mantém o ângulo que a pessoa escolheu quando só o acabamento muda.
      if (s.amb === ultimoAmb) P.enquadrar = () => {};
      P.trocar(CENAS[s.amb](P, s));
      P.enquadrar = enquadrar; ultimoAmb = s.amb;
    };
    desenhar(window.MadeMonte && window.MadeMonte.snapshot());
    document.addEventListener('made:monte', (e) => desenhar(e.detail));
    window.MadeCena3D = Object.assign(window.MadeCena3D || {}, { monte: P });
  });
}

function iniciarMdf(alvoEl) {
  quandoPerto(alvoEl, async () => {
    let L; try { L = await carregar(); } catch (e) { return; }
    let P = null;
    const montar = (item) => {
      if (!item) return;
      const previa = document.querySelector('#mdf .mdf__previa');
      if (!previa) return;
      if (!P || !previa.contains(P.renderer.domElement)) {
        previa.textContent = '';
        P = new Palco(L, previa);
        P.enquadrar([1.25, 1.3, 5.6], [0.1, 1.05, 0.3]);
        window.MadeCena3D = Object.assign(window.MadeCena3D || {}, { mdf: P });
      }
      const tipo = window.MadeCatalogoMDF.tipoDesenho(item.familia);
      P.trocar(cenaArmario(P, { cor: item.cor, tipo }));
    };
    montar(window.MadeMDF && window.MadeMDF.escolhido());
    document.addEventListener('made:mdf', (e) => montar(e.detail));
  });
}

if (temWebGL()) {
  const monte = document.querySelector('#monte .monte__palco');
  const mdf = document.querySelector('#mdf .mdf__detalhe');
  if (monte) iniciarMonte(monte);
  if (mdf) iniciarMdf(mdf);
}
