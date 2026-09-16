// ============================================================
//  MALANITO DESTRUCTOR — motor base
//  Resolución interna 480x270 (16:9, horizontal), escalado pixelado
// ============================================================
'use strict';
const W = 480, H = 270;
const cv = document.getElementById('g');
const ctx = cv.getContext('2d');
const RS = 2; // escala de render: el lienzo interno es 960x540, la lógica sigue en 480x270
cv.width = W * RS; cv.height = H * RS;
ctx.imageSmoothingEnabled = false;

let SCALE = 1, OFFX = 0, OFFY = 0;
let lastWW = 0, lastWH = 0;

function fit() {
  const vv = window.visualViewport;
  let ww = window.innerWidth;
  let wh = window.innerHeight;
  if (vv && vv.width > 0 && vv.height > 0) {
    ww = Math.round(vv.width);
    wh = Math.round(vv.height);
  } else if (document.documentElement && document.documentElement.clientWidth > 0) {
    ww = document.documentElement.clientWidth;
    wh = document.documentElement.clientHeight;
  }
  if (!ww || !wh) {
    ww = window.innerWidth || 480;
    wh = window.innerHeight || 270;
  }
  SCALE = Math.min(ww / W, wh / H);
  if (SCALE <= 0 || !isFinite(SCALE)) SCALE = 1;
  const cw = Math.floor(W * SCALE), ch = Math.floor(H * SCALE);
  OFFX = Math.floor((ww - cw) / 2);
  OFFY = Math.floor((wh - ch) / 2);
  cv.style.width = cw + 'px';
  cv.style.height = ch + 'px';
  cv.style.left = OFFX + 'px';
  cv.style.top = OFFY + 'px';
  lastWW = ww; lastWH = wh;

  const rot = document.getElementById('rotate');
  if (rot) {
    rot.style.display = (wh > ww * 1.05) ? 'flex' : 'none';
  }
}

window.addEventListener('resize', fit);
window.addEventListener('orientationchange', () => { fit(); setTimeout(fit, 50); setTimeout(fit, 150); setTimeout(fit, 300); setTimeout(fit, 600); });
document.addEventListener('fullscreenchange', () => { fit(); setTimeout(fit, 100); setTimeout(fit, 300); });
document.addEventListener('webkitfullscreenchange', () => { fit(); setTimeout(fit, 100); setTimeout(fit, 300); });
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', fit);
  window.visualViewport.addEventListener('scroll', fit);
}
window.addEventListener('load', () => { fit(); setTimeout(fit, 100); setTimeout(fit, 300); });
document.addEventListener('DOMContentLoaded', () => { fit(); setTimeout(fit, 100); });
fit();

// ---------- utilidades ----------
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (a, b) => a + Math.random() * (b - a);
const rint = (a, b) => Math.floor(rnd(a, b + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function aabb(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
const IS_TOUCH = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
let frame = 0;

// ---------- guardado ----------
const Save = {
  data: { arena: false, best: 0, bestRank: '' },
  load() { try { const s = localStorage.getItem('malanito_save'); if (s) Object.assign(this.data, JSON.parse(s)); } catch (e) { } },
  write() { try { localStorage.setItem('malanito_save', JSON.stringify(this.data)); } catch (e) { } }
};
Save.load();

// ---------- recursos gráficos recortados del video ----------
const Assets = { sheet: new Image(), bg: new Image(), ok: false, bgOk: false };
Assets.sheet.onload = () => { Assets.ok = true; }; Assets.sheet.src = SHEET_SRC;
Assets.bg.onload = () => { Assets.bgOk = true; }; Assets.bg.src = BG_SRC;
// dibuja un sprite de la hoja: nombre, posición, alto en unidades de juego, anclaje ('feet' | 'center' | 'tl') y volteo horizontal
function spr(name, x, y, h, anchor, flip) {
  const r = ATLAS[name]; if (!r || !Assets.ok) return false;
  const sc = h / r[3], w = r[2] * sc;
  let dx = x, dy = y;
  if (anchor === undefined || anchor === 'feet') { dx = x - w / 2; dy = y - h; }
  else if (anchor === 'center') { dx = x - w / 2; dy = y - h / 2; }
  ctx.save();
  if (flip) { ctx.translate(dx + w, dy); ctx.scale(-1, 1); dx = 0; dy = 0; }
  ctx.drawImage(Assets.sheet, r[0], r[1], r[2], r[3], dx, dy, w, h);
  ctx.restore(); return true;
}
function sprW(name, h) { const r = ATLAS[name]; return r ? r[2] * h / r[3] : 0; }

// ---------- vibración ----------
function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { } }

// ---------- efectos de pantalla ----------
const FX = { shake: 0, flash: 0, flashCol: '#fff', freeze: 0, negative: 0, glitch: 0, slow: 1, dark: 0 };
function shake(n) { FX.shake = Math.max(FX.shake, n); }
function flash(n, col) { FX.flash = n; FX.flashCol = col || '#fff'; }

// ---------- partículas ----------
const parts = [];
function spawnParts(x, y, n, col, spd, life, grav) {
  for (let i = 0; i < n; i++) {
    const a = rnd(0, Math.PI * 2), s = rnd(0.3, spd);
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rnd(life * 0.5, life), t: 0, col: Array.isArray(col) ? pick(col) : col, g: grav || 0, sz: rnd(1, 3) });
  }
}
function updateParts() {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.t++; p.x += p.vx; p.y += p.vy; p.vy += p.g;
    if (p.t > p.life) parts.splice(i, 1);
  }
}
function drawParts(camx) {
  for (const p of parts) { ctx.fillStyle = p.col; const s = p.sz * (1 - p.t / p.life) + 1; ctx.fillRect(Math.round(p.x - camx), Math.round(p.y), Math.ceil(s), Math.ceil(s)); }
}

// ---------- texto pixelado ----------
function txt(s, x, y, size, col, align, shadow) {
  ctx.font = `${size}px "Press Start 2P", monospace`;
  ctx.textAlign = align || 'left'; ctx.textBaseline = 'top';
  if (shadow !== false) { ctx.fillStyle = '#000'; ctx.fillText(s, x + 1, y + 1); }
  ctx.fillStyle = col || '#fff'; ctx.fillText(s, x, y);
}

// ============================================================
//  ENTRADA: teclado + táctil (multitáctil, botones virtuales)
// ============================================================
const Input = {
  l: false, r: false, d: false, u: false, jump: false, shoot: false, kick: false, burger: false, pause: false, any: false,
  pl: {}, // estado previo para detectar pulsaciones
  jumpP: false, kickP: false, burgerP: false, pauseP: false, anyP: false, upP: false,
  touches: {}, // id -> {x,y}
  keys: {},
  // botones virtuales (coordenadas internas)
  btn: {
    jump: { x: 432, y: 226, r: 25, col: '#3aa0ff', label: 'SALTO' },
    shoot: { x: 376, y: 238, r: 21, col: '#ff3fb0', label: 'PODER' },
    kick: { x: 428, y: 168, r: 19, col: '#ffcc33', label: 'PATADA' },
    burger: { x: 6, y: 40, w: 48, h: 22 },
    pause: { x: 208, y: 4, w: 64, h: 18 },
    dpad: { x: 62, y: 208, r: 46 }
  },
  update() {
    // reset ejes
    let l = false, r = false, d = false, u = false, jump = false, shoot = false, kick = false, burger = false, pause = false, any = false;
    const k = this.keys;
    if (k.ArrowLeft || k.KeyA) l = true;
    if (k.ArrowRight || k.KeyD) r = true;
    if (k.ArrowDown || k.KeyS) d = true;
    if (k.ArrowUp || k.KeyW) u = true;
    if (k.KeyX || k.KeyK || k.Space) jump = true;
    if (k.KeyZ || k.KeyJ) shoot = true;
    if (k.KeyC || k.KeyL || k.ShiftLeft) kick = true;
    if (k.KeyE || k.KeyQ) burger = true;
    if (k.KeyP || k.Escape) pause = true;
    if (k.Enter) any = true;
    for (const key in k) if (k[key]) any = true;
    const ids = Object.keys(this.touches);
    if (ids.length >= 3) pause = true;
    for (const id of ids) {
      const t = this.touches[id]; any = true;
      const b = this.btn;
      const dp = b.dpad;
      // Zona cruceta amplia (soporta pantallas pequeñas y bordes negros)
      if (t.x < W * 0.46 && t.y > H * 0.35) {
        const dx = t.x - dp.x, dy = t.y - dp.y;
        if (dy > 18 && Math.abs(dy) > Math.abs(dx) * 0.65) d = true;
        else if (dy < -20 && Math.abs(dy) > Math.abs(dx) * 0.65) u = true;
        if (dx < -8 && Math.abs(dx) >= Math.abs(dy) * 0.4) l = true;
        if (dx > 8 && Math.abs(dx) >= Math.abs(dy) * 0.4) r = true;
        if (dy > 16 && Math.abs(dx) > 12) { if (dx < 0) l = true; else r = true; }
        if (t.x < dp.x - 10) l = true;
      }
      // Botones de acción con radio extendido para mayor comodidad en celulares
      if (Math.hypot(t.x - b.jump.x, t.y - b.jump.y) < b.jump.r + 14 || (t.x > b.jump.x - 12 && t.x < b.jump.x + 35 && t.y > b.jump.y - 15 && t.y < b.jump.y + 35)) jump = true;
      if (Math.hypot(t.x - b.shoot.x, t.y - b.shoot.y) < b.shoot.r + 14 || (t.x > b.shoot.x - 22 && t.x < b.shoot.x + 22 && t.y > b.shoot.y - 20 && t.y < b.shoot.y + 25)) shoot = true;
      if (Math.hypot(t.x - b.kick.x, t.y - b.kick.y) < b.kick.r + 12 || (t.x > b.kick.x - 18 && t.x < b.kick.x + 25 && t.y > b.kick.y - 20 && t.y < b.kick.y + 25)) kick = true;
      if (t.x >= b.burger.x - 10 && t.x <= b.burger.x + b.burger.w + 14 && t.y >= b.burger.y - 10 && t.y <= b.burger.y + b.burger.h + 14) burger = true;
      if (t.x >= b.pause.x - 16 && t.x <= b.pause.x + b.pause.w + 16 && t.y >= 0 && t.y <= b.pause.y + b.pause.h + 16) pause = true;
    }
    this.jumpP = jump && !this.jump; this.kickP = kick && !this.kick; this.burgerP = burger && !this.burger;
    this.shootP = shoot && !this.shoot;
    this.pauseP = pause && !this.pause; this.anyP = any && !this.any; this.upP = u && !this.u;
    this.l = l; this.r = r; this.d = d; this.u = u; this.jump = jump; this.shoot = shoot; this.kick = kick; this.burger = burger; this.pause = pause; this.any = any;
  },
  // toque puntual (para menús): devuelve {x,y} del primer toque nuevo en este frame
  tap: null,
  drawTouchUI(p) {
    if (!IS_TOUCH && !hasTouch) return;
    const b = this.btn;
    ctx.globalAlpha = 0.28;
    // cruceta (botones redondeados y más grandes)
    const dp = b.dpad;
    const drawDirBtn = (ox, oy, on, type) => {
      ctx.globalAlpha = on ? 0.6 : 0.25;
      ctx.fillStyle = '#cfe8ff';
      ctx.beginPath(); ctx.arc(dp.x + ox, dp.y + oy, 26, 0, 7); ctx.fill();
      ctx.globalAlpha = 0.8; ctx.fillStyle = on ? '#000' : '#fff';
      ctx.beginPath();
      if (type === 'l') { ctx.moveTo(dp.x + ox - 6, dp.y + oy); ctx.lineTo(dp.x + ox + 4, dp.y + oy - 7); ctx.lineTo(dp.x + ox + 4, dp.y + oy + 7); }
      if (type === 'r') { ctx.moveTo(dp.x + ox + 6, dp.y + oy); ctx.lineTo(dp.x + ox - 4, dp.y + oy - 7); ctx.lineTo(dp.x + ox - 4, dp.y + oy + 7); }
      if (type === 'u') { ctx.moveTo(dp.x + ox, dp.y + oy - 6); ctx.lineTo(dp.x + ox - 7, dp.y + oy + 4); ctx.lineTo(dp.x + ox + 7, dp.y + oy + 4); }
      if (type === 'd') { ctx.moveTo(dp.x + ox, dp.y + oy + 6); ctx.lineTo(dp.x + ox - 7, dp.y + oy - 4); ctx.lineTo(dp.x + ox + 7, dp.y + oy - 4); }
      ctx.fill();
    };
    drawDirBtn(-40, 0, this.l, 'l');
    drawDirBtn(40, 0, this.r, 'r');
    drawDirBtn(0, -40, this.u, 'u');
    drawDirBtn(0, 40, this.d, 'd');
    // centro
    ctx.globalAlpha = 0.15; ctx.fillStyle = '#cfe8ff'; ctx.beginPath(); ctx.arc(dp.x, dp.y, 18, 0, 7); ctx.fill();
    // botones circulares
    const circ = (o, on, glow) => {
      ctx.globalAlpha = on ? 0.75 : (glow ? 0.55 : 0.3);
      ctx.fillStyle = o.col; ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, 7); ctx.fill();
      ctx.globalAlpha = 0.9; ctx.strokeStyle = on ? '#fff' : o.col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, 7); ctx.stroke();
      ctx.globalAlpha = 0.9; txt(o.label, o.x, o.y - 3, 6, '#fff', 'center', false);
    };
    circ(b.jump, this.jump);
    const shootCharged = p && p.charge >= 36;
    if (shootCharged) {
      ctx.globalAlpha = 0.5 + 0.4 * Math.sin(frame * 0.35);
      ctx.fillStyle = '#ff3fb0';
      ctx.beginPath(); ctx.arc(b.shoot.x, b.shoot.y, b.shoot.r + 5 + Math.sin(frame * 0.35) * 2, 0, 7); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const a = frame * 0.25 + i * 1.57;
        ctx.beginPath();
        ctx.moveTo(b.shoot.x + Math.cos(a) * (b.shoot.r + 2), b.shoot.y + Math.sin(a) * (b.shoot.r + 2));
        ctx.lineTo(b.shoot.x + Math.cos(a + 0.2) * (b.shoot.r + 7), b.shoot.y + Math.sin(a + 0.2) * (b.shoot.r + 7));
        ctx.stroke();
      }
    } else if (p && p.charge > 0) {
      const prog = Math.min(1, p.charge / 36);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.arc(b.shoot.x, b.shoot.y, b.shoot.r + 3, -Math.PI / 2, -Math.PI / 2 + prog * Math.PI * 2); ctx.stroke();
    }
    circ(b.shoot, this.shoot, shootCharged);
    const ready = p && p.meter >= 100;
    if (ready) {
      ctx.globalAlpha = 0.5 + 0.4 * Math.sin(frame * 0.3); ctx.fillStyle = '#ffe680'; ctx.beginPath(); ctx.arc(b.kick.x, b.kick.y, b.kick.r + 5 + Math.sin(frame * .3) * 2, 0, 7); ctx.fill();
      // rayos
      ctx.strokeStyle = '#fff59a'; ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) { const a = frame * 0.2 + i * 1.26; ctx.beginPath(); ctx.moveTo(b.kick.x + Math.cos(a) * (b.kick.r + 4), b.kick.y + Math.sin(a) * (b.kick.r + 4)); ctx.lineTo(b.kick.x + Math.cos(a + .3) * (b.kick.r + 11), b.kick.y + Math.sin(a + .3) * (b.kick.r + 11)); ctx.stroke(); }
    }
    circ(b.kick, this.kick, ready);
    if (!ready) { ctx.globalAlpha = .45; ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(b.kick.x, b.kick.y, b.kick.r - 1, 0, 7); ctx.fill(); ctx.globalAlpha = .7; txt('PATADA', b.kick.x, b.kick.y - 3, 6, '#aaa', 'center', false); }
    // Botón de pausa (esquina superior derecha)
    const pb = b.pause;
    ctx.globalAlpha = 0.8;
    R(pb.x, pb.y, pb.w, pb.h, '#18122b');
    ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 1;
    ctx.strokeRect(pb.x + 0.5, pb.y + 0.5, pb.w - 1, pb.h - 1);
    R(pb.x + 7, pb.y + 4, 3, 12, '#fff');
    R(pb.x + 14, pb.y + 4, 3, 12, '#fff');
    ctx.globalAlpha = 1;
  }
};
let hasTouch = IS_TOUCH;
window.addEventListener('keydown', e => { Input.keys[e.code] = true; if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault(); Audio.init(); });
window.addEventListener('keyup', e => { Input.keys[e.code] = false; });
function toGame(t) { return { x: (t.clientX - OFFX) / (SCALE || 1), y: (t.clientY - OFFY) / (SCALE || 1) }; }
function onTouchStart(e) {
  hasTouch = true; Audio.init();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i]; const g = toGame(t); Input.touches[t.identifier] = g; Input.tap = g;
  }
  goFullscreen();
}
function onTouchMove(e) {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i]; if (Input.touches[t.identifier]) Input.touches[t.identifier] = toGame(t);
  }
}
function onTouchEnd(e) {
  for (let i = 0; i < e.changedTouches.length; i++) {
    delete Input.touches[e.changedTouches[i].identifier];
  }
}
window.addEventListener('touchstart', onTouchStart, { passive: false });
window.addEventListener('touchmove', onTouchMove, { passive: false });
window.addEventListener('touchend', onTouchEnd, { passive: false });
window.addEventListener('touchcancel', onTouchEnd, { passive: false });
window.addEventListener('mousedown', e => { Audio.init(); const g = toGame(e); Input.tap = g; if (!IS_TOUCH && !hasTouch) { Input.touches['m'] = g; } });
window.addEventListener('mousemove', e => { if (Input.touches['m']) Input.touches['m'] = toGame(e); });
window.addEventListener('mouseup', () => { delete Input.touches['m']; });
let fsTried = false;
function goFullscreen() {
  if (fsTried || (!IS_TOUCH && !hasTouch)) return; fsTried = true;
  const el = document.documentElement;
  try {
    const rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen || el.mozRequestFullScreen;
    if (rfs) rfs.call(el);
  } catch (e) { }
  try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => { }); } catch (e) { }
  setTimeout(fit, 100);
  setTimeout(fit, 300);
}

// ============================================================
//  AUDIO: chiptune metal sintetizado (WebAudio)
// ============================================================
const Audio = {
  ac: null, master: null, dist: null, musicGain: null, sfxGain: null, noise: null,
  mode: 'off', bpm: 150, step: 0, nextT: 0, bar: 0, muteUntil: 0,
  init() {
    if (this.ac) { if (this.ac.state === 'suspended') this.ac.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext; this.ac = new AC();
      const ac = this.ac;
      this.master = ac.createGain(); this.master.gain.value = 0.5; this.master.connect(ac.destination);
      this.musicGain = ac.createGain(); this.musicGain.gain.value = 0.55; this.musicGain.connect(this.master);
      this.sfxGain = ac.createGain(); this.sfxGain.gain.value = 0.7; this.sfxGain.connect(this.master);
      // distorsión de guitarra
      this.dist = ac.createWaveShaper(); const n = 256, curve = new Float32Array(n), k = 40;
      for (let i = 0; i < n; i++) { const x = i * 2 / n - 1; curve[i] = (3 + k) * x * 20 * (Math.PI / 180) / (Math.PI + k * Math.abs(x)); }
      this.dist.curve = curve; this.dist.oversample = '2x';
      const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
      const dg = ac.createGain(); dg.gain.value = 0.35;
      this.dist.connect(lp); lp.connect(dg); dg.connect(this.musicGain);
      this.distIn = ac.createGain(); this.distIn.gain.value = 1; this.distIn.connect(this.dist);
      // ruido blanco
      const buf = ac.createBuffer(1, ac.sampleRate * 1, ac.sampleRate); const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; this.noise = buf;
      this.nextT = ac.currentTime + 0.1;
    } catch (e) { this.ac = null; }
  },
  freq(n) { return 440 * Math.pow(2, (n - 69) / 12); },
  // voz genérica
  tone(type, n, t, dur, vol, dest, slide) {
    const ac = this.ac; if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(this.freq(n), t);
    if (slide) o.frequency.exponentialRampToValueAtTime(this.freq(n + slide), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(dest || this.sfxGain); o.start(t); o.stop(t + dur + 0.02);
  },
  noiseHit(t, dur, vol, filt, fq) {
    const ac = this.ac; if (!ac) return;
    const s = ac.createBufferSource(); s.buffer = this.noise;
    const f = ac.createBiquadFilter(); f.type = filt; f.frequency.value = fq;
    const g = ac.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.sfxGain); s.start(t); s.stop(t + dur + 0.02);
  },
  drum(kind, t) {
    const ac = this.ac; if (!ac) return;
    if (kind === 'k') { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.12); g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.14); o.connect(g); g.connect(this.musicGain); o.start(t); o.stop(t + 0.16); }
    else if (kind === 's') { const s = ac.createBufferSource(); s.buffer = this.noise; const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1900; const g = ac.createGain(); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.13); s.connect(f); f.connect(g); g.connect(this.musicGain); s.start(t); s.stop(t + 0.15); }
    else { const s = ac.createBufferSource(); s.buffer = this.noise; const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 8000; const g = ac.createGain(); g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04); s.connect(f); f.connect(g); g.connect(this.musicGain); s.start(t); s.stop(t + 0.06); }
  },
  // ----- patrones -----
  pat: {
    level: { bpm: 152, bass: [40, 40, 40, 43, 40, 40, 46, 45, 40, 40, 40, 43, 47, 46, 45, 43], lead: [64, 0, 67, 0, 71, 0, 67, 66, 64, 0, 62, 0, 64, 0, 0, 0], leadAlt: [71, 0, 72, 0, 74, 0, 72, 71, 67, 0, 66, 0, 64, 0, 62, 0], drums: 'kh.hkhsh.hkh.hshk', kickAll: true },
    boss: { bpm: 186, bass: [38, 38, 45, 38, 44, 38, 38, 45, 38, 38, 46, 45, 44, 43, 41, 38], lead: [69, 72, 74, 72, 69, 0, 74, 76, 77, 76, 74, 72, 69, 0, 67, 0], leadAlt: [74, 0, 77, 0, 81, 0, 79, 77, 76, 74, 72, 0, 74, 0, 69, 0], drums: 'kkshkkshkkshkksh', kickAll: true },
    bonus: { bpm: 200, bass: [45, 45, 52, 52, 50, 50, 52, 52, 45, 45, 52, 52, 47, 47, 50, 50], lead: [69, 69, 69, 69, 72, 72, 72, 72, 76, 76, 76, 76, 74, 74, 72, 72], leadAlt: [77, 77, 77, 77, 76, 76, 76, 76, 74, 74, 74, 74, 72, 72, 69, 69], drums: 'khshkhshkhshkhsh', clean: true },
    title: { bpm: 120, bass: [40, 0, 0, 0, 40, 0, 0, 0, 43, 0, 0, 0, 45, 0, 0, 0], lead: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], leadAlt: [64, 0, 0, 0, 67, 0, 0, 0, 71, 0, 0, 0, 69, 0, 0, 0], drums: 'k.......s.......' },
    arena: { bpm: 170, bass: [41, 41, 41, 44, 41, 41, 47, 46, 41, 41, 41, 44, 48, 47, 46, 44], lead: [65, 0, 68, 0, 72, 0, 68, 67, 65, 0, 63, 0, 65, 0, 0, 0], leadAlt: [72, 0, 73, 0, 75, 0, 73, 72, 68, 0, 67, 0, 65, 0, 63, 0], drums: 'kkshkhshkkshkhsh', kickAll: true }
  },
  play(mode) { if (this.mode === mode) return; this.mode = mode; this.step = 0; this.bar = 0; if (this.ac) this.nextT = this.ac.currentTime + 0.05; },
  stop() { this.mode = 'off'; },
  // silencio momentáneo (para la patada)
  hush(sec) { if (!this.ac) return; const t = this.ac.currentTime; this.musicGain.gain.cancelScheduledValues(t); this.musicGain.gain.setValueAtTime(0.0001, t); this.musicGain.gain.setValueAtTime(0.55, t + sec); },
  update() {
    const ac = this.ac; if (!ac || this.mode === 'off') return;
    const p = this.pat[this.mode]; if (!p) return;
    const stepDur = 60 / p.bpm / 4;
    while (this.nextT < ac.currentTime + 0.12) {
      const t = this.nextT, i = this.step % 16;
      if (this.step % 16 === 0 && this.step > 0) this.bar++;
      const dest = p.clean ? this.musicGain : this.distIn;
      const b = p.bass[i];
      if (b) { this.tone('sawtooth', b, t, stepDur * 0.9, p.clean ? 0.18 : 0.5, dest); if (!p.clean) this.tone('square', b - 12, t, stepDur * 0.9, 0.25, dest); }
      const lead = (this.bar % 2 === 1) ? p.leadAlt : p.lead; const l = lead[i];
      if (l) this.tone('square', l, t, stepDur * (p.clean ? 0.5 : 1.6), p.clean ? 0.12 : 0.22, p.clean ? this.musicGain : this.distIn);
      const d = p.drums[i];
      if (d === 'k' || (p.kickAll && i % 2 === 0)) this.drum('k', t);
      if (d === 's') this.drum('s', t);
      if (d === 'h' || p.kickAll) this.drum('h', t);
      this.step++; this.nextT += stepDur;
    }
  },
  // ----- SFX -----
  t0() { return this.ac ? this.ac.currentTime : 0; },
  sShoot() { this.tone('square', 76, this.t0(), 0.08, 0.18, null, -14); },
  sCharge(p) { this.tone('sawtooth', 50 + p * 24, this.t0(), 0.06, 0.12); },
  sRayo() { const t = this.t0(); this.tone('sawtooth', 45, t, 0.35, 0.4, null, 24); this.noiseHit(t, 0.3, 0.4, 'lowpass', 1200); },
  sCoin() { const t = this.t0(); this.tone('square', 83, t, 0.06, 0.2); this.tone('square', 88, t + 0.06, 0.16, 0.2); },
  sJump() { this.tone('square', 60, this.t0(), 0.12, 0.15, null, 10); },
  sHurt() { const t = this.t0(); this.tone('sawtooth', 50, t, 0.25, 0.3, null, -12); this.noiseHit(t, 0.2, 0.3, 'lowpass', 900); },
  sExplo(big) { const t = this.t0(); this.noiseHit(t, big ? 0.7 : 0.3, big ? 0.9 : 0.5, 'lowpass', big ? 700 : 1500); this.tone('sine', 36, t, big ? 0.5 : 0.2, 0.6, null, -12); },
  sHit() { this.noiseHit(this.t0(), 0.06, 0.25, 'bandpass', 2500); },
  sBurger() { const t = this.t0(); [72, 76, 79, 84].forEach((n, i) => this.tone('square', n, t + i * 0.06, 0.1, 0.18)); },
  sPickup() { const t = this.t0(); [67, 71, 74, 79, 83].forEach((n, i) => this.tone('square', n, t + i * 0.05, 0.12, 0.16)); },
  sAlarm() { const t = this.t0(); for (let i = 0; i < 4; i++) this.tone('square', 70, t + i * 0.18, 0.12, 0.25, null, 5); },
  sKick() { const t = this.t0(); this.hush(0.5); this.tone('sawtooth', 40, t + 0.5, 1.2, 0.7, this.distIn); this.tone('sawtooth', 47, t + 0.5, 1.2, 0.5, this.distIn); this.tone('square', 28, t + 0.5, 0.9, 0.5, this.distIn); this.noiseHit(t + 0.5, 0.6, 0.9, 'lowpass', 600); },
  sStatic() { this.noiseHit(this.t0(), 0.35, 0.5, 'highpass', 1500); },
  sInsert() { const t = this.t0(); this.noiseHit(t, 0.05, 0.3, 'bandpass', 3000); this.tone('square', 84, t + 0.08, 0.06, 0.2); this.tone('square', 91, t + 0.14, 0.2, 0.2); },
  sBuy() { const t = this.t0(); this.tone('square', 79, t, 0.07, 0.2); this.tone('square', 86, t + 0.08, 0.2, 0.2); },
  sNo() { this.tone('square', 45, this.t0(), 0.2, 0.2, null, -5); },
  sVictory() { const t = this.t0(); [64, 67, 71, 76, 0, 76, 76].forEach((n, i) => { if (n) this.tone('square', n, t + i * 0.12, 0.25, 0.25); }); this.tone('sawtooth', 40, t + 0.85, 1.4, 0.6, this.distIn); this.tone('sawtooth', 47, t + 0.85, 1.4, 0.4, this.distIn); },
  sPortal() { const t = this.t0(); for (let i = 0; i < 24; i++) this.tone('sawtooth', 40 + i * 2, t + i * 0.09, 0.15, 0.12); }
};
