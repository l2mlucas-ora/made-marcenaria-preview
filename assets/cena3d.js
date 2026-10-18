/* ============================================================
   Madê Marcenaria — 3D (Three.js r169, hospedado no site)

   Duas camadas de qualidade:

   1) 3D INTERATIVO (sempre): a pessoa gira a cena arrastando.
      - Madeira com textura FOTOGRÁFICA (folha de carvalho, Poly Haven, CC0)
        convertida em tons de cinza e TINGIDA com a cor de cada padrão de
        MDF, com relevo (normal map) e variação de brilho (roughness map),
        em escala real (1 m de textura = 1 m de móvel).
      - Luz de um interior real fotografado em 360° (HDRI "lebombo",
        Poly Haven, CC0) + um "sol" de janela para as sombras.
      - Sombra de contato nos cantos (GTAO), brilho suave do LED (bloom),
        serrilhado limpo (MSAA) e tom de cor "Neutral" (feito para não
        distorcer a cor de produto).
      - Piso de porcelanato, parede de reboco e pedra da churrasqueira com
        texturas reais; planta modelada (glTF, Poly Haven, CC0).

   2) FOTO REALISTA (botão): traçado de raios progressivo
      (three-gpu-pathtracer 0.0.23 + three-mesh-bvh 0.7.8, MIT). Em alguns
      segundos a luz rebate de verdade nas superfícies — é a mesma técnica
      dos renders. Ao final, "Salvar imagem" gera um PNG com a assinatura.

   Leveza: nada disso é baixado até a pessoa chegar perto das seções;
   desenha sob demanda; fora da tela, para. Sem WebGL, fica a ilustração
   SVG/CSS de antes. Cores do MDF continuam aproximadas (a tela avisa).
   ============================================================ */

function temWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch (e) { return false; }
}

const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const celular = matchMedia('(pointer: coarse)').matches;
const T = (txt, vars) => (window.MadeI18n ? window.MadeI18n.t(txt, vars) : txt.replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? vars[k] : m)));
const PASTA = new URL('3d/', import.meta.url).href;

// Uma promessa só: as duas seções podem pedir ao mesmo tempo, e a segunda espera as texturas também.
let libs = null;
function carregar() { return libs || (libs = carregarTudo()); }
async function carregarTudo() {
  const THREE = await import('three');
  const [{ OrbitControls }, { RoomEnvironment }, { RoundedBoxGeometry }, { RGBELoader }, { GLTFLoader },
    { EffectComposer }, { RenderPass }, { OutputPass }, { GTAOPass }, { UnrealBloomPass }] = await Promise.all([
    import('three/addons/controls/OrbitControls.js'), import('three/addons/environments/RoomEnvironment.js'),
    import('three/addons/geometries/RoundedBoxGeometry.js'), import('three/addons/loaders/RGBELoader.js'),
    import('three/addons/loaders/GLTFLoader.js'), import('three/addons/postprocessing/EffectComposer.js'),
    import('three/addons/postprocessing/RenderPass.js'), import('three/addons/postprocessing/OutputPass.js'),
    import('three/addons/postprocessing/GTAOPass.js'), import('three/addons/postprocessing/UnrealBloomPass.js')
  ]);
  const L = { THREE, OrbitControls, RoomEnvironment, RoundedBoxGeometry, RGBELoader, GLTFLoader, EffectComposer, RenderPass, OutputPass, GTAOPass, UnrealBloomPass };
  L.recursos = await carregarRecursos(L);
  return L;
}

/* ---------- Texturas e modelos reais (CC0), uma vez só ---------- */
async function carregarRecursos(L) {
  const { THREE } = L;
  const tl = new THREE.TextureLoader();
  const tex = async (nome, cor) => {
    const t = await tl.loadAsync(PASTA + nome);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
    t.colorSpace = cor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    return t;
  };
  const [veio, veioNormal, veioBrilho, pisoCor, pisoNormal, pisoBrilho, paredeNormal, pedraCor, pedraNormal, hdr, planta] = await Promise.all([
    tex('madeira-veio.jpg', true), tex('madeira-normal.jpg'), tex('madeira-brilho.jpg'),
    tex('piso-cor.jpg', true), tex('piso-normal.jpg'), tex('piso-brilho.jpg'),
    tex('parede-normal.jpg'), tex('pedra-cor.jpg', true), tex('pedra-normal.jpg'),
    new L.RGBELoader().loadAsync(PASTA + 'luz-interior.hdr'),
    new L.GLTFLoader().loadAsync(PASTA + 'planta/potted_plant_02_1k.gltf').catch(() => null)
  ]);
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  let modeloPlanta = null;
  if (planta) {
    modeloPlanta = planta.scene;
    const caixa = new THREE.Box3().setFromObject(modeloPlanta);
    modeloPlanta.userData.altura = caixa.max.y - caixa.min.y;
    modeloPlanta.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  }
  return { veio, veioNormal, veioBrilho, pisoCor, pisoNormal, pisoBrilho, paredeNormal, pedraCor, pedraNormal, hdr, modeloPlanta };
}

/* ---------- Sorteio com semente ---------- */
function sorteio(semente) {
  let a = semente >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* ---------- Texturas geradas (padrões sem foto: trama, pedras de bancada) ---------- */
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function ruido(ctx, w, h, R, forca) {
  const img = ctx.getImageData(0, 0, w, h), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (R() - 0.5) * forca; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  ctx.putImageData(img, 0, 0);
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
  const c = canvas(1024, 1024), ctx = c.getContext('2d'), R = sorteio(91);
  ctx.fillStyle = cor; ctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 9000; i++) { const x = R() * 1024, y = R() * 1024, r = 0.4 + R() * 1.8; ctx.fillStyle = `rgba(${200 + R() * 55},${200 + R() * 55},${200 + R() * 55},${0.12 + R() * 0.45})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.28); ctx.fill(); }
  ruido(ctx, 1024, 1024, R, 10); return c;
}
function canvasQuartzo(cor) {
  const c = canvas(1024, 1024), ctx = c.getContext('2d'), R = sorteio(17);
  ctx.fillStyle = cor; ctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 22; i++) {
    ctx.beginPath(); let x = R() * 1024, y = R() * 1024; ctx.moveTo(x, y);
    for (let k = 0; k < 6; k++) { x += 60 + R() * 120; y += (R() - 0.5) * 90; ctx.quadraticCurveTo(x - 50, y + (R() - 0.5) * 60, x, y); }
    ctx.strokeStyle = `rgba(120,115,110,${0.05 + R() * 0.08})`; ctx.lineWidth = 0.6 + R() * 1.6; ctx.stroke();
  }
  ruido(ctx, 1024, 1024, R, 5); return c;
}

/* ---------- UV em metros (caixa): textura em escala real, veio na direção certa ----------
   orient 'v': veio corre na vertical (portas, laterais); 'h': na horizontal (tampos, prateleiras). */
function uvMetros(geo, orient, S, deslocar) {
  const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let a, b;
    if (orient === 'h') { if (az >= ax && az >= ay) { a = y; b = x; } else if (ax >= ay) { a = y; b = z; } else { a = z; b = x; } }
    else { if (az >= ax && az >= ay) { a = x; b = y; } else if (ax >= ay) { a = z; b = y; } else { a = x; b = z; } }
    uv.setXY(i, a / S + deslocar[0], b / S + deslocar[1]);
  }
  uv.needsUpdate = true;
}

/* ============================================================
   Palco: renderizador, cena, luz real, pós-processamento, foto
   ============================================================ */
class Palco {
  constructor(L, alvo) {
    const { THREE, OrbitControls } = L;
    this.L = L; this.R = L.recursos; this.alvo = alvo;
    this.cacheTex = new Map(); this.cacheMat = new Map();

    const r = this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(devicePixelRatio || 1, celular ? 1.5 : 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.NeutralToneMapping; r.toneMappingExposure = 0.92;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.domElement.className = 'palco3d';
    r.domElement.setAttribute('aria-hidden', 'true');
    alvo.appendChild(r.domElement);

    const cena = this.cena = new THREE.Scene();
    cena.background = new THREE.Color('#E6DED2');
    const pmrem = new THREE.PMREMGenerator(r);
    cena.environment = this.envRaster = pmrem.fromEquirectangular(this.R.hdr).texture;
    cena.environmentIntensity = 0.72;
    cena.environmentRotation = new THREE.Euler(0, 1.2, 0);
    pmrem.dispose();

    // "Sol" de janela: sombras definidas, luz quente da esquerda
    const sol = this.sol = new THREE.DirectionalLight(0xfff1e2, 1.7);
    sol.position.set(-3.2, 4.6, 4.2); sol.castShadow = true;
    const ms = celular ? 1024 : 2048;
    sol.shadow.mapSize.set(ms, ms); sol.shadow.bias = -0.0003; sol.shadow.normalBias = 0.025;
    Object.assign(sol.shadow.camera, { left: -4, right: 4, top: 3.6, bottom: -1.5, near: 0.5, far: 14 });
    cena.add(sol);

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.05, 40);
    const ctl = this.controles = new OrbitControls(this.camera, r.domElement);
    ctl.enablePan = false; ctl.enableDamping = !reduzido; ctl.dampingFactor = 0.08; ctl.rotateSpeed = 0.6;
    ctl.minPolarAngle = 1.0; ctl.maxPolarAngle = 1.62; ctl.minAzimuthAngle = -0.65; ctl.maxAzimuthAngle = 0.65;
    ctl.zoomSpeed = 0.6;
    ctl.addEventListener('change', () => { this.sairDaFoto(); this.pedir(); });
    ctl.addEventListener('start', () => alvo.classList.add('girou'));

    this.montarComposer();
    this.grupo = null; this.visivel = true; this.pedido = false; this.foto = null;
    new ResizeObserver(() => this.ajustar()).observe(alvo);
    new IntersectionObserver((e) => { this.visivel = e[0].isIntersecting; if (this.visivel) this.pedir(); }).observe(alvo);

    this.montarInterface();
    alvo.classList.add('tem-3d');
    this.ajustar();
  }

  montarComposer() {
    const { THREE, EffectComposer, RenderPass, OutputPass, GTAOPass, UnrealBloomPass } = this.L;
    const alvoRender = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    const c = this.composer = new EffectComposer(this.renderer, alvoRender);
    c.addPass(new RenderPass(this.cena, this.camera));
    const ao = this.ao = new GTAOPass(this.cena, this.camera, 1, 1);
    ao.updateGtaoMaterial({ radius: 0.28, distanceExponent: 1.4, thickness: 1.2, scale: 1.1, samples: celular ? 8 : 16 });
    ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: celular ? 8 : 16 });
    ao.blendIntensity = 0.9;
    c.addPass(ao);
    const brilho = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.22, 0.45, 1.6);
    c.addPass(brilho);
    c.addPass(new OutputPass());
  }

  montarInterface() {
    const a = this.alvo;
    const dica = document.createElement('span'); dica.className = 'giro-dica'; dica.setAttribute('aria-hidden', 'true');
    a.appendChild(dica); this.dica = dica;

    const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'foto3d__botao';
    bt.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg><span></span>';
    bt.addEventListener('click', (e) => { e.stopPropagation(); this.tirarFoto(); });
    a.appendChild(bt); this.botaoFoto = bt;

    const painel = document.createElement('div'); painel.className = 'foto3d__painel'; painel.hidden = true;
    painel.innerHTML = '<p class="foto3d__texto" role="status"></p><div class="foto3d__barra"><span></span></div><div class="foto3d__acoes"></div>';
    a.appendChild(painel); this.painel = painel;
    this.traduzir();
    document.addEventListener('made:idioma', () => this.traduzir());
  }

  traduzir() {
    this.dica.textContent = T('Arraste para girar');
    this.botaoFoto.querySelector('span').textContent = T('Foto realista');
    this.botaoFoto.setAttribute('aria-label', T('Gerar foto realista desta cena'));
  }

  ajustar() {
    const w = this.alvo.clientWidth, h = this.alvo.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.composer.setPixelRatio(this.renderer.getPixelRatio());
    this.composer.setSize(w, h);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.sairDaFoto(); this.pedir();
  }

  pedir() {
    if (this.pedido || this.foto) return; this.pedido = true;
    requestAnimationFrame(() => {
      this.pedido = false;
      if (!this.visivel || this.foto) return;
      const mexeu = this.controles.update();
      this.composer.render();
      if (mexeu) this.pedir();
    });
  }

  enquadrar(pos, alvo) {
    this.camera.position.set(pos[0], pos[1], pos[2]);
    this.controles.target.set(alvo[0], alvo[1], alvo[2]);
    this.controles.update();
  }

  trocar(grupo) {
    this.sairDaFoto();
    if (this.grupo) {
      this.cena.remove(this.grupo);
      this.grupo.traverse((o) => { if (o.geometry && !o.userData.compartilhado) o.geometry.dispose(); });
    }
    this.grupo = grupo; this.cena.add(grupo); this.pedir();
  }

  /* ---------- Foto realista (traçado de raios) ---------- */
  async tirarFoto() {
    if (this.foto) return;
    const { THREE } = this.L;
    const painel = this.painel, texto = painel.querySelector('.foto3d__texto'), barra = painel.querySelector('.foto3d__barra span'), acoes = painel.querySelector('.foto3d__acoes');
    painel.hidden = false; this.alvo.classList.add('fotografando'); acoes.textContent = '';
    texto.textContent = T('Preparando a luz…'); barra.style.width = '0%';
    const cancelar = this.botao(T('Cancelar'), () => this.sairDaFoto(true)); acoes.appendChild(cancelar);
    let PT;
    try { PT = await import('three-gpu-pathtracer'); } catch (e) { texto.textContent = T('Seu navegador não conseguiu gerar a foto.'); return; }
    if (painel.hidden) return;   // cancelou enquanto o traçador carregava
    const pt = new PT.WebGLPathTracer(this.renderer);
    pt.tiles.set(celular ? 3 : 2, celular ? 3 : 2);
    pt.bounces = 5; pt.filterGlossyFactor = 0.4; pt.renderDelay = 0; pt.fadeDuration = 0; pt.minSamples = 1;
    pt.renderScale = celular ? 0.6 : 1;
    const foto = this.foto = { pt, parar: false };
    // O traçador usa o fundo e a luz da cena; a cor de fundo vira luz ambiente suave.
    // setScene síncrono: a versão assíncrona exige um worker de BVH, e a cena é pequena.
    await new Promise((r) => setTimeout(r, 30));   // deixa o "Preparando a luz…" aparecer
    // O traçador lê o HDR equirretangular cru, não o PMREM do raster (volta em sairDaFoto).
    this.R.hdr.mapping = THREE.EquirectangularReflectionMapping; this.cena.environment = this.R.hdr;
    try { pt.setScene(this.cena, this.camera); } catch (e) { console.warn('foto realista:', e); texto.textContent = T('Seu navegador não conseguiu gerar a foto.'); this.foto = null; return; }
    if (foto.parar) return;
    const alvoAmostras = celular ? 120 : 260, limite = performance.now() + (celular ? 45000 : 35000);
    const passo = () => {
      if (foto.parar) return;
      pt.renderSample();
      const p = Math.min(1, pt.samples / alvoAmostras);
      barra.style.width = Math.round(p * 100) + '%';
      texto.textContent = T('Gerando foto realista… {p}%', { p: Math.round(p * 100) });
      if (p < 1 && performance.now() < limite) { requestAnimationFrame(passo); return; }
      // Pronto: captura no mesmo quadro (o buffer ainda está desenhado)
      foto.imagem = this.capturar();
      texto.textContent = T('Pronta! Cores aproximadas: a Madê leva as amostras reais.');
      acoes.textContent = '';
      acoes.appendChild(this.botao(T('Salvar imagem'), () => this.salvar(foto.imagem), true));
      acoes.appendChild(this.botao(T('Voltar ao 3D'), () => this.sairDaFoto(true)));
    };
    requestAnimationFrame(passo);
  }

  botao(rotulo, acao, principal) {
    const b = document.createElement('button'); b.type = 'button';
    b.className = principal ? 'foto3d__acao foto3d__acao--principal' : 'foto3d__acao';
    b.textContent = rotulo; b.addEventListener('click', (e) => { e.stopPropagation(); acao(); }); return b;
  }

  capturar() {
    const fonte = this.renderer.domElement, c = document.createElement('canvas');
    c.width = fonte.width; c.height = fonte.height;
    const ctx = c.getContext('2d'); ctx.drawImage(fonte, 0, 0);
    const k = c.width / 1000, txt = 'Madê Marcenaria · ilustração · cores aproximadas';
    ctx.font = `${Math.round(13 * k)}px Inter, "Segoe UI", sans-serif`;
    const w = ctx.measureText(txt).width + 24 * k;
    ctx.fillStyle = 'rgba(28,25,23,.55)'; ctx.fillRect(c.width - w - 14 * k, c.height - 34 * k, w, 24 * k);
    ctx.fillStyle = '#F4EFE7'; ctx.fillText(txt, c.width - w - 2 * k, c.height - 17 * k);
    return c.toDataURL('image/png');
  }

  salvar(dataUrl) {
    const a = document.createElement('a'); a.href = dataUrl; a.download = 'made-marcenaria-ambiente.png';
    document.body.appendChild(a); a.click(); a.remove();
  }

  sairDaFoto(voltar) {
    this.cena.environment = this.envRaster;
    if (!this.foto) { if (voltar) { this.painel.hidden = true; this.alvo.classList.remove('fotografando'); this.pedir(); } return; }
    this.foto.parar = true;
    try { this.foto.pt.dispose(); } catch (e) {}
    this.foto = null;
    this.painel.hidden = true; this.alvo.classList.remove('fotografando');
    this.pedir();
  }

  /* ---------- materiais ---------- */
  mat(m, orient) {
    const { THREE } = this.L, R = this.R, k = m.tipo + m.cor + (orient || 'v');
    if (this.cacheMat.has(k)) return this.cacheMat.get(k);
    let mt;
    if (m.tipo === 'madeira') {
      // Veio fotográfico em cinza (média ~0,78) tingido com a cor do padrão
      mt = new THREE.MeshStandardMaterial({ color: new THREE.Color(m.cor).multiplyScalar(1 / 0.78), map: R.veio, normalMap: R.veioNormal, normalScale: new THREE.Vector2(0.55, 0.55), roughnessMap: R.veioBrilho, roughness: 0.85 });
    } else if (m.tipo === 'brilho') {
      mt = new THREE.MeshPhysicalMaterial({ color: m.cor, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.3 });
    } else if (m.tipo === 'trama') {
      const t = new THREE.CanvasTexture(canvasTrama(m.cor)); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3);
      mt = new THREE.MeshStandardMaterial({ map: t, roughness: 0.7, normalMap: R.paredeNormal, normalScale: new THREE.Vector2(0.15, 0.15) });
    } else if (m.tipo === 'pedra') {
      const t = new THREE.CanvasTexture(canvasSaoGabriel(m.cor)); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
      mt = new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.34, clearcoat: 0.35, clearcoatRoughness: 0.2 });
    } else if (m.tipo === 'pedra-clara') {
      const t = new THREE.CanvasTexture(canvasQuartzo(m.cor)); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
      mt = new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.18, clearcoat: 0.6, clearcoatRoughness: 0.08 });
    } else {
      // Laca/MDF fosco: acetinado, com um "casca de laranja" quase imperceptível
      mt = new THREE.MeshStandardMaterial({ color: m.cor, roughness: 0.48, normalMap: R.paredeNormal, normalScale: new THREE.Vector2(0.04, 0.04) });
    }
    this.cacheMat.set(k, mt); return mt;
  }

  simples(cor, rug, metal, extra) {
    const { THREE } = this.L, k = 's' + cor + rug + metal + JSON.stringify(extra || {});
    if (this.cacheMat.has(k)) return this.cacheMat.get(k);
    const mt = new THREE.MeshStandardMaterial(Object.assign({ color: cor, roughness: rug, metalness: metal || 0 }, extra || {}));
    this.cacheMat.set(k, mt); return mt;
  }
}

/* ============================================================
   Peças de marcenaria (metros; parede em z = 0, frente para +z)
   ============================================================ */
function oficina(P) {
  const { THREE, RoundedBoxGeometry } = P.L, R = P.R;
  const g = new THREE.Group();

  const caixa = (w, h, d, mat, x, y0, z0, raio, orient) => {
    const geo = new RoundedBoxGeometry(w, h, d, 2, raio === undefined ? 0.004 : raio);
    const s = sorteio(hash(x.toFixed(3) + y0.toFixed(3) + z0.toFixed(3)));
    uvMetros(geo, orient || 'v', 1.0, [s() * 3, s() * 3]);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y0 + h / 2, z0 + d / 2); m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
  };

  const metalPux = (h) => {
    if (h === 'preto') return P.simples('#1E1D1C', 0.4, 0.6);
    if (h === 'dourado') return P.simples('#D2AE68', 0.22, 1);
    return P.simples('#C9CBCD', 0.3, 1);
  };

  const porta = (x0, y0, w, h, mat, zf, pux, estiloPux) => {
    const folga = 0.0025;
    caixa(w - folga * 2, h - folga * 2, 0.018, mat, x0 + w / 2, y0 + folga, zf - 0.018, 0.0022);
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

  const led = (x0, x1, y, z, ligado, paraCima) => {
    if (!ligado) return;
    const barra = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.006, 0.014), new THREE.MeshStandardMaterial({ color: '#fff3dc', emissive: '#ffd39a', emissiveIntensity: 6 }));
    barra.position.set((x0 + x1) / 2, y, z); g.add(barra);
    const n = Math.max(2, Math.round((x1 - x0) / 0.6));
    for (let i = 0; i < n; i++) {
      const luz = new THREE.PointLight(0xffc98a, 0.4, 1.3, 1.8);
      luz.position.set(x0 + (i + 0.5) * (x1 - x0) / n, y + (paraCima ? 0.08 : -0.08), z + 0.06); g.add(luz);
    }
  };

  const parede = (cor) => {
    const t = R.paredeNormal;
    const mat = new THREE.MeshStandardMaterial({ color: cor || '#ECE6DC', roughness: 0.94, normalMap: t, normalScale: new THREE.Vector2(0.35, 0.35) });
    const geo = new THREE.PlaneGeometry(10, 5); geo.attributes.uv.array.forEach((v, i, a) => { a[i] = v * (i % 2 ? 2.5 : 5); });
    const m = new THREE.Mesh(geo, mat); m.position.set(0, 2.5, 0); m.receiveShadow = true; g.add(m);
  };
  const paredeAzulejo = () => {
    // Porcelanato grande na parede do banheiro: mesma textura do piso, em pé
    const mat = new THREE.MeshStandardMaterial({ map: R.pisoCor, normalMap: R.pisoNormal, roughnessMap: R.pisoBrilho, roughness: 0.6, color: '#F4EFE8' });
    const geo = new THREE.PlaneGeometry(10, 5); geo.attributes.uv.array.forEach((v, i, a) => { a[i] = v * (i % 2 ? 2.5 : 5); });
    const m = new THREE.Mesh(geo, mat); m.position.set(0, 2.5, 0); m.receiveShadow = true; g.add(m);
  };
  const piso = () => {
    const mat = new THREE.MeshStandardMaterial({ map: R.pisoCor, normalMap: R.pisoNormal, roughnessMap: R.pisoBrilho, roughness: 0.75 });
    const geo = new THREE.PlaneGeometry(10, 8); geo.attributes.uv.array.forEach((v, i, a) => { a[i] = v * (i % 2 ? 4 : 5); });
    const m = new THREE.Mesh(geo, mat); m.rotation.x = -Math.PI / 2; m.position.set(0, 0, 4); m.receiveShadow = true; g.add(m);
  };
  const rodape = (x0, x1, z) => caixa(x1 - x0, 0.1, 0.02, P.simples('#2B2622', 0.7), (x0 + x1) / 2, 0, z - 0.06, 0.002);

  // Planta modelada (glTF CC0); se não carregou, a versão simples de antes
  const planta = (x, y, z, altura) => {
    const mod = R.modeloPlanta;
    if (mod) {
      const c = mod.clone(true); c.traverse((o) => { if (o.isMesh) o.userData.compartilhado = true; });
      const k = (altura || 0.5) / (mod.userData.altura || 1); c.scale.setScalar(k);
      c.position.set(x, y, z); c.rotation.y = (x * 7) % 6.28; g.add(c); return;
    }
    const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.14, 24), P.simples('#BDA990', 0.85));
    vaso.position.set(x, y + 0.07, z); vaso.castShadow = true; g.add(vaso);
  };

  const vasilha = (x, y, z, r, h, cor, brilho) => {
    const perfil = [[0, 0], [r * 0.85, 0], [r, h * 0.15], [r * 0.98, h * 0.85], [r * 0.9, h], [r * 0.86, h], [r * 0.9, h * 0.2], [0, h * 0.06]].map((p) => new THREE.Vector2(p[0], p[1]));
    const m = new THREE.Mesh(new THREE.LatheGeometry(perfil, 40), new THREE.MeshPhysicalMaterial({ color: cor, roughness: brilho ? 0.25 : 0.55, clearcoat: brilho ? 0.6 : 0.1 }));
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; g.add(m);
  };

  const livros = (x, y, z, n) => {
    const cores = ['#8E7D69', '#B5A18A', '#5E6B55', '#D8CDBD', '#6F5646'];
    let yy = y;
    for (let i = 0; i < n; i++) { const h = 0.025 + (i % 2) * 0.01; caixa(0.22 - i * 0.015, h, 0.16, P.simples(cores[i % cores.length], 0.85), x + (i % 2) * 0.01, yy, z, 0.002); yy += h; }
  };

  return { g, caixa, porta, led, parede, paredeAzulejo, piso, rodape, planta, vasilha, livros, metalPux };
}

/* ---------- Cena: armário do explorador de MDF ---------- */
function cenaArmario(P, m) {
  const o = oficina(P); const mat = P.mat(m);
  o.parede('#E4DDD3'); o.piso();
  const w = 1.5, h = 2.2, d = 0.58, x0 = -w / 2, zf = d;
  o.caixa(w, h - 0.1, d - 0.02, mat, 0, 0.1, 0);
  o.rodape(x0, x0 + w, zf);
  const n = 3, pw = w / n;
  for (let i = 0; i < n; i++) o.porta(x0 + i * pw, 0.1, pw, h - 0.1, mat, zf + 0.001, i === 0 ? 'r' : 'l', 'escovado');
  o.planta(1.2, 0, 0.45, 0.95);
  return o.g;
}

/* ---------- Cenas do configurador ---------- */
const CENAS = {
  cozinha(P, s) {
    const o = oficina(P), mp = P.mat(s.p), ms = P.mat(s.s), msh = P.mat(s.s, 'h'), mt = P.mat(s.t, 'h'), T3 = P.L.THREE;
    o.parede('#E6E1D9'); o.piso();
    o.caixa(0.62, 2.1, 0.58, mp, -1.42, 0.1, 0);
    o.porta(-1.73, 1.5, 0.62, 0.7, mp, 0.581, 'b', s.h);
    const vidro = new T3.MeshPhysicalMaterial({ color: '#111111', roughness: 0.05, metalness: 0.1, clearcoat: 1 });
    o.caixa(0.56, 0.36, 0.02, vidro, -1.42, 1.1, 0.565, 0.004);
    o.caixa(0.56, 0.2, 0.02, vidro, -1.42, 0.86, 0.565, 0.004);
    o.caixa(0.46, 0.012, 0.012, o.metalPux('escovado'), -1.42, 1.41, 0.6, 0.005);
    o.porta(-1.73, 0.1, 0.62, 0.74, mp, 0.581, 't', s.h);
    o.rodape(-1.73, -1.11, 0.58);
    o.caixa(2.8, 0.78, 0.56, mp, 0.3, 0.1, 0);
    for (let i = 0; i < 4; i++) o.porta(-1.1 + i * 0.7, 0.1, 0.7, 0.78, mp, 0.581, 't', s.h);
    o.rodape(-1.1, 1.7, 0.58);
    o.caixa(2.84, 0.03, 0.62, mt, 0.3, 0.88, 0, 0.003, 'h');
    o.caixa(0.6, 0.006, 0.5, vidro, 0.15, 0.91, 0.05, 0.004);
    const aco = o.metalPux('escovado');
    const tubo = new T3.Mesh(new T3.CylinderGeometry(0.012, 0.012, 0.32, 20), aco); tubo.position.set(1.15, 1.07, 0.18); tubo.castShadow = true; o.g.add(tubo);
    const arco = new T3.Mesh(new T3.TorusGeometry(0.08, 0.012, 14, 28, Math.PI), aco); arco.position.set(1.15, 1.23, 0.26); arco.rotation.y = Math.PI / 2; o.g.add(arco);
    o.caixa(1.68, 0.7, 0.34, ms, -0.26, 1.45, 0);
    o.porta(-1.1, 1.45, 0.84, 0.7, ms, 0.341, 'b', s.h); o.porta(-0.26, 1.45, 0.84, 0.7, ms, 0.341, 'b', s.h);
    o.led(-1.08, 0.56, 1.444, 0.3, s.led);
    [1.5, 1.86].forEach((y) => { o.caixa(1.08, 0.03, 0.26, msh, 1.18, y, 0, 0.002, 'h'); o.led(0.66, 1.7, y - 0.004, 0.22, s.led); });
    o.planta(0.86, 1.53, 0.12, 0.32); o.vasilha(1.08, 1.53, 0.12, 0.05, 0.17, '#E8E2D8', true); o.vasilha(1.2, 1.53, 0.12, 0.04, 0.12, '#B9A78F');
    o.livros(1.5, 1.53, 0.04, 3);
    o.vasilha(0.9, 1.89, 0.12, 0.07, 0.07, '#EFEAE2', true); o.planta(1.55, 1.89, 0.12, 0.28);
    o.vasilha(-0.6, 0.91, 0.25, 0.09, 0.05, '#D8CCBA'); o.planta(-1.0, 0.91, 0.2, 0.3);
    P.enquadrar([0.7, 1.55, 5.0], [0.05, 1.08, 0.3]);
    return o.g;
  },

  quarto(P, s) {
    const o = oficina(P), mp = P.mat(s.p), ms = P.mat(s.s), mt = P.mat(s.t, 'h'), T3 = P.L.THREE;
    o.parede('#E3DCD1'); o.piso();
    o.caixa(1.6, 2.3, 0.58, mp, -1.7, 0.1, 0);
    [['r'], ['l'], ['l']].forEach((p, i) => o.porta(-2.5 + i * 0.5334, 0.1, 0.5334, 2.3, mp, 0.581, p[0], s.h));
    o.rodape(-2.5, -0.9, 0.58);
    o.caixa(2.4, 1.5, 0.03, ms, 1.0, 0.0, 0);
    for (let x = -0.16; x < 2.18; x += 0.06) o.caixa(0.04, 1.5, 0.025, ms, x, 0.0, 0.03, 0.002);
    o.led(-0.18, 2.18, 1.505, 0.04, s.led, true);
    // Cama com tecido (sheen) — enxoval claro, manta texturizada
    const tecido = new T3.MeshPhysicalMaterial({ color: '#CFC5B6', roughness: 1, sheen: 0.8, sheenRoughness: 0.6, sheenColor: new T3.Color('#ffffff'), normalMap: P.R.paredeNormal, normalScale: new T3.Vector2(0.2, 0.2) });
    const branco = new T3.MeshPhysicalMaterial({ color: '#F3EEE7', roughness: 1, sheen: 0.6, sheenRoughness: 0.5, sheenColor: new T3.Color('#ffffff') });
    const manta = new T3.MeshPhysicalMaterial({ color: '#B6A893', roughness: 1, sheen: 1, sheenRoughness: 0.4, sheenColor: new T3.Color('#efe6d6'), normalMap: P.R.paredeNormal, normalScale: new T3.Vector2(0.6, 0.6) });
    o.caixa(1.66, 0.32, 2.05, tecido, 1.0, 0.0, 0.06, 0.03);
    o.caixa(1.6, 0.24, 2.0, branco, 1.0, 0.32, 0.08, 0.07);
    o.caixa(0.62, 0.17, 0.34, branco, 0.62, 0.56, 0.12, 0.08); o.caixa(0.62, 0.17, 0.34, branco, 1.38, 0.56, 0.12, 0.08);
    o.caixa(0.5, 0.15, 0.2, manta, 1.0, 0.56, 0.36, 0.06);
    o.caixa(1.68, 0.05, 0.9, manta, 1.0, 0.55, 1.16, 0.025);
    [-0.47, 2.47].forEach((x) => {
      o.caixa(0.46, 0.2, 0.4, mp, x, 0.42, 0.04);
      o.caixa(0.46, 0.02, 0.4, mt, x, 0.62, 0.04, 0.002, 'h');
      o.vasilha(x, 0.64, 0.24, 0.05, 0.18, '#E7DFD2', true);
      const cupula = new T3.Mesh(new T3.SphereGeometry(0.08, 28, 20), new T3.MeshStandardMaterial({ color: '#F4EBDD', emissive: '#FFD9A0', emissiveIntensity: s.led ? 1.6 : 0, roughness: 0.6 }));
      cupula.position.set(x, 0.9, 0.24); o.g.add(cupula);
      if (s.led) { const l = new T3.PointLight(0xffc98a, 0.45, 1.4, 1.8); l.position.set(x, 0.92, 0.3); o.g.add(l); }
    });
    o.planta(2.95, 0, 0.5, 1.0);
    P.enquadrar([0.0, 1.55, 6.3], [0.0, 0.95, 0.6]);
    return o.g;
  },

  gourmet(P, s) {
    const o = oficina(P), mp = P.mat(s.p), ms = P.mat(s.s, 'h'), mt = P.mat(s.t, 'h'), T3 = P.L.THREE;
    o.parede('#E3DCD1'); o.piso();
    const pedra = new T3.MeshStandardMaterial({ map: P.R.pedraCor, normalMap: P.R.pedraNormal, normalScale: new T3.Vector2(1.2, 1.2), roughness: 0.92 });
    o.caixa(1.5, 2.6, 0.12, pedra, -1.55, 0, 0, 0.01);
    o.caixa(0.86, 0.6, 0.06, P.simples('#121110', 0.9), -1.55, 0.92, 0.08, 0.01);
    const brasa = new T3.Mesh(new T3.BoxGeometry(0.7, 0.04, 0.05), new T3.MeshStandardMaterial({ color: '#4a1a08', emissive: '#F06A28', emissiveIntensity: 4 }));
    brasa.position.set(-1.55, 0.97, 0.12); o.g.add(brasa);
    const fogo = new T3.PointLight(0xff7a30, 0.8, 1.6, 1.8); fogo.position.set(-1.55, 1.05, 0.25); o.g.add(fogo);
    o.caixa(1.2, 0.04, 0.3, mt, -1.55, 0.86, 0.04, 0.003, 'h');
    o.caixa(2.6, 0.78, 0.56, P.simples('#2A2420', 0.8), 0.6, 0.1, 0);
    for (let x = -0.68; x < 1.89; x += 0.042) o.caixa(0.03, 0.74, 0.02, mp, x, 0.12, 0.565, 0.003);
    o.rodape(-0.7, 1.9, 0.58);
    o.caixa(2.64, 0.035, 0.62, mt, 0.6, 0.88, 0, 0.003, 'h');
    [1.45, 1.85].forEach((y) => { o.caixa(2.2, 0.035, 0.28, ms, 0.6, y, 0, 0.002, 'h'); o.led(-0.48, 1.68, y - 0.004, 0.24, s.led); });
    const garrafa = (x, cor) => {
      const perfil = [[0, 0], [0.035, 0], [0.036, 0.2], [0.014, 0.25], [0.013, 0.3], [0, 0.3]].map((p) => new T3.Vector2(p[0], p[1]));
      const m = new T3.Mesh(new T3.LatheGeometry(perfil, 32), new T3.MeshPhysicalMaterial({ color: cor, roughness: 0.05, clearcoat: 1, metalness: 0.1 }));
      m.position.set(x, 1.485, 0.12); m.castShadow = true; o.g.add(m);
    };
    garrafa(-0.3, '#2E3A27'); garrafa(-0.2, '#4A2A1A'); garrafa(-0.1, '#2C3326');
    o.vasilha(0.4, 1.485, 0.12, 0.1, 0.07, '#D8CCBA', true); o.planta(1.3, 1.485, 0.12, 0.32); o.planta(0.0, 1.885, 0.12, 0.28); o.vasilha(0.9, 1.885, 0.12, 0.05, 0.16, '#EDE6DA', true);
    o.livros(0.65, 1.885, 0.05, 4);
    o.vasilha(1.3, 0.915, 0.25, 0.13, 0.05, '#C7B79F');
    P.enquadrar([0.2, 1.55, 5.3], [0.1, 1.05, 0.3]);
    return o.g;
  },

  banheiro(P, s) {
    const o = oficina(P), mp = P.mat(s.p), ms = P.mat(s.s), msh = P.mat(s.s, 'h'), mt = P.mat(s.t, 'h'), T3 = P.L.THREE;
    o.paredeAzulejo(); o.piso();
    if (s.led) {
      const halo = new T3.Mesh(new T3.CircleGeometry(0.5, 64), new T3.MeshStandardMaterial({ color: '#000', emissive: '#FFD9A0', emissiveIntensity: 3 }));
      halo.position.set(0, 1.55, 0.004); o.g.add(halo);
      const l = new T3.PointLight(0xffc98a, 0.6, 1.8, 1.8); l.position.set(0, 1.55, 0.18); o.g.add(l);
    }
    const espelho = new T3.Mesh(new T3.CylinderGeometry(0.46, 0.46, 0.02, 72), new T3.MeshStandardMaterial({ color: '#E8EDEF', metalness: 1, roughness: 0.03 }));
    espelho.rotation.x = Math.PI / 2; espelho.position.set(0, 1.55, 0.03); o.g.add(espelho);
    o.caixa(1.2, 0.34, 0.5, mp, 0, 0.5, 0);
    o.porta(-0.6, 0.5, 0.6, 0.34, mp, 0.501, 't', s.h); o.porta(0, 0.5, 0.6, 0.34, mp, 0.501, 't', s.h);
    o.caixa(1.24, 0.03, 0.52, mt, 0, 0.84, 0, 0.003, 'h');
    const perfil = [[0, 0], [0.14, 0.005], [0.2, 0.04], [0.21, 0.12], [0.2, 0.125], [0.19, 0.05], [0.13, 0.015], [0, 0.012]].map((p) => new T3.Vector2(p[0], p[1]));
    const cuba = new T3.Mesh(new T3.LatheGeometry(perfil, 64), new T3.MeshPhysicalMaterial({ color: '#FBFAF8', roughness: 0.12, clearcoat: 1 })); cuba.position.set(0, 0.87, 0.24); cuba.castShadow = true; o.g.add(cuba);
    const aco = o.metalPux(s.h === 'dourado' ? 'dourado' : s.h === 'preto' ? 'preto' : 'escovado');
    const tubo = new T3.Mesh(new T3.CylinderGeometry(0.012, 0.012, 0.3, 20), aco); tubo.position.set(0.28, 1.02, 0.12); o.g.add(tubo);
    const bico = new T3.Mesh(new T3.CylinderGeometry(0.01, 0.01, 0.16, 20), aco); bico.rotation.x = Math.PI / 2; bico.position.set(0.28, 1.16, 0.2); o.g.add(bico);
    o.caixa(0.42, 1.2, 0.02, P.simples('#CFC6B9', 0.9), 1.2, 0.85, 0);
    o.caixa(0.03, 1.2, 0.16, ms, 1.005, 0.85, 0, 0.002); o.caixa(0.03, 1.2, 0.16, ms, 1.395, 0.85, 0, 0.002);
    o.caixa(0.42, 0.03, 0.16, msh, 1.2, 2.02, 0, 0.002, 'h'); o.caixa(0.42, 0.03, 0.16, msh, 1.2, 0.85, 0, 0.002, 'h');
    [1.25, 1.62].forEach((y) => o.caixa(0.34, 0.025, 0.14, msh, 1.2, y, 0.0, 0.002, 'h'));
    o.led(1.04, 1.36, 2.01, 0.1, s.led);
    const toalha = new T3.MeshPhysicalMaterial({ color: '#EDE8E0', roughness: 1, sheen: 1, sheenRoughness: 0.5, sheenColor: new T3.Color('#ffffff'), normalMap: P.R.paredeNormal, normalScale: new T3.Vector2(0.8, 0.8) });
    [1.1, 1.3].forEach((x) => { const t = new T3.Mesh(new T3.CylinderGeometry(0.06, 0.06, 0.13, 28), toalha); t.rotation.z = Math.PI / 2; t.position.set(x - 0.0, 0.94, 0.08); t.castShadow = true; o.g.add(t); });
    o.vasilha(1.14, 1.275, 0.07, 0.04, 0.12, '#EDE8E0', true); o.vasilha(1.26, 1.275, 0.07, 0.035, 0.16, '#BFAF98', true);
    o.planta(1.2, 1.645, 0.06, 0.24);
    o.planta(-0.95, 0, 0.35, 0.9);
    P.enquadrar([0.35, 1.4, 4.2], [0.25, 1.1, 0.25]);
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
    let L; try { L = await carregar(); } catch (e) { console.warn('3D indisponível:', e); return; }
    const P = new Palco(L, palcoEl);
    let ultimoAmb = null;
    const desenhar = (s) => {
      if (!s) return;
      const enquadrar = P.enquadrar.bind(P);
      if (s.amb === ultimoAmb) P.enquadrar = () => {};   // só acabamento mudou: mantém o ângulo
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
    let L; try { L = await carregar(); } catch (e) { console.warn('3D indisponível:', e); return; }
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
