// ============================================================
//  SPRITES (pixel art dibujado con rectángulos, coordenadas locales)
// ============================================================
function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

// Dimensiones del héroe (unidades de juego): caja de colisión y alturas de referencia
const HERO = { hw: 8, h: 40, ch: 20, chest: 24, cchest: 11 };
const ES = 1.3; // escala visual y de colisión de los enemigos comunes

// Héroe con las poses recortadas del video; si la hoja aún no cargó, usa el dibujo por rectángulos
function drawHero(sx, sy, face, st, af, items, alpha) {
  if (!Assets.ok) return drawHeroRect(sx, sy, face, st, af, items, alpha);
  ctx.save(); if (alpha !== undefined) ctx.globalAlpha = alpha;
  let name = 'hero_stand', h = HERO.h, dy = 0, rot = 0, kx = 1, ky = 1;
  switch (st) {
    case 'run': name = 'hero_run'; dy = (af % 2) ? -1 : 0; rot = 0.04; break;
    case 'jump': name = 'hero_run'; rot = -0.18; break;
    case 'shoot': case 'charge': name = 'hero_shoot'; break;
    case 'kick': name = 'hero_kick'; h = HERO.h * 0.95; break;
    case 'crouch': name = 'hero_stand'; ky = HERO.ch / HERO.h; kx = 1.25; break;
    case 'eat': name = 'hero_eat'; break;
    case 'victory': name = 'hero_victory'; h = HERO.h * 1.12; break;
    case 'burger_up': name = 'hero_burger_up'; h = HERO.h * 1.45; break;
    case 'cheer': name = 'hero_cheer'; h = HERO.h * 1.15; break;
  }
  ctx.translate(Math.round(sx), Math.round(sy) + dy); ctx.scale(face * kx, ky); if (rot) ctx.rotate(rot);
  spr(name, 0, 0, h, 'feet');
  // accesorios: destellos sobre el sprite
  const a0 = ctx.globalAlpha;
  if (items.shoes) { ctx.globalAlpha = a0 * (.55 + .3 * Math.sin(frame * .3)); R(-10, -3, 20, 3, '#37f0ff'); }
  if (items.visor) { ctx.globalAlpha = a0 * .85; R(-7, -h * 0.74, 14, 2, '#31ff8a'); }
  if (items.glove) { ctx.globalAlpha = a0 * .9; R(5, -h * 0.40, 6, 6, '#ff3fb0'); R(6, -h * 0.40 + 1, 4, 2, '#ffb3e0'); }
  ctx.restore(); ctx.globalAlpha = 1;
}
function drawHeroRect(sx, sy, face, st, af, items, alpha) {
  ctx.save(); ctx.translate(Math.round(sx), Math.round(sy)); ctx.scale(face, 1);
  if (alpha !== undefined) ctx.globalAlpha = alpha;
  const crouch = st === 'crouch';
  const legA = st === 'run' ? (af % 2 === 0 ? 2 : -2) : 0;
  const yo = crouch ? 10 : 0; // desplazamiento por agacharse
  if (st === 'kick') {
    // pose de patada diagonal: cuerpo inclinado, pierna extendida
    ctx.rotate(-0.6);
    R(-6, -26, 12, 10, '#2a63d6'); R(-3, -26, 6, 9, '#111'); R(-1, -21, 2, 2, '#eee');
    R(-5, -34, 10, 8, '#f1c49b'); R(-6, -38, 12, 5, '#4a2a12'); R(-5, -33, 10, 3, '#1a1a1a'); R(-4, -32, 3, 1, '#7fd4ff'); R(1, -32, 3, 1, '#7fd4ff');
    R(-4, -16, 6, 10, '#22346b'); R(2, -14, 12, 4, '#22346b'); R(12, -15, 6, 5, items.shoes ? '#37f0ff' : '#dcdcdc');
    R(-5, -6, 6, 4, items.shoes ? '#37f0ff' : '#dcdcdc');
    R(-11, -24, 6, 4, '#2a63d6'); R(-13, -24, 3, 4, items.glove ? '#ff3fb0' : '#f1c49b');
    ctx.restore(); return;
  }
  // zapatos
  const shoeC = items.shoes ? '#37f0ff' : '#e6e6e6';
  R(-6 + legA, -3, 6, 3, shoeC); R(1 - legA, -3, 6, 3, shoeC);
  if (items.shoes) { R(-6 + legA, -1, 6, 1, '#fff'); R(1 - legA, -1, 6, 1, '#fff'); }
  // piernas (jeans)
  R(-5 + legA, crouch ? -8 : -11, 4, crouch ? 5 : 8, '#22346b'); R(1 - legA, crouch ? -8 : -11, 4, crouch ? 5 : 8, '#22346b');
  // torso: chaqueta abierta + camiseta negra
  const ty = -22 + yo;
  R(-7, ty, 14, 11, '#2a63d6'); R(-7, ty, 14, 2, '#3b7cf0');
  R(-3, ty, 6, 11, '#111'); // camiseta
  R(-1, ty + 4, 2, 2, '#eee'); R(-2, ty + 6, 4, 1, '#eee'); // calavera
  R(-1, ty + 5, 1, 1, '#111');
  // brazos
  if (st === 'shoot' || st === 'charge') { R(5, ty + 3, 8, 3, '#2a63d6'); R(12, ty + 3, 3, 3, items.glove ? '#ff3fb0' : '#f1c49b'); if (items.glove) R(13, ty + 2, 2, 1, '#ffb3e0'); }
  else { R(6, ty + 2, 3, 8, '#2a63d6'); R(6, ty + 10, 3, 2, items.glove ? '#ff3fb0' : '#f1c49b'); }
  R(-9, ty + 2, 3, 8, '#2a63d6'); R(-9, ty + 10, 3, 2, '#f1c49b');
  // cabeza
  const hy = -34 + yo;
  R(-5, hy + 2, 10, 9, '#f1c49b'); // cara
  R(-6, hy, 12, 4, '#4a2a12'); R(-6, hy + 4, 2, 3, '#4a2a12'); R(5, hy + 3, 1, 2, '#4a2a12'); // pelo
  // gafas
  const gC = items.visor ? '#31ff8a' : '#1a1a1a';
  R(-5, hy + 4, 4, 3, gC); R(1, hy + 4, 4, 3, gC); R(-1, hy + 5, 2, 1, gC);
  R(-4, hy + 5, 2, 1, items.visor ? '#c9ffe0' : '#7fd4ff'); R(2, hy + 5, 2, 1, items.visor ? '#c9ffe0' : '#7fd4ff');
  if (items.visor) { R(-7, hy + 3, 1, 5, '#31ff8a'); R(6, hy + 3, 1, 5, '#31ff8a'); }
  R(-2, hy + 9, 4, 1, '#c96f5a'); // boca
  ctx.restore();
}

// Hamburguesa (16x12)
function drawBurger(x, y, kind) {
  // kind: 'n' normal, 'g' dorada, 'neon', 'burnt'
  const bun = kind === 'g' ? '#ffd23f' : kind === 'neon' ? '#ff59d6' : kind === 'burnt' ? '#3a2a22' : '#e0953c';
  const bun2 = kind === 'g' ? '#fff08a' : kind === 'neon' ? '#ffb3ec' : kind === 'burnt' ? '#4a3a30' : '#f2b25a';
  R(x + 2, y, 12, 3, bun); R(x + 3, y - 1, 10, 1, bun2); R(x + 5, y, 1, 1, bun2); R(x + 9, y, 1, 1, bun2);
  R(x + 1, y + 3, 14, 2, kind === 'burnt' ? '#2a2a2a' : '#5ec24a'); // lechuga
  R(x + 2, y + 5, 12, 3, kind === 'burnt' ? '#1a1a1a' : '#7a3b1e'); // carne
  R(x + 1, y + 8, 14, 2, kind === 'burnt' ? '#333' : '#ffc42e'); // queso
  R(x + 2, y + 10, 12, 3, bun);
  if (kind === 'neon') { R(x, y + 3, 1, 8, '#ff59d6'); R(x + 15, y + 3, 1, 8, '#ff59d6'); }
}

function drawCoin(x, y, t) {
  const w = Math.abs(Math.cos(t * 0.12)) * 6 + 1;
  R(x - w / 2, y - 3, w, 7, '#f5c518'); R(x - w / 2 + 1, y - 2, Math.max(1, w - 2), 5, '#ffe680'); R(x - 1, y - 1, 1, 3, '#c98d00');
}

// ============================================================
//  JUGADOR
// ============================================================
function newPlayer(prev) {
  const p = {
    x: 40, y: 200, w: 16, h: 40, vx: 0, vy: 0, onGround: false, face: 1, eatT: 0,
    hp: 6, maxHp: 6, burgers: 1, coins: 0, meter: 0, charge: 0, fireCd: 0, fireRate: 1, rayoCd: 0,
    inv: 0, items: { shoes: false, visor: false, glove: false }, jumps: 0, fries: 0,
    kick: null, dead: false, anim: 0, animT: 0, score: 0, dropThin: 0, cpx: 40, cpy: 200,
    hurtT: 0, st: 'idle', airKills: 0, mult: 1
  };
  if (prev) { // conservar progreso entre niveles
    p.hp = prev.hp; p.maxHp = prev.maxHp; p.burgers = prev.burgers; p.coins = prev.coins; p.meter = prev.meter;
    p.fireRate = prev.fireRate; p.items = Object.assign({}, prev.items); p.score = prev.score; p.rayoCd = prev.rayoCd || 0;
  }
  return p;
}
function pBox(p) { const h = p.st === 'crouch' ? HERO.ch : p.h; return { x: p.x - HERO.hw, y: p.y - h, w: HERO.hw * 2, h }; }

function hurtPlayer(p, dmg, kx) {
  if (p.inv > 0 || p.dead || p.kick) return false;
  p.hp -= dmg; p.inv = 70; p.hurtT = 20; p.vx = kx || (p.face * -2.5); p.vy = -3.5;
  Audio.sHurt(); shake(6); buzz(80); flash(6, '#ff2040');
  spawnParts(p.x, p.y - 20, 12, ['#ff4d6d', '#fff'], 2.5, 25);
  if (p.hp <= 0) { p.hp = 0; p.dead = true; p.deadT = 0; Audio.sExplo(true); shake(14); buzz([100, 50, 200]); }
  return true;
}
function eatBurger(p) {
  if (p.burgers <= 0 || p.hp >= p.maxHp || p.dead) { if (p.burgers <= 0) Audio.sNo(); return; }
  p.burgers--; p.hp = Math.min(p.maxHp, p.hp + 3); p.eatT = 36; Audio.sBurger(); buzz(30);
  spawnParts(p.x, p.y - 20, 14, ['#ffd23f', '#5ec24a', '#fff'], 2, 30);
}

// físicas y colisiones contra los sólidos del nivel
function movePlayer(p, lv) {
  const fr = lv.friction || 0.72;
  const acc = p.onGround ? (lv.slippery ? 0.35 : 0.9) : 0.55, max = 2.3;
  if (p.kick) return;
  let crouching = Input.d && p.onGround;
  if (!crouching) { const tb = { x: p.x - HERO.hw, y: p.y - HERO.h, w: HERO.hw * 2, h: HERO.h }; for (const s of lv.solids) if (s.ceiling && aabb(tb, s)) { crouching = true; break; } } // techo bajo: obliga a ir agachado
  p.st = crouching ? 'crouch' : (p.onGround ? (Math.abs(p.vx) > 0.4 ? 'run' : 'idle') : 'jump');
  if (!crouching) {
    if (Input.l) { p.vx -= acc; p.face = -1; }
    if (Input.r) { p.vx += acc; p.face = 1; }
    if (!Input.l && !Input.r) p.vx *= (p.onGround ? fr : 0.92);
  } else { p.vx *= (lv.slippery ? 0.94 : 0.8); if (Input.l) { p.face = -1; p.vx -= acc * 0.35; } if (Input.r) { p.face = 1; p.vx += acc * 0.35; } p.vx = clamp(p.vx, -1, 1); }
  if (lv.wind) p.vx += lv.wind;
  p.vx = clamp(p.vx, -max - Math.abs(lv.wind || 0) * 4, max);
  // cinta transportadora
  if (p.onGround && p.conv) p.x += p.conv;
  // salto (y doble salto con zapatillas)
  if (Input.jumpP) {
    if (crouching && p.onThin) { p.dropThin = 12; p.onGround = false; } // bajar de plataformas delgadas
    else if (p.onGround) { p.vy = -7.6; p.jumps = 1; p.onGround = false; Audio.sJump(); }
    else if (p.items.shoes && p.jumps < 2) { p.vy = -6.8; p.jumps = 2; Audio.sJump(); spawnParts(p.x, p.y, 10, ['#37f0ff', '#fff'], 2, 18); }
  }
  if (!Input.jump && p.vy < -3) p.vy = -3; // salto variable
  p.vy = Math.min(p.vy + 0.42, 9);
  if (p.dropThin > 0) p.dropThin--;
  // --- X ---
  p.x += p.vx;
  let box = pBox(p);
  for (const s of lv.solids) {
    if (s.thin || s.off || s.grill || s.laser) continue;
    if (aabb(box, s)) { if (p.vx > 0) p.x = s.x - HERO.hw; else if (p.vx < 0) p.x = s.x + s.w + HERO.hw; p.vx = 0; box = pBox(p); }
  }
  if (p.x < (lv.minX || 0) + HERO.hw) { p.x = (lv.minX || 0) + HERO.hw; p.vx = Math.max(0, p.vx); }
  if (p.x > lv.w - HERO.hw) { p.x = lv.w - HERO.hw; p.vx = Math.min(0, p.vx); }
  // --- Y ---
  const prevBottom = p.y;
  p.y += p.vy; p.onGround = false; p.onThin = false; p.conv = 0;
  box = pBox(p);
  for (const s of lv.solids) {
    if (s.off || s.grill || s.laser) continue;
    if (!aabb(box, s)) continue;
    if (s.thin) { if (p.vy >= 0 && prevBottom <= s.y + 1 && p.dropThin === 0) { p.y = s.y; p.vy = 0; p.onGround = true; p.onThin = true; p.jumps = 0; } continue; }
    if (p.vy >= 0 && prevBottom <= s.y + 1) { p.y = s.y; p.vy = 0; p.onGround = true; p.jumps = 0; if (s.conv) p.conv = s.conv; }
    else if (p.vy < 0) { p.y = s.y + s.h + (p.st === 'crouch' ? HERO.ch : p.h); p.vy = 0.5; }
    else { p.y = s.y; p.onGround = true; p.vy = 0; }
    box = pBox(p);
  }
  // láseres y parrillas del nivel
  for (const s of lv.solids) {
    if (s.laser && s.on && aabb(box, s)) hurtPlayer(p, 2, p.face * -3);
    if (s.grill && s.on && p.onGround && p.x > s.x - 4 && p.x < s.x + s.w + 4 && Math.abs(p.y - s.y - 2) < 5) hurtPlayer(p, 1, p.face * -2);
  }
  // caída al vacío
  if (p.y > H + 30) { p.x = p.cpx; p.y = p.cpy; p.vx = 0; p.vy = 0; hurtPlayer(p, 2, 0); }
  if (p.onGround && p.y < H - 4) { p.cpx = p.x; p.cpy = p.y; }
  // animación
  p.animT += Math.abs(p.vx) > 0.4 ? 1 : 0; p.anim = Math.floor(p.animT / 6);
}

// disparos, carga, patada, hamburguesa
function playerActions(p, lv) {
  if (p.dead) return;
  if (p.fireCd > 0) p.fireCd--;
  if (p.inv > 0) p.inv--; if (p.hurtT > 0) p.hurtT--; if (p.fries > 0) p.fries--; if (p.eatT > 0) p.eatT--;
  if (Input.burgerP) eatBurger(p);
  if (p.kick) { updateKick(p, lv); return; }
  if (Input.kickP && p.meter >= 100) { startKick(p); return; }
  if (p.rayoCd > 0) p.rayoCd--;
  // Disparo del Rayo Calavera con cooldown
  if (Input.shootP && p.rayoCd === 0) {
    fireRayo(p, lv);
    p.rayoCd = 240; // 4 segundos aprox a 60fps
  } else if (Input.shoot) {
    if (p.fireCd === 0 && p.rayoCd !== 240) fireBasic(p, lv);
    if (p.st !== 'crouch' && p.st !== 'jump') p.st = 'shoot';
    if (p.st === 'jump') p.st = 'shoot';
  }
}
function fireBasic(p, lv) {
  const rate = p.fries > 0 ? 4 : [9, 7, 5, 4][Math.min(3, p.fireRate - 1)];
  p.fireCd = rate;
  const y = p.y - (p.st === 'crouch' ? HERO.cchest : HERO.chest);
  const big = lv.arena && p.hp <= 1 && p.burgers === 0; // adrenalina: disparos gigantes
  lv.pb.push({ x: p.x + p.face * 10, y, vx: p.face * 6, vy: 0, w: big ? 14 : 8, h: big ? 8 : 3, dmg: big ? 2 : 1, charged: false, bounces: p.items.glove ? 3 : 0, life: 90 });
  Audio.sShoot();
}
function fireRayo(p, lv) {
  const y = p.y - (p.st === 'crouch' ? HERO.cchest : HERO.chest);
  lv.pb.push({ x: p.x + p.face * 10, y, vx: p.face * 7, vy: 0, w: 22, h: 10, dmg: 6, charged: true, bounces: p.items.glove ? 3 : 0, life: 110, pierce: 3 });
  Audio.sRayo(); shake(3); buzz(40);
  p.vx -= p.face * 1.5;
}
function startKick(p) {
  p.meter = 0; p.kick = { ph: 0, t: 0 }; FX.freeze = 16; FX.negative = 16; Audio.sKick(); buzz(60);
  p.vx = -p.face * 2.2; p.vy = -6.5; p.st = 'kick';
}
function updateKick(p, lv) {
  const k = p.kick; k.t++; p.st = 'kick';
  if (k.ph === 0) { // salto mortal hacia atrás
    p.x += p.vx; p.y += p.vy; p.vy += 0.35;
    spawnParts(p.x, p.y - 20, 2, ['#ffd23f', '#37f0ff'], 1.5, 15);
    if (k.t > 22) { k.ph = 1; p.vx = p.face * 5.5; p.vy = 6; }
  } else if (k.ph === 1) { // picada diagonal
    p.x += p.vx; p.y += p.vy;
    spawnParts(p.x, p.y - 20, 4, ['#ffd23f', '#fff', '#37f0ff'], 2.5, 15);
    let landed = false; const box = pBox(p);
    for (const s of lv.solids) { if (s.off) continue; if (aabb({ x: box.x, y: p.y - 4, w: 12, h: 6 }, s) && p.y <= s.y + 8) { p.y = s.y; landed = true; break; } }
    if (p.y >= 236 && lv.groundY) { p.y = lv.groundY; landed = true; }
    if (p.x < HERO.hw) p.x = HERO.hw; if (p.x > lv.w - HERO.hw) p.x = lv.w - HERO.hw;
    if (landed || k.t > 70) { k.ph = 2; k.t = 0; kickImpact(p, lv); }
  } else { // onda expansiva
    if (k.t > 30) { p.kick = null; p.vx = 0; p.vy = 0; p.st = 'idle'; }
  }
}
function kickImpact(p, lv) {
  shake(18); FX.glitch = 26; flash(10, '#fff'); buzz([200, 40, 120]); Audio.sExplo(true);
  spawnParts(p.x, p.y, 60, ['#ffd23f', '#fff', '#37f0ff', '#ff3fb0'], 6, 40, 0.1);
  lv.wave = { x: p.x, y: p.y, r: 0 };
  // destruye a todos los enemigos comunes en pantalla
  for (const e of lv.enemies) {
    if (e.x > lv.camx - 20 && e.x < lv.camx + W + 20) { e.killedByKick = true; killEnemy(e, lv, p); }
  }
  lv.eb.length = 0;
  if (lv.boss && !lv.boss.dead) { lv.boss.takeKick(lv, p); }
}

// ============================================================
//  MONEDAS, OBJETOS, PROYECTILES
// ============================================================
function dropCoins(lv, x, y, n) { for (let i = 0; i < n; i++) lv.coins.push({ x, y, vx: rnd(-1.8, 1.8), vy: rnd(-4.5, -2), t: rint(0, 40), life: 260, ground: false }); }
function updateCoins(lv, p) {
  for (let i = lv.coins.length - 1; i >= 0; i--) {
    const c = lv.coins[i]; c.t++; c.life--;
    if (!c.ground) {
      c.x += c.vx; c.y += c.vy; c.vy += 0.3;
      for (const s of lv.solids) { if (s.off || s.laser) continue; if (c.x > s.x && c.x < s.x + s.w && c.y > s.y && c.y < s.y + 8 && c.vy > 0) { c.y = s.y; c.vy = -c.vy * 0.45; c.vx *= 0.8; if (Math.abs(c.vy) < 0.8) { c.ground = true; c.vy = 0; } } }
      if (c.y > H + 10) { lv.coins.splice(i, 1); if (lv.bonus) lv.bonus.missed++; continue; }
      if (lv.bonus && c.y >= lv.groundY - 2) { lv.coins.splice(i, 1); lv.bonus.missed++; spawnParts(c.x, c.y, 6, '#665', 1.5, 15); continue; }
    }
    if (c.life <= 0) { lv.coins.splice(i, 1); continue; }
    const box = pBox(p);
    if (!p.dead && c.x > box.x - 4 && c.x < box.x + box.w + 4 && c.y > box.y - 4 && c.y < box.y + box.h + 4) {
      lv.coins.splice(i, 1); p.coins++; p.meter = Math.min(100, p.meter + (lv.arena ? 5 : 8)); p.score += 10; Audio.sCoin();
      if (lv.bonus) lv.bonus.got++;
      spawnParts(c.x, c.y, 5, ['#ffe680', '#fff'], 1.5, 12);
      if (p.meter >= 100 && !p.meterFlashed) { p.meterFlashed = true; buzz(50); }
      if (p.meter < 100) p.meterFlashed = false;
    }
  }
}
function drawCoins(lv) { for (const c of lv.coins) { if (c.life < 70 && Math.floor(c.life / 5) % 2 === 0) continue; drawCoin(Math.round(c.x - lv.camx), Math.round(c.y - 4), c.t); } }

const ITEM_NAMES = { burger: 'HAMBURGUESA', fries: 'PAPAS PICANTES', visor: 'VISOR TÁCTICO', glove: 'GUANTELETE', shoes: 'ZAPATILLAS NEÓN', gold: 'HAMBURGUESA DORADA', neon: 'HAMBURGUESA DE NEÓN' };
function updatePickups(lv, p) {
  for (let i = lv.pickups.length - 1; i >= 0; i--) {
    const it = lv.pickups[i]; if (it.type === 'burnt') continue; it.t = (it.t || 0) + 1;
    if (it.vy !== undefined) { it.y += it.vy; it.vy += 0.3; for (const s of lv.solids) { if (!s.off && !s.laser && it.x > s.x && it.x < s.x + s.w && it.y > s.y && it.y < s.y + 10 && it.vy > 0) { it.y = s.y; it.vy = 0; } } }
    const box = pBox(p);
    if (!p.dead && aabb(box, { x: it.x - 8, y: it.y - 12, w: 16, h: 12 })) {
      lv.pickups.splice(i, 1); applyPickup(p, it.type, lv);
    }
  }
}
function applyPickup(p, type, lv) {
  if (type === 'burger') { p.burgers++; Audio.sPickup(); }
  else if (type === 'fries') { p.fries = 480; Audio.sPickup(); }
  else if (type === 'gold') { p.maxHp += 2; p.hp = Math.min(p.maxHp, p.hp + 2); Audio.sBurger(); }
  else if (type === 'neon') { p.maxHp += 2; p.hp = p.maxHp; Audio.sVictory(); }
  else { p.items[type] = true; Audio.sPickup(); FX.freeze = 10; }
  lv.msg = { text: ITEM_NAMES[type] || type, t: 110 }; buzz(40);
  spawnParts(p.x, p.y - 20, 20, ['#fff', '#ffd23f', '#31ff8a'], 2.5, 30);
}
function drawPickups(lv) {
  for (const it of lv.pickups) {
    const x = Math.round(it.x - lv.camx), y = Math.round(it.y - 12 + Math.sin(it.t * 0.1) * 2);
    if (it.type === 'burger') drawBurger(x - 8, y, 'n');
    else if (it.type === 'gold') drawBurger(x - 8, y, 'g');
    else if (it.type === 'neon') { ctx.globalAlpha = .4 + .3 * Math.sin(it.t * .2); R(x - 12, y - 4, 24, 20, '#ff59d6'); ctx.globalAlpha = 1; drawBurger(x - 8, y, 'neon'); }
    else if (it.type === 'fries') { R(x - 5, y + 4, 10, 8, '#e03a2a'); R(x - 4, y - 1, 2, 6, '#ffd23f'); R(x - 1, y - 3, 2, 8, '#ffd23f'); R(x + 2, y, 2, 5, '#ffd23f'); }
    else if (it.type === 'visor') { R(x - 7, y + 2, 14, 6, '#31ff8a'); R(x - 5, y + 3, 4, 3, '#0a2a18'); R(x + 1, y + 3, 4, 3, '#0a2a18'); }
    else if (it.type === 'glove') { R(x - 5, y, 10, 11, '#ff3fb0'); R(x - 3, y - 3, 6, 4, '#ff3fb0'); R(x - 2, y + 3, 4, 4, '#ffb3e0'); }
    else if (it.type === 'shoes') { R(x - 8, y + 4, 16, 6, '#e6e6e6'); R(x - 8, y + 9, 16, 2, '#37f0ff'); }
    ctx.globalAlpha = .35 + .3 * Math.sin(it.t * .15); R(x - 10, y + 13, 20, 1, '#fff'); ctx.globalAlpha = 1;
  }
}

function updateBullets(lv, p) {
  // del jugador
  for (let i = lv.pb.length - 1; i >= 0; i--) {
    const b = lv.pb[i]; b.x += b.vx; b.y += b.vy; b.life--;
    if (b.bounces > 0) {
      if (b.x < lv.camx + 2 && b.vx < 0) { b.x = lv.camx + 2; b.vx = -b.vx; b.bounces--; Audio.sHit(); spawnParts(b.x, b.y, 4, '#ff3fb0', 1.5, 10); }
      if (b.x > lv.camx + W - 2 && b.vx > 0) { b.x = lv.camx + W - 2; b.vx = -b.vx; b.bounces--; Audio.sHit(); spawnParts(b.x, b.y, 4, '#ff3fb0', 1.5, 10); }
    }
    let rm = b.life <= 0 || b.x < lv.camx - 30 || b.x > lv.camx + W + 30;
    for (const s of lv.solids) { if (!s.thin && !s.off && !s.laser && !s.grill && aabb({ x: b.x - b.w / 2, y: b.y - b.h / 2, w: b.w, h: b.h }, s)) { rm = true; spawnParts(b.x, b.y, 3, '#ff3fb0', 1, 8); } }
    if (rm) { lv.pb.splice(i, 1); continue; }
    // impacto en enemigos
    const bb = { x: b.x - b.w / 2, y: b.y - b.h / 2, w: b.w, h: b.h };
    for (const e of lv.enemies) {
      if (e.dead || e.spawnT > 0) continue;
      if (aabb(bb, { x: e.x - e.w / 2, y: e.y - e.h, w: e.w, h: e.h })) {
        const res = hitEnemy(e, b, lv, p);
        if (res === 'reflect') { lv.pb.splice(i, 1); rm = true; break; }
        if (res === 'block') { lv.pb.splice(i, 1); rm = true; break; }
        if (b.pierce) { b.pierce--; if (b.pierce <= 0) { lv.pb.splice(i, 1); rm = true; break; } }
        else { lv.pb.splice(i, 1); rm = true; break; }
      }
    }
    if (rm) continue;
    if (lv.boss && !lv.boss.dead && lv.boss.hitTest(bb)) {
      const r = lv.boss.takeHit(b, lv, p);
      if (r !== 'pass') { lv.pb.splice(i, 1); }
    }
  }
  // enemigos
  for (let i = lv.eb.length - 1; i >= 0; i--) {
    const b = lv.eb[i]; b.x += b.vx; b.y += b.vy; if (b.g) b.vy += b.g; b.life--; b.t = (b.t || 0) + 1;
    if (b.land || b.bounceGround || b.shatter) { for (const s of lv.solids) { if (s.off || s.laser || s.thin || s.grill || s.ceiling) continue; if (b.x > s.x && b.x < s.x + s.w && b.y + b.h / 2 >= s.y && b.y + b.h / 2 - b.vy <= s.y + 2 && b.vy > 0) {
      if (b.shatter) { b.life = 0; spawnParts(b.x, s.y, 8, ['#f4f4f4', '#ffb347'], 2, 15); Audio.sHit(); break; }
      b.y = s.y - b.h / 2;
      if (b.land) { b.vy = 0; b.g = 0; b.vx *= 0.3; }
      else { b.vy = -Math.abs(b.vy) * 0.85; b.bounceGround--; if (b.bounceGround <= 0) { b.bounceGround = 0; b.life = Math.min(b.life, 25); } }
    } } }
    if (b.life <= 0 || b.y > H + 40 || b.x < lv.camx - 60 || b.x > lv.camx + W + 60 || b.y < -60) { lv.eb.splice(i, 1); continue; }
    if (b.type === 'wave') { // onda de radiación: se esquiva agachado
      const box = pBox(p); if (p.st !== 'crouch' && box.y < b.y - 6 && box.y + box.h > b.y - 30 && Math.abs(p.x - b.x) < 14) hurtPlayer(p, b.dmg, b.vx * 1.2);
      continue;
    }
    if (!p.dead && aabb(pBox(p), { x: b.x - b.w / 2, y: b.y - b.h / 2, w: b.w, h: b.h })) {
      if (hurtPlayer(p, b.dmg, Math.sign(b.vx) * 2.5)) { if (!b.beam) { lv.eb.splice(i, 1); } }
    }
  }
}
function drawBullets(lv) {
  for (const b of lv.pb) {
    const x = Math.round(b.x - lv.camx), y = Math.round(b.y);
    if (b.charged) { // Rayo Calavera
      R(x - 11, y - 5, 22, 10, '#ff3fb0'); R(x - 9, y - 3, 18, 6, '#ffb3e0'); R(x - 3, y - 2, 6, 4, '#fff');
      R(x - 2, y - 1, 1, 1, '#ff3fb0'); R(x + 1, y - 1, 1, 1, '#ff3fb0'); R(x - 2, y + 1, 4, 1, '#ff3fb0');
      if (frame % 3 === 0) spawnParts(b.x, b.y, 1, '#ff3fb0', 1, 10);
    } else { R(x - b.w / 2, y - b.h / 2, b.w, b.h, '#ff3fb0'); R(x - b.w / 2 + 1, y - b.h / 2 + 1, b.w - 2, Math.max(1, b.h - 2), '#ffd6ef'); }
  }
  for (const b of lv.eb) {
    const x = Math.round(b.x - lv.camx), y = Math.round(b.y);
    if (b.type === 'steam') { ctx.globalAlpha = .8; R(x - 3, y - 3, 6, 6, '#dfe9f3'); R(x - 2, y - 2, 4, 4, '#fff'); ctx.globalAlpha = 1; }
    else if (b.type === 'wave') { ctx.globalAlpha = .75; R(x - 8, y - 30, 16, 26, '#a34dff'); R(x - 5, y - 27, 10, 20, '#d9a6ff'); ctx.globalAlpha = 1; }
    else if (b.type === 'plate') { R(x - 6, y - 2, 12, 4, '#f4f4f4'); R(x - 4, y - 1, 8, 2, '#ffb347'); }
    else if (b.type === 'bomb') { R(x - 5, y - 5, 10, 10, '#6b4a2a'); R(x - 4, y - 4, 8, 8, '#8f6a3d'); R(x - 2, y - 2, 4, 4, (b.life < 30 && frame % 6 < 3) ? '#ff2b2b' : '#ffcc33'); }
    else if (b.type === 'barrel') { R(x - 7, y - 8, 14, 16, '#4a8f2e'); R(x - 7, y - 4, 14, 2, '#2f5d1e'); R(x - 7, y + 3, 14, 2, '#2f5d1e'); R(x - 2, y - 2, 4, 4, '#b6ff5c'); }
    else if (b.type === 'mega') { R(x - 26, y - 22, 52, 44, '#3a3a4a'); R(x - 24, y - 20, 48, 40, '#55556a'); for (let i = -20; i < 24; i += 8) { R(x + i, y - 26, 3, 5, '#c0c0d0'); R(x + i, y + 21, 3, 5, '#c0c0d0'); } R(x - 8, y - 8, 16, 16, (frame % 8 < 4) ? '#ff2b2b' : '#8a1a1a'); }
    else if (b.type === 'laser') { ctx.globalAlpha = .9; R(x - b.w / 2, y - b.h / 2, b.w, b.h, '#ff2b2b'); R(x - b.w / 2, y - 1, b.w, 2, '#fff'); ctx.globalAlpha = 1; }
    else if (b.floorFlame) { ctx.globalAlpha = .7; for (let i = -40; i < 40; i += 8) R(x + i, y - 4 - ((frame + i) % 3) * 3, 5, 8 + ((frame + i) % 3) * 3, (frame + i) % 6 < 3 ? '#ff6a00' : '#ffd23f'); ctx.globalAlpha = 1; }
    else if (b.type === 'orb') { R(x - 3, y - 3, 6, 6, b.col || '#ffb347'); R(x - 2, y - 2, 4, 4, '#fff8dc'); }
    else if (b.type === 'ref') { R(x - 3, y - 2, 6, 4, '#ff8c00'); R(x - 2, y - 1, 4, 2, '#fff'); }
    else if (b.type === 'beam') { ctx.globalAlpha = .85; R(x - b.w / 2, y - b.h / 2, b.w, b.h, '#ff3f3f'); ctx.globalAlpha = .6; R(x - b.w / 2, y - b.h / 2 + 4, b.w, b.h - 8, '#fff'); ctx.globalAlpha = 1; }
    else R(x - 3, y - 3, 6, 6, '#ffb347');
  }
}

// ============================================================
//  ENEMIGOS COMUNES
// ============================================================
const ENEMY = {
  taza: { w: 16, h: 14, hp: 2, fly: true, score: 100,
    init(e) { e.vx = -0.9; e.baseY = e.y; e.cd = rint(60, 110); },
    upd(e, lv, p) { e.x += e.vx * (e.dir || 1); e.y = e.baseY + Math.sin(e.t * 0.06) * 10; if (lv.arena) { if (e.x < 30) e.dir = -1; if (e.x > W - 30) e.dir = 1; } else if (e.x < lv.camx - 40) e.dead = true;
      if (--e.cd <= 0) { e.cd = 100 / lv.spd; const dx = Math.sign(p.x - e.x) || -1; lv.eb.push({ x: e.x, y: e.y, vx: dx * 1.2 * lv.spd, vy: 2 * lv.spd, w: 6, h: 6, dmg: 1, type: 'steam', life: 120 }); } },
    draw(e) { R(-7, -14, 14, 12, '#f8f4ea'); R(-6, -13, 12, 3, '#6b3a1a'); R(7, -11, 3, 6, '#f8f4ea'); R(8, -10, 1, 4, '#000'); R(-5, -8, 3, 3, '#e33'); R(2, -8, 3, 3, '#e33'); R(-2, -5, 4, 1, '#000');
      ctx.globalAlpha = .6; R(-4, -20 + (e.t % 6), 3, 3, '#fff'); R(1, -18 - (e.t % 6), 3, 3, '#fff'); ctx.globalAlpha = 1; }
  },
  espatula: { w: 14, h: 22, hp: 3, score: 150, shieldFront: true,
    init(e) { e.vx = 0; },
    upd(e, lv, p) { e.face = p.x > e.x ? 1 : -1; if (Math.abs(p.x - e.x) > 24) e.x += e.face * 0.7 * lv.spd; groundEnemy(e, lv); },
    draw(e) { R(-3, -22, 6, 22, '#9aa5b1'); R(-7, -22, 14, 8, '#c7d0d9'); R(-6, -21, 12, 6, '#e8eef3'); R(-2, -10, 4, 6, '#333'); R(-6, -3, 4, 3, '#555'); R(2, -3, 4, 3, '#555'); R(-1, -19, 2, 2, '#f33');
      R(8, -18, 3, 14, '#4dd6ff'); ctx.globalAlpha = .5; R(9, -18, 4, 14, '#bff3ff'); ctx.globalAlpha = 1; }
  },
  dron: { w: 18, h: 12, hp: 3, fly: true, score: 200, armor: 3,
    init(e) { e.baseY = e.y; e.cd = 90; e.vx = 0; },
    upd(e, lv, p) { const tx = p.x + (p.face * 20); e.vx = clamp((tx - e.x) * 0.02, -1.4, 1.4) * lv.spd; e.x += e.vx; e.y = e.baseY + Math.sin(e.t * 0.05) * 6;
      if (--e.cd <= 0) { e.cd = 140 / lv.spd; lv.eb.push({ x: e.x, y: e.y + 4, vx: 0, vy: 0.5, g: 0.18, w: 10, h: 10, dmg: 2, type: 'bomb', life: 75, land: true, explode: true }); } },
    draw(e) { R(-9, -10, 18, 8, '#4b4b5a'); R(-7, -9, 14, 6, '#6c6c80'); R(-12, -13, 6, 2, '#aaa'); R(6, -13, 6, 2, '#aaa'); R(-11, -12 + (frame % 2), 4, 1, '#ddd'); R(7, -12 + ((frame + 1) % 2), 4, 1, '#ddd');
      R(-3, -6, 6, 3, e.armor > 0 ? '#3f8fff' : '#ff3030'); R(-5, -2, 10, 2, '#333'); if (e.armor > 0) { ctx.globalAlpha = .35; R(-10, -11, 20, 10, '#7fbfff'); ctx.globalAlpha = 1; } }
  },
  pinball: { w: 22, h: 24, hp: 4, score: 250,
    init(e) { e.vx = 0; e.state = 0; e.cd = 50; },
    upd(e, lv, p) { if (e.state === 0) { if (--e.cd <= 0) { e.state = 1; e.vx = (p.x > e.x ? 1 : -1) * 4.2 * lv.spd; e.face = Math.sign(e.vx); Audio.sAlarm(); } }
      else { e.x += e.vx; if (e.x < lv.camx + 12 || e.x > lv.camx + W - 12 || e.x < 12 || e.x > lv.w - 12) { e.vx = -e.vx; e.face = Math.sign(e.vx); } if (e.t % 90 === 0) { e.state = 0; e.cd = 40; e.vx = 0; } }
      groundEnemy(e, lv); },
    draw(e) { R(-11, -24, 22, 24, '#2b2b3d'); R(-10, -23, 20, 14, '#3d3d5c'); const cols = ['#ff3fb0', '#ffd23f', '#37f0ff', '#31ff8a']; for (let i = 0; i < 4; i++) R(-8 + i * 5, -21, 3, 3, cols[(i + Math.floor(e.t / 6)) % 4]);
      R(-8, -15, 16, 4, '#000'); R(-6 + (e.t % 12), -14, 3, 2, '#c0c0c0'); R(-9, -6, 6, 6, '#666'); R(3, -6, 6, 6, '#666'); R(-11, -9, 4, 3, '#f33'); R(7, -9, 4, 3, '#f33'); }
  },
  centinela: { w: 16, h: 26, hp: 4, score: 300, reflectFront: true,
    init(e) { e.vx = 0; },
    upd(e, lv, p) { e.face = p.x > e.x ? 1 : -1; if (Math.abs(p.x - e.x) > 40) e.x += e.face * 0.5 * lv.spd; groundEnemy(e, lv); },
    draw(e) { R(-6, -26, 12, 26, '#5a5f6b'); R(-5, -25, 10, 10, '#7a808f'); R(-3, -22, 6, 3, '#ff8c00'); R(-7, -14, 14, 8, '#4a4f5a'); R(-5, -6, 4, 6, '#333'); R(1, -6, 4, 6, '#333');
      R(8, -26, 4, 24, '#7dd3fc'); ctx.globalAlpha = .45; R(9, -27, 5, 26, '#e0f7ff'); ctx.globalAlpha = 1; R(-8, -20, 2, 6, '#ff2b2b'); }
  }
};
function groundEnemy(e, lv) {
  // gravedad simple contra sólidos
  e.vy = (e.vy || 0) + 0.4; e.y += e.vy; e.onG = false;
  for (const s of lv.solids) { if (s.off || s.laser || s.grill) continue; if (e.x > s.x - 4 && e.x < s.x + s.w + 4 && e.y >= s.y && e.y - e.vy <= s.y + 1) { e.y = s.y; e.vy = 0; e.onG = true; } }
  if (e.y > H + 40) e.dead = true;
  if (lv.arena) e.x = clamp(e.x, 50, 430);
}
function spawnEnemy(lv, type, x, y, opt) {
  const d = ENEMY[type]; const e = Object.assign({ type, x, y, w: d.w * ES, h: d.h * ES, hp: d.hp, maxHp: d.hp, t: 0, face: -1, dead: false, spawnT: 0, armor: d.armor || 0, gold: false }, opt || {});
  if (lv.arena) { e.hp = Math.ceil(e.hp * lv.hpMul); e.maxHp = e.hp; }
  d.init(e); lv.enemies.push(e); return e;
}
function hitEnemy(e, b, lv, p) {
  const d = ENEMY[e.type];
  const fromFront = Math.sign(b.vx) === -e.face; // la bala viaja hacia la cara del enemigo
  if (d.reflectFront && fromFront && !b.charged) {
    lv.eb.push({ x: b.x, y: b.y, vx: -b.vx * 0.8, vy: 0, w: 6, h: 4, dmg: 1, type: 'ref', life: 80 }); Audio.sHit(); spawnParts(b.x, b.y, 5, '#7dd3fc', 1.5, 10); return 'reflect';
  }
  if (d.shieldFront && fromFront && !b.charged) { Audio.sHit(); spawnParts(b.x, b.y, 4, '#4dd6ff', 1.5, 10); return 'block'; }
  if (e.armor > 0 && !b.charged) { e.armor -= 1; Audio.sHit(); spawnParts(e.x, e.y - 6, 5, '#7fbfff', 1.5, 10); if (e.armor === 0) spawnParts(e.x, e.y - 6, 14, ['#7fbfff', '#fff'], 2.5, 20); return 'block'; }
  if (e.armor > 0 && b.charged) e.armor = 0;
  let dmg = b.dmg; if (d.reflectFront && !fromFront) dmg *= 3; // punto débil en la espalda
  e.hp -= dmg; e.hurt = 6; Audio.sHit(); spawnParts(b.x, b.y, 4, ['#fff', '#ff3fb0'], 1.5, 10);
  if (e.hp <= 0) killEnemy(e, lv, p);
  return 'hit';
}
function killEnemy(e, lv, p) {
  if (e.dead) return; e.dead = true;
  const d = ENEMY[e.type];
  Audio.sExplo(false); shake(2); spawnParts(e.x, e.y - e.h / 2, 18, ['#ffb347', '#fff', '#ff5e5e', '#aaa'], 3, 25, 0.05);
  dropCoins(lv, e.x, e.y - e.h / 2, e.gold ? 5 : rint(1, 3));
  if (e.gold && e.killedByKick) lv.pickups.push({ x: e.x, y: e.y - 10, type: 'burger', vy: -3 });
  if (e.drop) lv.pickups.push({ x: e.x, y: e.y - 10, type: e.drop, vy: -3 });
  // combo acrobático (arena)
  let mult = 1;
  if (lv.arena) { if (!p.onGround) { p.airKills++; mult = Math.min(8, Math.pow(2, Math.min(3, p.airKills))); p.mult = mult; lv.msg = { text: 'COMBO x' + mult, t: 40 }; } else { p.airKills = 0; p.mult = 1; } }
  p.score += d.score * mult * (lv.arena ? 1 : 1);
  if (lv.arena) lv.arena.kills++;
}
function updateEnemies(lv, p) {
  for (let i = lv.enemies.length - 1; i >= 0; i--) {
    const e = lv.enemies[i]; if (e.dead) { lv.enemies.splice(i, 1); continue; }
    if (e.spawnT > 0) { e.spawnT--; continue; }
    e.t++; if (e.hurt > 0) e.hurt--;
    if (e.x > lv.camx - 60 && e.x < lv.camx + W + 60 || lv.arena) ENEMY[e.type].upd(e, lv, p);
    // contacto
    if (!p.dead && aabb(pBox(p), { x: e.x - e.w / 2, y: e.y - e.h, w: e.w, h: e.h })) hurtPlayer(p, 1, Math.sign(p.x - e.x) * 3);
  }
  // explosiones de bombas
  for (let i = lv.eb.length - 1; i >= 0; i--) {
    const b = lv.eb[i];
    if (b.explode && b.life <= 1) {
      lv.eb.splice(i, 1); Audio.sExplo(true); shake(8); buzz(70); spawnParts(b.x, b.y, 40, ['#ffb347', '#fff', '#ff5e2b'], 4, 30, 0.05);
      lv.blast = { x: b.x, y: b.y, r: 44, t: 12 };
      if (!p.dead && Math.hypot(p.x - b.x, p.y - 20 - b.y) < 44) hurtPlayer(p, 2, Math.sign(p.x - b.x) * 3);
      for (const e of lv.enemies) if (!e.dead && Math.hypot(e.x - b.x, e.y - e.h / 2 - b.y) < 48) killEnemy(e, lv, p); // usar el entorno a tu favor
    }
  }
}
function drawEnemies(lv, p) {
  for (const e of lv.enemies) {
    if (e.spawnT > 0) { if (e.spawnT % 4 < 2) { ctx.globalAlpha = .5; R(Math.round(e.x - lv.camx) - e.w / 2, Math.round(e.y) - e.h, e.w, e.h, '#31ff8a'); ctx.globalAlpha = 1; } continue; }
    const d = ENEMY[e.type];
    ctx.save(); ctx.translate(Math.round(e.x - lv.camx), Math.round(e.y)); ctx.scale((e.face || -1) * ES, ES);
    if (e.gold) { ctx.globalAlpha = .35 + .2 * Math.sin(e.t * .2); R(-d.w / 2 - 3, -d.h - 3, d.w + 6, d.h + 6, '#ffd23f'); ctx.globalAlpha = 1; }
    if (e.hurt > 0) ctx.globalAlpha = .5;
    ENEMY[e.type].draw(e); ctx.restore(); ctx.globalAlpha = 1;
    if (p.items.visor) { const x = Math.round(e.x - lv.camx) - 8, y = Math.round(e.y) - e.h - 5; R(x, y, 16, 2, '#123'); R(x, y, Math.round(16 * e.hp / e.maxHp), 2, '#31ff8a'); }
  }
}
