// ============================================================
//  NIVELES
// ============================================================
function newLevel(id, w) {
  return { id, w, solids: [], enemies: [], pb: [], eb: [], coins: [], pickups: [], camx: 0, spd: 1, hpMul: 1, friction: 0.72, slippery: false, wind: 0,
    groundY: 230, boss: null, bossX: 0, state: 'play', msg: null, wave: null, blast: null, t: 0, arena: null, bonus: null, clearT: 0, hazT: 0 };
}
function ground(lv, x1, x2, y, opt) { const s = Object.assign({ x: x1, y, w: x2 - x1, h: H - y + 40 }, opt || {}); lv.solids.push(s); return s; }
function plat(lv, x, y, w, opt) { const s = Object.assign({ x, y, w, h: 6, thin: true }, opt || {}); lv.solids.push(s); return s; }
function coinLine(lv, x, y, n, dx) { for (let i = 0; i < n; i++) lv.coins.push({ x: x + i * (dx || 14), y, vx: 0, vy: 0, t: i * 5, life: 999999, ground: true }); }
function coinArc(lv, x, y, n) { for (let i = 0; i < n; i++) lv.coins.push({ x: x + i * 14, y: y - Math.sin(i / (n - 1) * Math.PI) * 26, vx: 0, vy: 0, t: i * 5, life: 999999, ground: true }); }

const LEVEL_NAMES = ['LA COCINA DE NEÓN', 'LOS TEJADOS DE LA CIBER-CIUDAD', 'LA FORTALEZA THEOBROMA'];

// ---- Nivel 1: La Cocina de Neón ----
function buildLevel1() {
  const lv = newLevel(1, 2400); lv.slippery = true; lv.friction = 0.9;
  ground(lv, 0, 2400, 230);
  // parrillas (se encienden y apagan)
  [420, 760, 1120, 1480, 1700].forEach((x, i) => { lv.solids.push({ x, y: 228, w: 60, h: 4, grill: true, on: false, phase: i * 45, hazard: true }); });
  plat(lv, 300, 180, 70); plat(lv, 560, 170, 60); plat(lv, 660, 140, 50); plat(lv, 900, 175, 80); plat(lv, 1250, 165, 60); plat(lv, 1350, 130, 60); plat(lv, 1620, 175, 90);
  coinLine(lv, 305, 168, 5); coinArc(lv, 440, 215, 5); coinLine(lv, 665, 128, 4); coinArc(lv, 1130, 215, 5); coinLine(lv, 1355, 118, 5); coinArc(lv, 1710, 215, 5); coinLine(lv, 1625, 163, 6);
  lv.pickups.push({ x: 940, y: 175, type: 'fries' }); lv.pickups.push({ x: 1380, y: 130, type: 'burger' });
  spawnEnemy(lv, 'taza', 380, 150); spawnEnemy(lv, 'espatula', 520, 230); spawnEnemy(lv, 'taza', 720, 140); spawnEnemy(lv, 'taza', 800, 170);
  spawnEnemy(lv, 'espatula', 980, 230); spawnEnemy(lv, 'taza', 1080, 150); spawnEnemy(lv, 'espatula', 1200, 230); spawnEnemy(lv, 'taza', 1300, 130);
  spawnEnemy(lv, 'espatula', 1450, 230); spawnEnemy(lv, 'espatula', 1520, 230); spawnEnemy(lv, 'taza', 1560, 160); spawnEnemy(lv, 'taza', 1660, 140); spawnEnemy(lv, 'dron', 1800, 120);
  lv.bossX = 1920; lv.makeBoss = () => new BossMicroondas(1920 + 380);
  return lv;
}
// ---- Nivel 2: Los Tejados ----
function buildLevel2() {
  const lv = newLevel(2, 2800); lv.wind = -0.045; lv.friction = 0.7;
  const segs = [[0, 300, 230], [355, 620, 215], [700, 900, 230], [965, 1250, 205], [1330, 1500, 230], [1580, 1900, 220], [1975, 2200, 230], [2280, 2800, 230]];
  for (const s of segs) ground(lv, s[0], s[1], s[2], { roof: true });
  plat(lv, 460, 160, 60); plat(lv, 1050, 150, 60); plat(lv, 1700, 165, 70);
  // bloques invisibles (solo el visor los revela)
  plat(lv, 1340, 190, 30, { invisible: true }); plat(lv, 1390, 160, 30, { invisible: true }); plat(lv, 1440, 130, 30, { invisible: true }); plat(lv, 1500, 110, 90, { invisible: true });
  coinLine(lv, 1505, 98, 6); coinArc(lv, 400, 195, 6); coinLine(lv, 465, 148, 4); coinArc(lv, 1000, 185, 6); coinLine(lv, 1055, 138, 4); coinArc(lv, 1620, 200, 8); coinLine(lv, 2020, 215, 6);
  lv.pickups.push({ x: 1740, y: 165, type: 'burger' });
  spawnEnemy(lv, 'dron', 340, 120); spawnEnemy(lv, 'taza', 560, 150); spawnEnemy(lv, 'pinball', 820, 230, { drop: 'visor' }); spawnEnemy(lv, 'dron', 950, 110);
  spawnEnemy(lv, 'taza', 1100, 140); spawnEnemy(lv, 'dron', 1290, 110); spawnEnemy(lv, 'pinball', 1450, 230); spawnEnemy(lv, 'dron', 1560, 120);
  spawnEnemy(lv, 'espatula', 1750, 220); spawnEnemy(lv, 'taza', 1820, 150); spawnEnemy(lv, 'pinball', 2100, 230); spawnEnemy(lv, 'dron', 2150, 110); spawnEnemy(lv, 'taza', 2250, 140);
  lv.bossX = 2320; lv.makeBoss = () => new BossZepelin(2320 + 300);
  return lv;
}
// ---- Nivel 3: La Fortaleza Theobroma ----
function buildLevel3() {
  const lv = newLevel(3, 2600); lv.friction = 0.72;
  ground(lv, 0, 2600, 230);
  // cintas transportadoras (empujan hacia los láseres)
  [[300, 500, 1.1], [700, 880, -1.1], [1100, 1300, 1.3], [1500, 1700, 1.3], [1850, 2000, -1.2]].forEach(c => lv.solids.push({ x: c[0], y: 230, w: c[1] - c[0], h: 40, conv: c[2] }));
  // láseres intermitentes
  [520, 1320, 1720].forEach((x, i) => lv.solids.push({ x, y: 150, w: 6, h: 80, laser: true, on: true, phase: i * 60, hazard: true }));
  // techos bajos: pasillos estrechos
  [[600, 700, 206], [1360, 1480, 206], [1960, 2060, 206]].forEach(c => lv.solids.push({ x: c[0], y: 60, w: c[1] - c[0], h: c[2] - 60, ceiling: true }));
  plat(lv, 900, 175, 80); plat(lv, 1010, 145, 50); plat(lv, 1750, 170, 60);
  coinLine(lv, 320, 215, 6, 18); coinLine(lv, 905, 163, 5); coinLine(lv, 1015, 133, 3); coinArc(lv, 1140, 215, 6); coinLine(lv, 1755, 158, 4); coinArc(lv, 1870, 215, 6);
  lv.pickups.push({ x: 120, y: 230, type: 'glove' }); lv.pickups.push({ x: 1035, y: 145, type: 'burger' });
  spawnEnemy(lv, 'centinela', 420, 230); spawnEnemy(lv, 'taza', 560, 130); spawnEnemy(lv, 'centinela', 800, 230); spawnEnemy(lv, 'dron', 960, 100);
  spawnEnemy(lv, 'centinela', 1200, 230); spawnEnemy(lv, 'centinela', 1260, 230); spawnEnemy(lv, 'taza', 1540, 150); spawnEnemy(lv, 'espatula', 1600, 230); spawnEnemy(lv, 'dron', 1650, 110);
  spawnEnemy(lv, 'centinela', 1900, 230); spawnEnemy(lv, 'pinball', 2000, 230); spawnEnemy(lv, 'centinela', 2090, 230);
  lv.bossX = 2120; lv.makeBoss = () => new BossNucleo(2120 + 240);
  return lv;
}
// ---- Cámara de la Lluvia Dorada (bonificación) ----
function buildBonus() {
  const lv = newLevel(9, W); ground(lv, 0, W, 230);
  lv.bonus = { time: 30 * 60, got: 0, missed: 0, total: 0, spawnT: 0, done: false };
  return lv;
}
// ---- Coliseo Glitch (arena infinita) ----
function buildArena() {
  const lv = newLevel(8, W); ground(lv, 40, 440, 230); plat(lv, 90, 165, 70); plat(lv, 320, 165, 70); plat(lv, 205, 120, 70);
  lv.solids.push({ x: 150, y: 228, w: 60, h: 4, grill: true, on: false, phase: 0, hazard: false }); lv.solids.push({ x: 290, y: 228, w: 60, h: 4, grill: true, on: false, phase: 90, hazard: false });
  lv.solids.push({ x: 60, y: 230, w: 120, h: 40, conv: 0, convBase: 1.1 }); lv.solids.push({ x: 300, y: 230, w: 120, h: 40, conv: 0, convBase: -1.1 });
  lv.arena = { wave: 0, kills: 0, pending: 0, waveT: 90, scen: 0, rain: 0, bossWave: false, spawned: 0, best: Save.data.best };
  return lv;
}

// hazards que se encienden/apagan
function updateHazards(lv) {
  lv.hazT++;
  for (const s of lv.solids) {
    if (s.hazard === false) { s.on = false; continue; }
    if (s.grill) s.on = ((lv.hazT + s.phase) % 180) < 80;
    if (s.laser) s.on = ((lv.hazT + s.phase) % 200) < 110;
  }
}

// ============================================================
//  FONDOS
// ============================================================
function drawSky(c1, c2) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }

// ============================================================
//  FONDO CON LOS RECORTES DEL VIDEO (salón arcade) + tinte por escenario
// ============================================================
const BG_W = 466; // 824 px del video = 466 unidades de juego
function drawGround(x, y, w, h) { // losa con borde de neón recortada del video
  const tileH = 42, capW = sprW('plat_cap', tileH), midW = sprW('plat_mid', tileH);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, Math.max(h, tileH)); ctx.clip();
  if (w >= capW * 2 + 4) {
    for (let i = x + capW; i < x + w - capW; i += midW) spr('plat_mid', i, y, tileH, 'tl');
    spr('plat_cap', x, y, tileH, 'tl'); spr('plat_cap', x + w - capW, y, tileH, 'tl', true);
  } else { spr('plat_cap', x, y, tileH, 'tl'); spr('plat_cap', x + w - capW, y, tileH, 'tl', true); }
  if (h > tileH) { R(x, y + tileH, w, h - tileH, '#15101f'); for (let i = 0; i < w; i += 18) R(x + i, y + tileH, 1, h - tileH, '#22182e'); }
  ctx.restore();
}
function drawSlab(x, y, w, neon) { // plataforma delgada: solo la parte superior de la losa
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, 12); ctx.clip(); drawGround(x, y, w, 12); ctx.restore();
  ctx.globalAlpha = .9; R(x + 2, y + 11, w - 4, 2, neon); ctx.globalAlpha = 1;
}
function drawBG(lv, scen) {
  if (!Assets.ok || !Assets.bgOk) return drawBGRect(lv, scen);
  const id = scen !== undefined ? scen : lv.id; const cx = lv.camx;
  // sala arcade con paralaje, repetida horizontalmente
  const par = cx * 0.55; let x0 = -(par % BG_W); if (x0 > 0) x0 -= BG_W;
  ctx.imageSmoothingEnabled = true;
  for (let x = x0; x < W; x += BG_W) ctx.drawImage(Assets.bg, 0, 0, 824, 400, Math.round(x), 0, BG_W, 226);
  ctx.imageSmoothingEnabled = false;
  R(0, 226, W, H - 226, '#0c0816');
  // tinte por escenario
  if (id === 2) { ctx.globalAlpha = .30; R(0, 0, W, H, '#3b1560'); ctx.globalAlpha = 1;
    // lluvia de píxeles sobre los tejados
    for (let i = 0; i < 40; i++) { const x = (i * 131 - frame * 3 - cx * 0.6) % (W + 40), y = (i * 71 + frame * 6) % (H + 20); R(((x % (W + 40)) + W + 40) % (W + 40) - 20, y - 10, 1, 6, '#7fb8ff'); } }
  else if (id === 3) { ctx.globalAlpha = .34; R(0, 0, W, H, '#6a1a12'); ctx.globalAlpha = .12 + .08 * Math.sin(frame * .1); R(0, 0, W, H, '#ff3f1f'); ctx.globalAlpha = 1; }
  else { ctx.globalAlpha = .10; R(0, 0, W, H, '#0b6a7a'); ctx.globalAlpha = 1; }
  const neon = id === 1 ? '#37f0ff' : id === 2 ? '#a34dff' : '#ff8c00';
  // sólidos
  for (const s of lv.solids) { if (s.thin || s.laser || s.grill || s.off || s.tile) continue; const x = Math.round(s.x - cx);
    if (x + s.w < -4 || x > W + 4) continue;
    if (s.ceiling) { R(x, s.y, s.w, s.h, '#1c1420'); R(x, s.y + s.h - 4, s.w, 4, '#5a4a6a'); for (let i = 0; i < s.w; i += 10) R(x + i, s.y + s.h - 12, 4, 8, '#120c16'); ctx.globalAlpha = .5; R(x, s.y + s.h - 1, s.w, 1, neon); ctx.globalAlpha = 1; continue; }
    if (s.conv) { R(x, s.y, s.w, s.h, '#26262e'); R(x, s.y, s.w, 6, '#404050'); const off = (frame * s.conv * 1.5) % 16; for (let i = -16; i < s.w; i += 16) { const ax = x + i + off; if (ax >= x && ax + 6 <= x + s.w) { R(ax, s.y + 1, 6, 4, '#ffd23f'); R(ax + (s.conv > 0 ? 6 : -2), s.y + 2, 2, 2, '#ffd23f'); } } continue; }
    drawGround(x, s.y, s.w, s.h);
  }
  // plataformas delgadas
  for (const s of lv.solids) if (s.thin) { if (s.invisible && !(GAME.p && GAME.p.items.visor)) continue; const x = Math.round(s.x - cx);
    if (s.invisible) { ctx.globalAlpha = .55 + .2 * Math.sin(frame * .2); R(x, s.y, s.w, 6, '#31ff8a'); ctx.globalAlpha = .3; R(x + 2, s.y + 2, s.w - 4, 2, '#fff'); ctx.globalAlpha = 1; continue; }
    drawSlab(x, s.y, s.w, neon); }
  // parrillas y láseres (igual que la versión por rectángulos)
  for (const s of lv.solids) if (s.grill) { const x = Math.round(s.x - cx); R(x, s.y, s.w, 6, '#1a1a1a'); for (let i = 2; i < s.w; i += 8) R(x + i, s.y + 1, 4, 4, s.on ? (frame % 6 < 3 ? '#ff4d00' : '#ff8c00') : '#3a3a3a'); if (s.on) { ctx.globalAlpha = .35; R(x, s.y - 14, s.w, 14, '#ff6a00'); ctx.globalAlpha = 1; } }
  for (const s of lv.solids) if (s.laser) { const x = Math.round(s.x - cx); R(x - 4, 146, 14, 6, '#555'); R(x - 4, 228, 14, 6, '#555'); R(x, 148, 6, 2, s.on ? '#ff2b2b' : '#5a1a1a'); if (s.on) { ctx.globalAlpha = .85; R(x + 1, s.y, 4, s.h, '#ff2b2b'); R(x + 2, s.y, 2, s.h, '#fff'); ctx.globalAlpha = 1; } }
}
function drawBGRect(lv, scen) {
  const id = scen !== undefined ? scen : lv.id; const cx = lv.camx;
  if (id === 1) { // cocina de neón
    drawSky('#0b1a24', '#0f2a33');
    for (let x = -(cx * 0.3 % 32); x < W; x += 32) for (let y = 40; y < 230; y += 32) { R(x, y, 31, 31, '#10333d'); R(x, y, 31, 1, '#1a4a55'); }
    // neones y utensilios
    const nx = -(cx * 0.5 % 600);
    for (let i = 0; i < 3; i++) { const x = nx + i * 600; R(x + 60, 60, 90, 22, '#071a20'); txt('FRY', x + 105, 66, 10, frame % 60 < 50 ? '#ff3fb0' : '#5a1a40', 'center', false); R(x + 300, 70, 60, 16, '#071a20'); txt('24h', x + 330, 73, 8, '#37f0ff', 'center', false);
      R(x + 200, 130, 40, 60, '#1c3a44'); R(x + 205, 135, 30, 20, '#2b5560'); R(x + 450, 120, 60, 70, '#1c3a44'); R(x + 455, 125, 50, 30, '#0d2a33'); for (let k = 0; k < 4; k++) R(x + 458 + k * 12, 128 + (frame % 10 < 5 ? 0 : 1), 3, 3, '#ff8c00'); }
    // suelo de baldosas con aceite
    for (const s of lv.solids) if (!s.thin && !s.grill && !s.laser && !s.off && !s.tile) { const x = Math.round(s.x - cx); R(x, s.y, s.w, s.h, '#233'); for (let i = 0; i < s.w; i += 16) { R(x + i, s.y, 15, 8, (i / 16) % 2 ? '#3a4a52' : '#2e3c44'); R(x + i, s.y + 8, 15, 1, '#1a2226'); } ctx.globalAlpha = .25; for (let i = 20; i < s.w; i += 90) R(x + i, s.y + 1, 40, 4, '#a0f'); ctx.globalAlpha = 1; }
  } else if (id === 2) { // tejados
    drawSky('#12082a', '#3b1560');
    for (let i = 0; i < 30; i++) { R((i * 97 + frame * 0.05) % W, (i * 53) % 120, 1, 1, '#fff'); }
    const bx = -(cx * 0.2 % 240);
    for (let i = 0; i < 4; i++) { const x = bx + i * 240; R(x, 100, 60, 170, '#1b1035'); R(x + 90, 60, 50, 210, '#221446'); R(x + 170, 120, 55, 150, '#1b1035'); for (let y = 70; y < 220; y += 12) for (let k = 0; k < 4; k++) if ((y * 7 + k * 13 + i) % 5 < 2) R(x + 95 + k * 11, y, 4, 5, '#ffd23f'); for (let y = 110; y < 220; y += 12) for (let k = 0; k < 4; k++) if ((y * 3 + k * 7) % 4 < 1) R(x + 5 + k * 13, y, 4, 5, '#37f0ff'); }
    const hx = -(cx * 0.45 % 700);
    for (let i = 0; i < 3; i++) { const x = hx + i * 700 + 100; ctx.globalAlpha = .55 + .1 * Math.sin(frame * .1); R(x, 40, 120, 30, '#2a0d3d'); txt('CACAO', x + 60, 46, 10, '#ff3fb0', 'center', false); txt('THEOBROMA', x + 60, 58, 7, '#37f0ff', 'center', false); ctx.globalAlpha = 1; }
    // lluvia de píxeles
    ctx.fillStyle = '#7fb8ff'; for (let i = 0; i < 40; i++) { const x = (i * 131 - frame * 3 - cx * 0.6) % (W + 40), y = (i * 71 + frame * 6) % (H + 20); R(((x % (W + 40)) + W + 40) % (W + 40) - 20, y - 10, 1, 6, '#7fb8ff'); }
    for (const s of lv.solids) if (!s.thin && !s.off && !s.tile) { const x = Math.round(s.x - cx); R(x, s.y, s.w, s.h, '#14102a'); R(x, s.y, s.w, 4, '#3c3560'); for (let i = 0; i < s.w; i += 12) R(x + i, s.y + 1, 11, 2, (i / 12) % 2 ? '#5a5288' : '#4a4478'); for (let y = s.y + 14; y < H; y += 14) for (let i = 6; i < s.w - 6; i += 14) if ((i + y) % 3 === 0) R(x + i, y, 5, 6, '#ffd23f'); }
  } else if (id === 3) { // fortaleza
    drawSky('#1a0f14', '#2b1a20');
    for (let x = -(cx * 0.3 % 40); x < W; x += 40) for (let y = 0; y < 230; y += 40) { R(x, y, 39, 39, '#3a2530'); R(x + 2, y + 2, 35, 35, '#31202a'); R(x + 17, y + 17, 5, 5, '#20141a'); }
    const px = -(cx * 0.5 % 320);
    for (let i = 0; i < 3; i++) { const x = px + i * 320; R(x, 30, 14, 200, '#5a3a2a'); R(x + 3, 30, 3, 200, '#8a5a3a'); R(x + 40, 90, 240, 10, '#5a3a2a'); R(x + 40, 92, 240, 2, '#8a5a3a'); R(x + 130, 100, 40, 40, '#4a2d22'); R(x + 135, 105, 30, 30, '#2a1a12'); R(x + 140, 110, 20, 20, frame % 20 < 10 ? '#ff8c00' : '#b35a00'); }
    ctx.globalAlpha = .5; txt('THEOBROMA CACAO', W / 2 - (cx * 0.5 % 900) + 450, 50, 9, '#ff8c00', 'center', false); ctx.globalAlpha = 1;
    for (const s of lv.solids) { if (s.thin || s.laser || s.off || s.tile) continue; const x = Math.round(s.x - cx);
      if (s.ceiling) { R(x, s.y, s.w, s.h, '#3a2530'); R(x, s.y + s.h - 4, s.w, 4, '#6a4a3a'); for (let i = 0; i < s.w; i += 10) R(x + i, s.y + s.h - 12, 4, 8, '#2a1a20'); continue; }
      if (s.conv) { R(x, s.y, s.w, s.h, '#26262e'); R(x, s.y, s.w, 6, '#404050'); const off = (frame * s.conv * 1.5) % 16; for (let i = -16; i < s.w; i += 16) { const ax = x + i + off; if (ax >= x && ax + 6 <= x + s.w) { R(ax, s.y + 1, 6, 4, '#ffd23f'); R(ax + (s.conv > 0 ? 6 : -2), s.y + 2, 2, 2, '#ffd23f'); } } }
      else { R(x, s.y, s.w, s.h, '#3a3a44'); R(x, s.y, s.w, 3, '#6a6a7a'); for (let i = 0; i < s.w; i += 20) R(x + i, s.y + 3, 1, 12, '#26262e'); }
    }
    // bandas rojas de peligro
    for (const s of lv.solids) if (s.laser) { const x = Math.round(s.x - cx); R(x - 4, 146, 14, 6, '#555'); R(x - 4, 228, 14, 6, '#555'); R(x, 148, 6, 2, s.on ? '#ff2b2b' : '#5a1a1a'); }
  }
  // plataformas delgadas
  for (const s of lv.solids) if (s.thin) { if (s.invisible && !(GAME.p && GAME.p.items.visor)) continue; const x = Math.round(s.x - cx);
    if (s.invisible) { ctx.globalAlpha = .55 + .2 * Math.sin(frame * .2); R(x, s.y, s.w, 6, '#31ff8a'); ctx.globalAlpha = .3; R(x + 2, s.y + 2, s.w - 4, 2, '#fff'); ctx.globalAlpha = 1; continue; }
    R(x, s.y, s.w, 6, id === 1 ? '#8a3a10' : id === 2 ? '#5a5288' : '#5a5a6a'); R(x, s.y, s.w, 2, id === 1 ? '#ff8c00' : id === 2 ? '#37f0ff' : '#ff8c00'); }
  // parrillas
  for (const s of lv.solids) if (s.grill) { const x = Math.round(s.x - cx); R(x, s.y, s.w, 6, '#1a1a1a'); for (let i = 2; i < s.w; i += 8) R(x + i, s.y + 1, 4, 4, s.on ? (frame % 6 < 3 ? '#ff4d00' : '#ff8c00') : '#3a3a3a'); if (s.on) { ctx.globalAlpha = .35; R(x, s.y - 14, s.w, 14, '#ff6a00'); ctx.globalAlpha = 1; } }
  for (const s of lv.solids) if (s.laser && s.on) { const x = Math.round(s.x - cx); ctx.globalAlpha = .85; R(x + 1, s.y, 4, s.h, '#ff2b2b'); R(x + 2, s.y, 2, s.h, '#fff'); ctx.globalAlpha = 1; }
}

// ============================================================
//  JEFES
// ============================================================
class Boss {
  constructor(x, hp, name) { this.x = x; this.y = 230; this.hp = hp; this.maxHp = hp; this.name = name; this.t = 0; this.dead = false; this.deadT = 0; this.hurt = 0; this.face = -1; this.w = 40; this.h = 40; this.state = 'enter'; this.st = 0; this.intro = 90; }
  box() { return { x: this.x - this.w / 2, y: this.y - this.h, w: this.w, h: this.h }; }
  hitTest(bb) { return aabb(bb, this.box()); }
  damage(n, lv, p) { if (this.dead) return; this.hp -= n; this.hurt = 6; Audio.sHit(); if (this.hp <= 0) { this.hp = 0; this.die(lv, p); } }
  takeHit(b, lv, p) { this.damage(b.dmg, lv, p); spawnParts(b.x, b.y, 6, ['#fff', '#ff3fb0'], 2, 12); return 'hit'; }
  takeKick(lv, p) { this.damage(Math.ceil(this.maxHp / 3), lv, p); spawnParts(this.x, this.y - this.h / 2, 40, ['#ffd23f', '#fff'], 5, 40); }
  die(lv, p) { this.dead = true; this.deadT = 0; Audio.sVictory(); p.score += 2000; buzz([150, 60, 300]); }
  go(s) { this.state = s; this.st = 0; }
  drawBar(lv) { const wdt = 160, x = W / 2 - wdt / 2; txt(this.name, W / 2, 22, 7, '#ffb3e0', 'center'); R(x - 1, 31, wdt + 2, 8, '#000'); R(x, 32, wdt, 6, '#3a0a1a'); R(x, 32, Math.round(wdt * this.hp / this.maxHp), 6, this.hurt > 0 ? '#fff' : '#ff2b5c'); for (let i = 1; i < 3; i++) R(x + i * wdt / 3, 32, 1, 6, '#000'); }
  deathFX(lv) { this.deadT++; if (this.deadT % 6 === 0) { spawnParts(this.x + rnd(-this.w / 2, this.w / 2), this.y - rnd(0, this.h), 20, ['#ffb347', '#fff', '#ff5e2b', '#aaa'], 3, 30, 0.05); Audio.sExplo(false); shake(4); } if (this.deadT % 10 === 0) dropCoins(lv, this.x, this.y - this.h / 2, 3); }
}

// ---- Jefe 1: Horno Microondas ----
class BossMicroondas extends Boss {
  constructor(x) { super(x, 60, 'HORNO MICROONDAS'); this.w = 56; this.h = 44; this.door = false; this.spin = 0; this.kami = false; this.vy = 0; this.jumpFrom = 0; this.jumpTo = 0; this.grills = []; }
  update(lv, p) {
    this.t++; this.st++; if (this.hurt > 0) this.hurt--;
    if (this.dead) { this.deathFX(lv); return; }
    this.face = p.x > this.x ? 1 : -1;
    if (this.state === 'enter') { if (this.st === 1) { this.y = -20; Audio.sAlarm(); } this.y = Math.min(230, this.y + 6); if (this.y >= 230 && this.st > 50) { shake(10); buzz(100); this.go('idle'); } return; }
    if (!this.kami && this.hp <= 15) { this.kami = true; this.go('kami'); Audio.sAlarm(); }
    switch (this.state) {
      case 'idle': this.door = false; if (this.st > 55) this.go(this.st % 2 === 0 ? 'wave' : (Math.random() < 0.55 ? 'wave' : 'jump')); break;
      case 'wave': this.door = true; if (this.st === 25 || this.st === 70) { lv.eb.push({ x: this.x + this.face * 30, y: 230, vx: this.face * 2.4 * lv.spd, vy: 0, w: 16, h: 26, dmg: 2, type: 'wave', life: 260 }); Audio.sRayo(); shake(3); } if (this.st > 110) this.go('idle'); break;
      case 'jump': this.door = false; if (this.st === 1) { this.vy = -9; this.jumpFrom = this.x; this.jumpTo = lv.camx + W / 2; } this.x = lerp(this.jumpFrom, this.jumpTo, Math.min(1, this.st / 50)); this.y += this.vy; this.vy += 0.36; if (this.y >= 230 && this.st > 10) { this.y = 230; shake(12); buzz(120); Audio.sExplo(true); for (const s of lv.solids) if (s.grill) s.on = true; this.go('spin'); } break;
      case 'spin': this.spin++; if (this.st % 11 === 0) { const a = rnd(-2.6, -0.5); lv.eb.push({ x: this.x, y: this.y - 30, vx: Math.cos(a) * rnd(1.5, 3.5), vy: Math.sin(a) * 4, g: 0.15, w: 12, h: 4, dmg: 1, type: 'plate', life: 150, shatter: true }); }
        // parrillas del jefe: franjas del suelo se calientan
        if (this.st % 40 === 0) { const gx = lv.camx + rint(0, 5) * 80; lv.eb.push({ x: gx + 40, y: 226, vx: 0, vy: 0, w: 80, h: 8, dmg: 1, type: 'orb', col: '#ff6a00', life: 60, floorFlame: true }); }
        if (this.st > 150) { this.go('idle'); } break;
      case 'kami': if (this.st % 6 === 0) spawnParts(this.x + rnd(-28, 28), this.y - rnd(0, 44), 3, ['#ff2b2b', '#ffd23f'], 1.5, 12); if (this.st === 200) { // detonación
          shake(20); flash(20, '#ff8c00'); Audio.sExplo(true); buzz(300); spawnParts(this.x, this.y - 20, 80, ['#ff8c00', '#fff', '#ff2b2b'], 7, 50, 0.05); this.die(lv, p); } break;
    }
  }
  takeHit(b, lv, p) { let d = b.dmg; if (!this.door && !b.charged && this.state !== 'kami') d = 0.5; this.damage(d, lv, p); spawnParts(b.x, b.y, 6, ['#fff', '#ff3fb0'], 2, 12); return 'hit'; }
  draw(lv) {
    const x = Math.round(this.x - lv.camx), y = Math.round(this.y);
    ctx.save(); ctx.translate(x, y); ctx.scale(this.face, 1);
    if (this.hurt > 0) ctx.globalAlpha = .6;
    const glow = this.state === 'kami' ? (this.st % 8 < 4 ? '#ff2b2b' : '#ff8c00') : null;
    if (this.state === 'spin') ctx.rotate(Math.sin(this.spin * 0.6) * 0.25);
    R(-28, -44, 56, 44, glow || '#c9cdd3'); R(-26, -42, 52, 40, glow ? '#ff6a2b' : '#e8ebef'); // carcasa
    R(-26, -42, 38, 40, '#2a2f3a'); // marco puerta
    if (this.door) { R(-30, -40, 6, 36, '#e8ebef'); R(-24, -40, 34, 36, '#3a1a4a'); R(-20, -36, 26, 28, '#a34dff'); R(-18, -32, 12, 12, '#d9a6ff'); R(-8, -20, 10, 10, '#fff'); } // puerta abierta: panel expuesto
    else { R(-24, -40, 34, 36, '#3a3f4a'); R(-22, -38, 30, 32, '#4a5060'); R(-20, -36, 26, 3, '#7a8090'); }
    // panel de control
    R(14, -40, 10, 36, '#8a8f99'); R(16, -36, 6, 6, '#ff2b2b'); R(16, -26, 6, 3, '#37f0ff'); R(16, -20, 6, 3, '#ffd23f'); R(15, -12, 8, 6, '#333');
    // sonrisa maliciosa
    R(-18, -30, 4, 4, this.state === 'kami' ? '#fff' : '#ff2b2b'); R(-6, -30, 4, 4, this.state === 'kami' ? '#fff' : '#ff2b2b');
    if (this.state === 'kami' || this.state === 'spin') { R(-18, -18, 16, 3, '#ff2b2b'); R(-18, -21, 3, 3, '#ff2b2b'); R(-5, -21, 3, 3, '#ff2b2b'); } else { R(-18, -21, 16, 3, '#ff2b2b'); R(-18, -18, 3, 3, '#ff2b2b'); R(-5, -18, 3, 3, '#ff2b2b'); }
    R(-24, 0, 8, 3, '#333'); R(16, 0, 8, 3, '#333');
    ctx.restore(); ctx.globalAlpha = 1;
  }
}

// ---- Jefe 2: Zepelín de Reparto Corrupto ----
class BossZepelin extends Boss {
  constructor(x) { super(x, 80, 'ZEPELÍN CORRUPTO'); this.w = 130; this.h = 46; this.y = 150; this.baseY = 150; this.lockY = 0; this.vents = false; this.locks = []; }
  update(lv, p) {
    this.t++; this.st++; if (this.hurt > 0) this.hurt--;
    if (this.dead) { this.deathFX(lv); return; }
    this.x = lv.camx + W / 2 + Math.sin(this.t * 0.012) * 90;
    const targetY = this.state === 'overheat' ? 205 : 150; this.y = lerp(this.y, targetY, 0.06);
    if (this.state === 'enter') { if (this.st === 1) Audio.sAlarm(); if (this.st > 80) this.go('barrels'); return; }
    switch (this.state) {
      case 'barrels': this.vents = false; if (this.st % 22 === 0 && this.st < 100) { lv.eb.push({ x: this.x + rnd(-40, 40), y: this.y - 10, vx: rnd(-1.5, 1.5) * lv.spd, vy: 1, g: 0.2, w: 14, h: 16, dmg: 1, type: 'barrel', life: 320, bounceGround: 3 }); } if (this.st > 130) this.go('lock'); break;
      case 'lock': if (this.st === 1) Audio.sAlarm(); this.locks = [{ x: p.x, y: p.y - 17 }, { x: p.x, y: p.y - 17 }]; if (this.st === 55) this.lockY = p.y - (p.st === 'crouch' ? 6 : 20); if (this.st > 55 && this.st < 70) { this.locks = [{ x: p.x, y: this.lockY }]; } if (this.st === 70) { lv.eb.push({ x: lv.camx + W / 2, y: this.lockY, vx: 0, vy: 0, w: W, h: 6, dmg: 2, type: 'laser', life: 14, beam: true }); Audio.sRayo(); shake(8); buzz(120); this.go('overheat'); } break;
      case 'overheat': this.vents = true; this.locks = []; if (this.st % 5 === 0) spawnParts(this.x, this.y + 4, 2, '#31ff8a', 1, 15); if (this.st > 120) this.go('mega'); break;
      case 'mega': this.vents = false; if (this.st === 30) { lv.eb.push({ x: lv.camx + W + 40, y: 208, vx: -2.6 * lv.spd, vy: 0, w: 52, h: 44, dmg: 3, type: 'mega', life: 260 }); Audio.sAlarm(); } if (this.st > 200) this.go('barrels'); break;
    }
  }
  box() { return { x: this.x - this.w / 2, y: this.y - this.h, w: this.w, h: this.h + (this.vents ? 14 : 22) }; }
  takeHit(b, lv, p) { const d = this.vents ? b.dmg * 2 : b.dmg; this.damage(d, lv, p); spawnParts(b.x, b.y, 6, ['#fff', '#ff3fb0'], 2, 12); return 'hit'; }
  draw(lv) {
    const x = Math.round(this.x - lv.camx), y = Math.round(this.y);
    if (this.hurt > 0) ctx.globalAlpha = .6;
    // globo
    R(x - 65, y - 46, 130, 34, '#5a2a3a'); R(x - 60, y - 44, 120, 30, '#7a3a4a'); R(x - 60, y - 44, 120, 6, '#9a5a6a'); R(x - 68, y - 34, 8, 12, '#5a2a3a'); R(x + 60, y - 38, 12, 18, '#5a2a3a');
    txt('CACAO EXPRESS', x, y - 34, 6, '#ffb347', 'center', false);
    // góndola y turretas
    R(x - 30, y - 12, 60, 22, '#3a3a4a'); R(x - 26, y - 8, 52, 12, '#26262e'); R(x - 40, y - 6, 12, 10, '#555'); R(x + 28, y - 6, 12, 10, '#555'); R(x - 46, y - 3, 6, 4, '#ff2b2b'); R(x + 40, y - 3, 6, 4, '#ff2b2b');
    for (let i = 0; i < 5; i++) R(x - 22 + i * 10, y - 4, 6, 4, (frame + i * 3) % 12 < 6 ? '#ff2b2b' : '#5a1a1a');
    // compuerta / conductos
    R(x - 18, y + 10, 36, 6, this.vents ? '#31ff8a' : '#4a4a5a'); if (this.vents) { ctx.globalAlpha = .4 + .3 * Math.sin(frame * .3); R(x - 20, y + 8, 40, 12, '#31ff8a'); ctx.globalAlpha = 1; }
    ctx.globalAlpha = 1;
    // miras láser
    for (const l of this.locks) { const lx = Math.round(l.x - lv.camx), ly = Math.round(l.y); ctx.globalAlpha = .8; R(lx - 6, ly, 12, 1, '#ff2b2b'); R(lx, ly - 6, 1, 12, '#ff2b2b'); R(lx - 1, ly - 1, 3, 3, '#ff2b2b'); ctx.globalAlpha = .25; R(0, ly - 1, W, 3, '#ff2b2b'); ctx.globalAlpha = 1; }
  }
}

// ---- Jefe 3: Núcleo Fermentado ----
class BossNucleo extends Boss {
  constructor(x) { super(x, 120, 'NÚCLEO FERMENTADO'); this.w = 60; this.h = 60; this.y = 140; this.a = 0; this.spinV = 0.03; this.phase2 = false; this.tiles = []; this.charging = false; this.spir = 0; }
  update(lv, p) {
    this.t++; this.st++; if (this.hurt > 0) this.hurt--;
    if (this.dead) { this.deathFX(lv); return; }
    this.x = lv.camx + W / 2; this.y = 140 + Math.sin(this.t * 0.03) * 8;
    this.a += this.spinV * (this.phase2 ? 1.5 : 1);
    if (this.state === 'enter') { if (this.st === 1) Audio.sAlarm(); if (this.st > 80) this.go('burst'); return; }
    if (!this.phase2 && this.hp <= 60) { this.phase2 = true; this.spinV = 0.045; FX.glitch = 30; Audio.sAlarm(); shake(10); this.tiles = []; for (let i = 0; i < 6; i++) { const s = { x: lv.camx + i * 80, y: 230, w: 80, h: 60, off: false, tile: true }; this.tiles.push(s); lv.solids.push(s); } for (const s of lv.solids) if (!s.tile && !s.thin && s.y === 230) s.off = true; // el suelo pasa a ser de baldosas que desaparecen
      lv.solids.push({ x: lv.camx + 10, y: 150, w: 50, h: 6, thin: true, escape: true }); lv.solids.push({ x: lv.camx + W - 60, y: 150, w: 50, h: 6, thin: true, escape: true }); }
    const s = lv.spd;
    switch (this.state) {
      case 'burst': if (this.st === 40 || (this.phase2 && this.st === 80)) { const n = this.phase2 ? 16 : 12; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + this.a; lv.eb.push({ x: this.x, y: this.y, vx: Math.cos(a) * 1.6 * s, vy: Math.sin(a) * 1.6 * s, w: 6, h: 6, dmg: 1, type: 'orb', col: '#ffb347', life: 200 }); } Audio.sRayo(); } if (this.st > 110) this.go('spiral'); break;
      case 'spiral': if (this.st % 5 === 0 && this.st < 100) { this.spir += 0.35; for (let k = 0; k < (this.phase2 ? 2 : 1); k++) { const a = this.spir + k * Math.PI; lv.eb.push({ x: this.x, y: this.y, vx: Math.cos(a) * 2 * s, vy: Math.sin(a) * 2 * s, w: 6, h: 6, dmg: 1, type: 'orb', col: '#ff5e2b', life: 200 }); } } if (this.st > 130) this.go('aim'); break;
      case 'aim': if (this.st === 30 || this.st === 60 || this.st === 90) { const dx = p.x - this.x, dy = (p.y - 14) - this.y, d = Math.hypot(dx, dy) || 1; for (let k = -1; k <= 1; k++) { const a = Math.atan2(dy, dx) + k * 0.25; lv.eb.push({ x: this.x, y: this.y, vx: Math.cos(a) * 2.8 * s, vy: Math.sin(a) * 2.8 * s, w: 6, h: 6, dmg: 1, type: 'orb', col: '#a34dff', life: 200 }); } Audio.sShoot(); }
        if (this.st > 120) { if (this.phase2) this.go(Math.random() < 0.5 ? 'charge' : 'burst'); else this.go('burst'); } break;
      case 'charge': // rayo aniquilador frontal: el jefe absorbe energía, la pantalla se oscurece
        this.charging = true; FX.dark = Math.min(0.75, this.st / 110); if (this.st % 3 === 0) { const a = rnd(0, 6.28), r = rnd(60, 160); parts.push({ x: this.x + Math.cos(a) * r, y: this.y + Math.sin(a) * r, vx: -Math.cos(a) * r / 30, vy: -Math.sin(a) * r / 30, life: 30, t: 0, col: pick(['#ff3f3f', '#fff']), g: 0, sz: 2 }); }
        if (this.st === 110) { this.charging = false; FX.dark = 0; lv.eb.push({ x: this.x, y: 190, vx: 0, vy: 0, w: 320, h: 130, dmg: 4, type: 'beam', life: 45, beam: true }); Audio.sKick(); shake(20); flash(15, '#ff3f3f'); buzz(400); }
        if (this.st > 170) this.go('burst'); break;
    }
    // baldosas que desaparecen (fase 2)
    if (this.phase2 && this.state !== 'charge') { if (this.t % 90 === 0) { for (const t of this.tiles) t.off = false; const t = pick(this.tiles); t.off = true; t.offT = 70; } for (const t of this.tiles) if (t.off) { t.offT--; if (t.offT <= 0) t.off = false; } }
  }
  crackFacing(fromX) { // ¿la grieta apunta hacia la posición dada?
    const dir = fromX < this.x ? Math.PI : 0; let d = ((this.a - dir) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI; return Math.abs(d) < 0.55;
  }
  hitTest(bb) { return Math.hypot(bb.x + bb.w / 2 - this.x, bb.y + bb.h / 2 - this.y) < 34; }
  takeHit(b, lv, p) {
    if (this.charging || this.crackFacing(b.x - b.vx * 3)) { this.damage(b.charged ? b.dmg * 1.5 : b.dmg, lv, p); spawnParts(b.x, b.y, 8, ['#fff', '#ff3fb0'], 2, 12); return 'hit'; }
    // armadura: refleja
    lv.eb.push({ x: b.x, y: b.y, vx: -b.vx * 0.7, vy: rnd(-0.6, 0.6), w: 6, h: 4, dmg: 1, type: 'ref', life: 90 }); Audio.sHit(); spawnParts(b.x, b.y, 5, '#7dd3fc', 1.5, 10); return 'reflect';
  }
  takeKick(lv, p) { if (this.state === 'charge') { FX.dark = 0; this.charging = false; this.damage(this.hp, lv, p); FX.freeze = 30; flash(40, '#fff'); } else this.damage(40, lv, p); spawnParts(this.x, this.y, 60, ['#ffd23f', '#fff'], 6, 40); }
  die(lv, p) { super.die(lv, p); FX.dark = 0; for (const s of lv.solids) if (!s.tile) s.off = false; lv.solids = lv.solids.filter(s => !s.tile && !s.escape); this.tiles = []; }
  draw(lv) {
    const x = Math.round(this.x - lv.camx), y = Math.round(this.y);
    // cables al techo
    R(x - 2, 0, 4, y - 30, '#3a2530'); R(x - 12, 0, 3, y - 40, '#4a2d22'); R(x + 10, 0, 3, y - 40, '#4a2d22');
    if (this.hurt > 0) ctx.globalAlpha = .6;
    if (Assets.ok) { // la máquina arcade corrupta recortada del video, flotando
      const mh = 128, feet = 230 + (y - 140), mw = sprW('boss_machine', mh), mx = x - mw * 0.12;
      if (this.charging) { ctx.globalAlpha = .35 + .25 * Math.sin(frame * .5); R(mx - mw / 2 - 10, feet - mh - 10, mw + 20, mh + 20, '#ff3f3f'); ctx.globalAlpha = this.hurt > 0 ? .6 : 1; }
      ctx.globalAlpha *= (this.phase2 && frame % 30 < 3) ? .7 : 1;
      spr('boss_machine', mx, feet, mh, 'feet');
      ctx.globalAlpha = 1;
      // marquesina propia sobre la máquina
      txt('THEOBROMA', Math.round(mx - mw * 0.19), Math.round(feet - mh + 12), 4, this.phase2 ? '#ff5e2b' : '#ffb347', 'center', false);
      if (this.charging) { R(x - 18, y - 6, 12, 5, '#fff'); R(x + 6, y - 6, 12, 5, '#fff'); }
      // llamas de propulsión bajo la máquina
      for (let i = 0; i < 3; i++) R(mx - 8 + i * 8, feet + 2 + ((frame + i * 3) % 6), 5, 6 - ((frame + i * 3) % 6), i % 2 ? '#37f0ff' : '#a34dff');
    } else {
      const pulse = 26 + Math.sin(this.t * 0.15) * 2;
      ctx.fillStyle = this.charging ? '#ff3f3f' : '#5a2a1a'; ctx.beginPath(); ctx.arc(x, y, pulse + 4, 0, 7); ctx.fill();
      ctx.fillStyle = this.charging ? '#fff' : '#8a4a2a'; ctx.beginPath(); ctx.arc(x, y, pulse, 0, 7); ctx.fill();
      ctx.fillStyle = '#c27a3a'; ctx.beginPath(); ctx.arc(x - 6, y - 6, 8, 0, 7); ctx.fill();
      ctx.strokeStyle = this.phase2 ? '#ff5e2b' : '#ffb347'; ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { const a = i * 1.26 + this.t * 0.02; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 22, y + Math.sin(a) * 22); ctx.stroke(); }
    }
    // anillo blindado rotatorio con una grieta
    for (let i = 0; i < 12; i++) { const a = this.a + i / 12 * Math.PI * 2; if (i === 0) continue; const px = x + Math.cos(a) * 33, py = y + Math.sin(a) * 33; R(Math.round(px) - 4, Math.round(py) - 4, 8, 8, '#5a5f6b'); R(Math.round(px) - 3, Math.round(py) - 3, 6, 6, '#8a909f'); }
    const cx = x + Math.cos(this.a) * 33, cy = y + Math.sin(this.a) * 33; R(Math.round(cx) - 3, Math.round(cy) - 3, 6, 6, '#31ff8a');
    if (GAME.p && GAME.p.items.visor) { ctx.globalAlpha = .8; ctx.strokeStyle = '#31ff8a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, 8 + Math.sin(frame * .3) * 2, 0, 7); ctx.stroke(); txt('PUNTO DÉBIL', Math.round(cx), Math.round(cy) - 18, 5, '#31ff8a', 'center', false); ctx.globalAlpha = 1; }
    ctx.globalAlpha = 1;
    // baldosas del suelo (fase 2)
    for (const t of this.tiles) { const tx = Math.round(t.x - lv.camx); if (t.off) { if (t.offT > 55 && frame % 4 < 2) { ctx.globalAlpha = .4; R(tx, 230, 80, 40, '#ff3f3f'); ctx.globalAlpha = 1; } continue; } if (Assets.ok) { drawGround(tx, 230, 80, 40); if (t.offT > 0 && t.offT < 20) { ctx.globalAlpha = .5; R(tx, 230, 80, 3, '#ff3f3f'); ctx.globalAlpha = 1; } } else { R(tx, 230, 80, 40, '#3a3a44'); R(tx, 230, 80, 3, (t.offT > 0 && t.offT < 20) ? '#ff3f3f' : '#6a6a7a'); R(tx + 1, 233, 78, 37, '#2a2a34'); } }
    // plataformas de escape laterales se dibujan como delgadas normales
  }
}
