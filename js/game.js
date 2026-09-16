// ============================================================
//  ESTADO GLOBAL DEL JUEGO
// ============================================================
const GAME = { scene: 'boot', t: 0, p: null, lv: null, levelIdx: 0, photo: null, photoReady: false, shop: null, pause: false, sel: 0, after: null, endT: 0, rank: '' };
GAME.photo = new Image(); GAME.photo.onload = () => { GAME.photoReady = true; }; GAME.photo.src = PHOTO_SRC;
const pxc = document.createElement('canvas'); pxc.width = 48; pxc.height = 27; const pxx = pxc.getContext('2d');

function setScene(s) { GAME.scene = s; GAME.t = 0; Input.tap = null; }

// ---------- fondo del salón arcade (pantalla de título) ----------
function drawArcadeRoom(t, noMachine) {
  if (Assets.ok && Assets.bgOk) { // salón arcade recortado del video
    ctx.imageSmoothingEnabled = true; ctx.drawImage(Assets.bg, 0, 0, 824, 400, 0, 0, BG_W, 226); ctx.drawImage(Assets.bg, 0, 0, 824, 400, BG_W, 0, BG_W, 226); ctx.imageSmoothingEnabled = false;
    R(0, 226, W, H - 226, '#0c0816'); drawGround(-20, 230, W + 40, 40);
    if (!noMachine) { // la máquina corrupta que lo va a succionar
      ctx.globalAlpha = .35 + .15 * Math.sin(t * .1); R(392, 96, 78, 134, '#ff3fb0'); ctx.globalAlpha = 1;
      spr('boss_machine', 432, 230 + Math.sin(t * .05) * 2, 128, 'feet'); txt('THEOBROMA', 412, 114, 4, '#ffb347', 'center', false);
    }
    ctx.globalAlpha = .10; R(0, 0, W, H, '#ff3fb0'); ctx.globalAlpha = 1;
    return;
  }
  drawSky('#0a0618', '#1c0e3a');
  for (let x = 0; x < W; x += 24) for (let y = 30; y < 200; y += 24) { R(x, y, 23, 23, '#140b2a'); }
  // holograma de la pizarra convertida en neón
  ctx.globalAlpha = .75 + .15 * Math.sin(t * .1); txt('THEOBROMA', W / 2, 44, 12, '#37f0ff', 'center', false); txt('CACAO', W / 2, 60, 12, '#ff3fb0', 'center', false);
  ctx.strokeStyle = '#37f0ff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(W / 2, 78); ctx.lineTo(W / 2, 110); ctx.stroke(); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(W / 2, 84 + i * 8); ctx.lineTo(W / 2 + (i % 2 ? 14 : -14), 78 + i * 8); ctx.stroke(); }
  ctx.globalAlpha = 1;
  // máquinas arcade
  const mach = (x, col, big) => { const h = big ? 120 : 90, w = big ? 54 : 40; R(x, 200 - h, w, h, '#1a1a2a'); R(x + 2, 200 - h + 2, w - 4, h - 4, '#2a2a3e'); R(x + 5, 200 - h + 8, w - 10, big ? 40 : 30, big ? (t % 20 < 10 ? '#ff3fb0' : '#a34dff') : col); R(x + 6, 200 - h + 9, w - 12, big ? 38 : 28, big ? '#2a0a3a' : '#0a0a14'); if (big) { for (let i = 0; i < 6; i++) { const a = t * .1 + i; R(x + 27 + Math.cos(a) * (6 + i * 2), 200 - h + 28 + Math.sin(a) * (4 + i * 1.5), 3, 3, i % 2 ? '#ff3fb0' : '#a34dff'); } } R(x + 5, 200 - h + (big ? 60 : 48), w - 10, 8, '#111'); R(x + 10, 200 - h + (big ? 61 : 49), 4, 4, '#f33'); R(x + 18, 200 - h + (big ? 61 : 49), 4, 4, '#3f3'); R(x + 26, 200 - h + (big ? 61 : 49), 4, 4, '#33f'); R(x, 200 - h - 6, w, 6, col); };
  mach(30, '#37f0ff'); mach(80, '#ffd23f'); mach(330, '#31ff8a'); mach(380, '#ff8c00'); mach(410, '#a34dff', true);
  R(0, 200, W, 70, '#12091f'); for (let x = 0; x < W; x += 20) R(x, 200, 19, 1, '#3a2a5a'); for (let y = 210; y < H; y += 20) for (let x = (y / 20) % 2 * 10; x < W; x += 20) R(x, y, 10, 10, '#160b26');
  ctx.globalAlpha = .12; R(0, 0, W, H, '#ff3fb0'); ctx.globalAlpha = 1;
}

// ---------- INTRO: la foto real se desintegra en píxeles ----------
function drawPhoto(alpha) { if (!GAME.photoReady) { drawSky('#2a2a2a', '#0a0a0a'); return; } ctx.globalAlpha = alpha === undefined ? 1 : alpha; ctx.drawImage(GAME.photo, 0, 0, W, H); ctx.globalAlpha = 1; }
function sceneIntro() {
  const t = GAME.t;
  if (GAME.introPhase === 0) { // foto quieta
    drawPhoto();
    ctx.globalAlpha = .55; R(0, 0, W, 18, '#000'); ctx.globalAlpha = 1; txt('THEOBROMA CACAO', 8, 5, 7, '#f1e4c8');
    if (t % 60 < 40) txt('TOCA PARA COMENZAR', W / 2, 246, 8, '#fff', 'center');
    if (Input.anyP && t > 20) { GAME.introPhase = 1; GAME.t = 0; Audio.sStatic(); buzz(40); }
    return;
  }
  // barrido de escáner rosa
  const sweep = Math.min(W + 30, t * 5);
  drawPhoto();
  if (GAME.photoReady) {
    pxx.drawImage(GAME.photo, 0, 0, 48, 27);
    ctx.imageSmoothingEnabled = false; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, sweep, H); ctx.clip(); ctx.drawImage(pxc, 0, 0, W, H);
    // bloques que se desintegran en código
    for (let i = 0; i < 60; i++) { const x = ((i * 97 + t * 3) % (sweep + 1)), y = (i * 53 + t) % H; ctx.globalAlpha = .6; R(x, y, 10, 8, i % 3 ? '#ff3fb0' : '#37f0ff'); ctx.globalAlpha = 1; if (i % 4 === 0) txt(pick(['0', '1']), x, y, 6, '#31ff8a', 'left', false); }
    ctx.restore();
  }
  // la sala arcade emerge tras la línea
  const p2 = clamp((t - 60) / 90, 0, 1); if (p2 > 0) { ctx.globalAlpha = p2; drawArcadeRoom(t); ctx.globalAlpha = 1; }
  if (sweep < W + 20) { ctx.globalAlpha = .4; R(sweep - 14, 0, 18, H, '#ff3fb0'); ctx.globalAlpha = 1; R(sweep - 3, 0, 3, H, '#ff3fb0'); R(sweep - 1, 0, 1, H, '#fff'); }
  if (t % 4 === 0 && sweep < W) Audio.sHit();
  if (t > 160) setScene('title');
}

// ---------- TÍTULO ----------
function sceneTitle() {
  const t = GAME.t; drawArcadeRoom(t); Audio.play('title');
  // héroe levantando la hamburguesa
  if (Assets.ok) spr('hero_burger_up', 96, 232 + Math.sin(t * .08) * 2, 130, 'feet'); else { drawHero(200, 200, 1, 'idle', 0, { shoes: false, visor: false, glove: false }); drawBurger(206, 158 + Math.sin(t * .1) * 2, 'n'); }
  // logotipo
  const ly = 104 + Math.sin(t * .05) * 2, jit = (t % 90 < 3) ? rint(-2, 2) : 0;
  txt('MALANITO', W / 2 + jit, ly, 22, '#ff3fb0', 'center'); txt('MALANITO', W / 2 + jit + 1, ly - 1, 22, '#ffd6ef', 'center', false);
  txt('DESTRUCTOR', W / 2 - jit, ly + 26, 20, '#ffd23f', 'center'); txt('DESTRUCTOR', W / 2 - jit + 1, ly + 25, 20, '#fff2b0', 'center', false);
  if (!Save.data.arena) {
    if (t % 50 < 35) txt('TOCA PARA INICIAR', W / 2, 176, 9, '#ffd23f', 'center');
    if (Input.anyP && t > 30) { Audio.sInsert(); buzz(30); startCampaign(); }
  } else {
    const opts = ['CAMPAÑA', 'ARENA INFINITA']; const tp = Input.tap; Input.tap = null;
    for (let i = 0; i < 2; i++) { const y = 168 + i * 18, on = GAME.sel === i; if (on && t % 30 < 20) txt('>', W / 2 - 78, y, 9, '#ffd23f', 'center'); txt(opts[i], W / 2, y, 9, on ? '#fff' : '#b9a6d6', 'center'); if (tp && Math.abs(tp.y - y - 4) < 10) { if (GAME.sel === i && t > 30) { Audio.sInsert(); if (i === 0) startCampaign(); else startArena(); return; } GAME.sel = i; Audio.sCoin(); } }
    if ((Input.d && !GAME.dHeld) || (Input.u && !GAME.uHeld)) { GAME.sel = 1 - GAME.sel; Audio.sCoin(); } GAME.dHeld = Input.d; GAME.uHeld = Input.u;
    if ((Input.jumpP || Input.keys.Enter) && t > 30) { Audio.sInsert(); if (GAME.sel === 0) startCampaign(); else startArena(); return; }
    txt('RÉCORD ARENA: ' + Save.data.best, W / 2, 210, 6, '#37f0ff', 'center');
  }
  txt(IS_TOUCH ? 'CRUCETA · SALTO · PODER · PATADA · HAMBURGUESA' : 'FLECHAS  Z:PODER  X:SALTO  C:PATADA  E:HAMBURGUESA', W / 2, 232, 5, '#8a7aa8', 'center');
  txt('PODER ACTIVA EL RAYO CALAVERA CADA 4 SEGUNDOS', W / 2, 244, 5, '#8a7aa8', 'center');
}
function startCampaign() { GAME.p = newPlayer(); GAME.levelIdx = 0; setScene('portal'); Audio.stop(); Audio.sPortal(); }
function startArena() { GAME.p = newPlayer(); GAME.p.burgers = 0; GAME.p.items = { shoes: true, visor: true, glove: true }; GAME.p.fireRate = 3; GAME.lv = buildArena(); GAME.p.x = 240; GAME.p.y = 230; setScene('play'); Audio.play('arena'); GAME.lv.msg = { text: 'COLISEO GLITCH', t: 120 }; }

// ---------- PORTAL: la máquina lo succiona ----------
function scenePortal() {
  const t = GAME.t;
  if (t < 130) { // camina hacia la máquina y es absorbido
    drawArcadeRoom(t);
    const hx = Math.min(388, 120 + t * 3); let hy = 230;
    if (t > 90) { hy = 230 - (t - 90) * 1.8; ctx.globalAlpha = .5; R(392, 96, 78, 134, '#ff3fb0'); ctx.globalAlpha = 1; for (let i = 0; i < 12; i++) R(hx + rnd(-16, 24), hy - rnd(0, 44), 2, 2, i % 2 ? '#ff3fb0' : '#fff'); }
    drawHero(hx, hy, 1, t > 90 ? 'jump' : 'run', Math.floor(t / 6), GAME.p.items, t > 110 ? 1 - (t - 110) / 20 : 1); if (!Assets.ok) drawBurger(hx + 6, hy - 42, 'n');
    if (t === 95) buzz(200);
  } else if (t < 260) { // túnel cibernético
    drawSky('#050510', '#0a0a2a'); const tt = t - 130;
    for (let i = 0; i < 40; i++) { const a = i * 0.157 + tt * 0.02, r = ((i * 37 + tt * 6) % 300); const x = W / 2 + Math.cos(a) * r, y = H / 2 + Math.sin(a) * r * 0.6; R(x, y, 2 + r / 60, 2 + r / 60, i % 3 === 0 ? '#ff3fb0' : i % 3 === 1 ? '#37f0ff' : '#a34dff'); }
    for (let i = 0; i < 12; i++) { const s = ((tt * 4 + i * 45) % 320) / 320; ctx.strokeStyle = `rgba(55,240,255,${0.6 - s * 0.6})`; ctx.lineWidth = 1; ctx.strokeRect(W / 2 - s * W / 2, H / 2 - s * H / 2, s * W, s * H); }
    for (let i = 0; i < 20; i++) txt(pick(['0', '1']), (i * 53 + tt * 2) % W, (i * 71 + tt * 5) % H, 6, '#31ff8a', 'left', false);
    txt('MUNDO DE DATOS', W / 2, 40, 10, '#fff', 'center');
  } else { startLevel(0); return; }
  if (Input.anyP && t > 20) { startLevel(0); return; }
  if (t % 50 < 30) txt('TOCA PARA SALTAR', W - 8, H - 12, 5, '#8a7aa8', 'right', false);
}

function startLevel(idx) {
  GAME.levelIdx = idx; const build = [buildLevel1, buildLevel2, buildLevel3][idx];
  GAME.lv = build(); const p = GAME.p; p.x = 40; p.y = 230; p.vx = 0; p.vy = 0; p.cpx = 40; p.cpy = 230; p.dead = false; p.kick = null; p.inv = 60; p.charge = 0;
  if (p.hp <= 0) p.hp = p.maxHp;
  GAME.lv.msg = { text: 'ETAPA ' + (idx + 1) + ': ' + LEVEL_NAMES[idx], t: 150 }; setScene('play'); Audio.play('level'); FX.dark = 0;
}

// ============================================================
//  BUCLE DE NIVEL (campaña, bonificación y arena comparten motor)
// ============================================================
function updatePlay() {
  const lv = GAME.lv, p = GAME.p; lv.t++;
  if (Input.pauseP) { GAME.pause = !GAME.pause; Audio.sStatic(); }
  if (GAME.pause) return;
  updateHazards(lv);
  if (lv.arena) updateArena(lv, p);
  if (lv.bonus) updateBonus(lv, p);
  // muerte
  if (p.dead) { p.deadT++; if (p.deadT === 1) Audio.stop(); if (p.deadT > 90) { if (lv.arena) arenaOver(); else setScene('gameover'); } updateParts(); return; }
  if (!p.kick) movePlayer(p, lv);
  playerActions(p, lv);
  Input.tap = null;
  // cámara y jefe
  if (!lv.arena && !lv.bonus) {
    if (lv.state === 'play') {
      lv.camx = clamp(p.x - W * 0.4, 0, lv.w - W);
      if (lv.camx >= lv.bossX && lv.bossX > 0) { lv.state = 'boss'; lv.camx = lv.bossX; lv.minX = lv.bossX; lv.w = lv.bossX + W; lv.boss = lv.makeBoss(); Audio.play('boss'); Audio.sAlarm(); shake(6); lv.msg = { text: '¡JEFE!', t: 90 }; lv.enemies.length = 0; }
    }
    if (lv.boss) { lv.boss.update(lv, p); if (lv.boss.dead && lv.boss.deadT > 100 && lv.state === 'boss') { lv.state = 'clear'; lv.clearT = 0; Audio.stop(); Audio.sVictory(); FX.freeze = 20; flash(20, '#fff'); lv.msg = { text: 'ETAPA SUPERADA', t: 180 }; p.score += 5000; } }
    if (lv.state === 'clear') { lv.clearT++; if (lv.clearT === 100) { lv.pickups.push({ x: lv.camx + 240, y: 230, type: 'burger' }); } if (lv.clearT > 200) { if (GAME.levelIdx === 2) { setScene('ending'); Audio.stop(); } else { GAME.after = GAME.levelIdx + 1; GAME.lv = buildBonus(); GAME.p.x = 240; GAME.p.y = 230; GAME.p.vx = 0; GAME.p.kick = null; setScene('play'); Audio.play('bonus'); GAME.lv.msg = { text: 'CÁMARA DE LA LLUVIA DORADA', t: 150 }; return; } } }
  } else if (lv.boss) { lv.boss.update(lv, p); if (lv.boss.dead && lv.boss.deadT > 80) { lv.boss = null; lv.arena.bossWave = false; lv.arena.waveT = 60; for (const s of lv.solids) if (s.tile) s.off = false; } }
  updateEnemies(lv, p); updateBullets(lv, p); updateCoins(lv, p); updatePickups(lv, p); updateParts();
  if (lv.wave) { lv.wave.r += 12; if (lv.wave.r > 500) lv.wave = null; }
  if (lv.blast) { lv.blast.t--; if (lv.blast.t <= 0) lv.blast = null; }
  if (lv.msg) { lv.msg.t--; if (lv.msg.t <= 0) lv.msg = null; }
  if (p.meter >= 100 && lv.t % 40 === 0 && !p.kick) { /* parpadeo del medidor */ }
  if (lv.arena) FX.slow = (p.hp <= 1 && p.burgers === 0) ? 0.85 : 1; else FX.slow = 1;
}

function drawPlay() {
  const lv = GAME.lv, p = GAME.p;
  const sx = FX.shake > 0 ? rnd(-FX.shake, FX.shake) : 0, sy = FX.shake > 0 ? rnd(-FX.shake, FX.shake) : 0;
  ctx.save(); ctx.translate(Math.round(sx * .5), Math.round(sy * .5));
  drawBG(lv, lv.arena ? [1, 2, 3][lv.arena.scen] : (lv.bonus ? 1 : undefined));
  if (lv.bonus) drawBonusBG(lv);
  if (lv.arena) drawArenaBG(lv);
  drawCoins(lv); drawPickups(lv); drawEnemies(lv, p);
  if (lv.boss) { if (lv.arena) ctx.globalAlpha = .7; lv.boss.draw(lv); ctx.globalAlpha = 1; }
  // jugador
  if (!p.dead) {
    const vis = p.inv > 0 && p.inv % 6 < 3 ? 0.35 : 1;
    if (p.kick && p.kick.ph === 2) { ctx.globalAlpha = .6; R(Math.round(p.x - lv.camx) - 20 - p.kick.t * 2, p.y - 10, 40 + p.kick.t * 4, 10, '#ffd23f'); ctx.globalAlpha = 1; }
    let hst = p.kick && p.kick.ph < 2 ? 'kick' : p.st;
    if (p.eatT > 0 && !p.kick) hst = 'eat';
    else if (lv.state === 'clear' && p.onGround && Math.abs(p.vx) < 0.4 && !Input.shoot && !Input.d) hst = 'victory';
    drawHero(p.x - lv.camx, p.y, p.face, hst, p.anim, p.items, vis);
    if (p.charge >= 36) {
      ctx.globalAlpha = .7 + .3 * Math.sin(frame * .4);
      const cx = Math.round(p.x - lv.camx) + p.face * 14, cy = p.y - (p.st === 'crouch' ? HERO.cchest : HERO.chest);
      R(cx - 7, cy - 7, 14, 14, '#ff3fb0');
      R(cx - 5, cy - 5, 10, 10, '#ffb3e0');
      R(cx - 3, cy - 3, 6, 6, '#fff');
      R(cx - 1, cy - 1, 2, 2, '#37f0ff');
      ctx.globalAlpha = 1;
    } else if (p.charge > 6) {
      const r = p.charge / 36;
      ctx.globalAlpha = .5;
      const cx = Math.round(p.x - lv.camx) + p.face * 14, cy = p.y - (p.st === 'crouch' ? HERO.cchest : HERO.chest);
      R(cx - r * 6, cy - r * 6, r * 12, r * 12, '#ff3fb0');
      R(cx - r * 3, cy - r * 3, r * 6, r * 6, '#fff');
      ctx.globalAlpha = 1;
    }
    if (p.fries > 0) { ctx.globalAlpha = .5; R(Math.round(p.x - lv.camx) - 8, p.y - HERO.h - 7, 16, 3, '#e03a2a'); R(Math.round(p.x - lv.camx) - 8, p.y - HERO.h - 7, Math.round(16 * p.fries / 480), 3, '#ffd23f'); ctx.globalAlpha = 1; }
  } else { spawnParts(p.x, p.y - 20, 2, ['#2a63d6', '#f1c49b', '#111'], 2, 30, 0.1); }
  drawBullets(lv); drawParts(lv.camx);
  if (lv.wave) { ctx.globalAlpha = .8 * (1 - lv.wave.r / 500); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(lv.wave.x - lv.camx, lv.wave.y, lv.wave.r, 0, 7); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(lv.wave.x - lv.camx, lv.wave.y, lv.wave.r * 0.8, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
  if (lv.blast) { ctx.globalAlpha = lv.blast.t / 12; ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.arc(lv.blast.x - lv.camx, lv.blast.y, lv.blast.r * (1 - lv.blast.t / 24), 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
  ctx.restore();
  if (FX.dark > 0) { ctx.globalAlpha = FX.dark; R(0, 0, W, H, '#000'); ctx.globalAlpha = 1; if (lv.boss && lv.boss.charging) txt('¡A LOS BORDES O PATADA!', W / 2, 60, 8, frame % 10 < 5 ? '#ff3f3f' : '#fff', 'center'); }
  drawHUD(p, lv);
  if (lv.boss && !lv.boss.dead && lv.boss.state !== 'enter') lv.boss.drawBar(lv);
  if (lv.msg) { const a = Math.min(1, lv.msg.t / 20); ctx.globalAlpha = a; txt(lv.msg.text, W / 2, lv.msg.text.startsWith('COMBO') ? 62 : 80, lv.msg.text.length > 22 ? 8 : 12, lv.msg.text.startsWith('COMBO') ? '#37f0ff' : '#ffd23f', 'center'); ctx.globalAlpha = 1; }
  if (lv.bonus) drawBonusHUD(lv);
  if (lv.arena) drawArenaHUD(lv, p);
  Input.drawTouchUI(p);
  if (GAME.pause) { ctx.globalAlpha = .55; R(0, 0, W, H, '#000'); ctx.globalAlpha = 1; drawStatic(0.25); txt('PAUSA', W / 2, 110, 16, '#fff', 'center'); txt(IS_TOUCH ? 'TRES DEDOS PARA REANUDAR' : 'P PARA REANUDAR', W / 2, 140, 7, '#aaa', 'center'); }
}
function drawStatic(a) { ctx.globalAlpha = a; for (let i = 0; i < 300; i++) R(Math.random() * W, Math.random() * H, 2, 1, Math.random() < .5 ? '#fff' : '#888'); for (let y = 0; y < H; y += 3) R(0, y, W, 1, '#000'); ctx.globalAlpha = 1; }

function drawHUD(p, lv) {
  if (Assets.ok) { // HUD con el retrato del video
    R(4, 4, 32, 30, '#000'); spr('hud_portrait', 5, 5, 28, 'tl');
    // barra de vida (roja) y medidor calavera (verde → dorado al llenarse)
    const bw = Math.min(120, p.maxHp * 12);
    R(38, 6, bw + 4, 9, '#000'); R(40, 8, bw, 5, '#3a0a1a'); R(40, 8, Math.round(bw * p.hp / p.maxHp), 5, p.hp <= 2 && frame % 20 < 10 ? '#fff' : '#ff2b5c'); R(40, 8, Math.round(bw * p.hp / p.maxHp), 1, '#ff8ca8');
    const ready = p.meter >= 100;
    R(38, 17, 72, 9, '#000'); R(40, 19, 68, 5, '#0a2a10'); R(40, 19, Math.round(68 * p.meter / 100), 5, ready ? (frame % 10 < 5 ? '#fff' : '#ffd23f') : '#31ff8a'); R(40, 19, Math.round(68 * p.meter / 100), 1, ready ? '#fff' : '#a8ffc8');
    const sk = 112; R(sk, 15, 12, 10, ready && frame % 12 < 6 ? '#ffd23f' : '#eee'); R(sk + 2, 18, 3, 3, '#111'); R(sk + 7, 18, 3, 3, '#111'); R(sk + 3, 25, 6, 3, '#eee'); R(sk + 4, 25, 1, 3, '#111'); R(sk + 7, 25, 1, 3, '#111');
    if (ready) { ctx.globalAlpha = .6; for (let i = 0; i < 4; i++) R(sk - 4 + rint(0, 20), 12 + rint(0, 18), 2, 2, '#fff'); ctx.globalAlpha = 1; }
    // botón hamburguesa con contador
    const b = Input.btn.burger; ctx.globalAlpha = p.burgers > 0 ? .85 : .4; R(b.x, b.y, b.w, b.h, '#1a1a2a'); ctx.strokeStyle = Input.burger ? '#fff' : '#ffd23f'; ctx.lineWidth = 1; ctx.strokeRect(b.x + .5, b.y + .5, b.w - 1, b.h - 1); ctx.globalAlpha = 1;
    drawBurger(b.x + 4, b.y + 5, 'n'); txt('x' + p.burgers, b.x + 26, b.y + 7, 8, p.burgers > 0 ? '#fff' : '#666');
    // puntuación y monedas (arriba a la derecha)
    txt(String(p.score).padStart(7, '0'), W - 8, 6, 7, '#fff', 'right');
    spr('hud_coin', W - 62, 15, 12, 'tl'); txt('x' + p.coins, W - 8, 17, 7, '#ffd23f', 'right');
    return;
  }
  // vida (esquina superior izquierda)
  R(10, 8, p.maxHp * 9 + 4, 12, '#000'); for (let i = 0; i < p.maxHp; i++) R(12 + i * 9, 10, 8, 8, i < p.hp ? (p.hp <= 2 && frame % 20 < 10 ? '#fff' : '#ff2b5c') : '#3a0a1a');
  // botón hamburguesa con contador
  const b = Input.btn.burger; ctx.globalAlpha = p.burgers > 0 ? .85 : .4; R(b.x, b.y, b.w, b.h, '#1a1a2a'); ctx.strokeStyle = Input.burger ? '#fff' : '#ffd23f'; ctx.lineWidth = 1; ctx.strokeRect(b.x + .5, b.y + .5, b.w - 1, b.h - 1); ctx.globalAlpha = 1;
  drawBurger(b.x + 4, b.y + 5, 'n'); txt('x' + p.burgers, b.x + 26, b.y + 7, 8, p.burgers > 0 ? '#fff' : '#666');
  // medidor calavera + puntuación (esquina superior derecha)
  const mx = W - 100, my = 10; R(mx - 2, my - 2, 72, 12, '#000'); R(mx, my, 68, 8, '#2a1a0a'); R(mx, my, Math.round(68 * p.meter / 100), 8, p.meter >= 100 ? (frame % 10 < 5 ? '#fff' : '#ffd23f') : '#ffb347');
  // calavera
  const sk = W - 26, ready = p.meter >= 100; R(sk, 6, 12, 10, ready && frame % 12 < 6 ? '#ffd23f' : '#eee'); R(sk + 2, 9, 3, 3, '#111'); R(sk + 7, 9, 3, 3, '#111'); R(sk + 3, 16, 6, 3, '#eee'); R(sk + 4, 16, 1, 3, '#111'); R(sk + 7, 16, 1, 3, '#111');
  if (ready) { ctx.globalAlpha = .6; for (let i = 0; i < 4; i++) R(sk - 4 + rint(0, 20), 2 + rint(0, 18), 2, 2, '#fff'); ctx.globalAlpha = 1; }
  txt(String(p.score).padStart(7, '0'), W - 10, 24, 7, '#fff', 'right');
  txt('$' + p.coins, W - 10, 34, 6, '#ffd23f', 'right');
}

// ============================================================
//  BONIFICACIÓN: lluvia dorada
// ============================================================
function updateBonus(lv, p) {
  const b = lv.bonus; if (b.done) { b.doneT++; if (b.doneT > 200) { GAME.shop = null; setScene('shop'); Audio.stop(); } return; }
  b.time--; b.spawnT--;
  if (b.spawnT <= 0) { b.spawnT = Math.max(14, 24 - Math.floor((1800 - b.time) / 180)); const x = clamp(p.x + rnd(-130, 130), 20, W - 20);
    if (Math.random() < 0.18) lv.pickups.push({ x, y: -10, type: 'burnt', vy: 1.4 }); else { lv.coins.push({ x, y: -6, vx: 0, vy: rnd(0.8, 1.25), t: rint(0, 40), life: 9999, ground: false, bonusCoin: true }); b.total++; } }
  // hamburguesas quemadas
  for (let i = lv.pickups.length - 1; i >= 0; i--) { const it = lv.pickups[i]; if (it.type !== 'burnt') continue; it.y += it.vy;
    if (it.y >= 230) { lv.pickups.splice(i, 1); continue; }
    if (aabb(pBox(p), { x: it.x - 8, y: it.y - 12, w: 16, h: 12 })) { lv.pickups.splice(i, 1); b.time -= 120; FX.glitch = 12; Audio.sNo(); buzz(60); lv.msg = { text: '-2 SEGUNDOS', t: 40 }; } }
  if (b.time <= 0) { b.time = 0; b.done = true; b.doneT = 0; lv.coins.length = 0; for (let i = lv.pickups.length - 1; i >= 0; i--) if (lv.pickups[i].type === 'burnt') lv.pickups.splice(i, 1);
    if (b.missed === 0 && b.got > 0) { lv.pickups.push({ x: 240, y: 230, type: 'neon' }); lv.msg = { text: '¡PERFECTO! HAMBURGUESA DE NEÓN', t: 200 }; Audio.sVictory(); }
    else { lv.msg = { text: 'MONEDAS: ' + b.got + '  PERDIDAS: ' + b.missed, t: 200 }; } }
}
function drawBonusBG(lv) { ctx.globalAlpha = .25; for (let i = 0; i < 20; i++) R((i * 61 + frame * 2) % W, (i * 37 + frame * 3) % 230, 1, 8, '#ffd23f'); ctx.globalAlpha = 1;
  for (const it of lv.pickups) if (it.type === 'burnt') { drawBurger(Math.round(it.x) - 8, Math.round(it.y) - 12, 'burnt'); ctx.globalAlpha = .5; R(Math.round(it.x) - 2, Math.round(it.y) - 18 - (frame % 4), 3, 3, '#555'); ctx.globalAlpha = 1; } }
function drawBonusHUD(lv) { const b = lv.bonus; const s = Math.ceil(b.time / 60); txt(String(s).padStart(2, '0'), W / 2, 44, 16, s <= 5 && frame % 10 < 5 ? '#ff2b5c' : '#fff', 'center'); txt('ATRAPA TODAS · EVITA LAS QUEMADAS', W / 2, 62, 5, '#ffd23f', 'center'); if (b.missed > 0) txt('PERDIDAS: ' + b.missed, W / 2, 70, 5, '#ff8c8c', 'center'); }

// ============================================================
//  TIENDA CLANDESTINA
// ============================================================
function shopItems(p) {
  return [
    { id: 'burger', name: 'HAMBURGUESA', desc: 'Curación +3 (1 uso)', price: 30, ok: true },
    { id: 'gold', name: 'H. DORADA', desc: 'Vida máxima +2', price: 80, ok: true },
    { id: 'rate', name: 'CADENCIA', desc: 'Láser más rápido', price: 60, ok: p.fireRate < 4 },
    { id: 'shoes', name: 'ZAPATILLAS', desc: 'Doble salto', price: 100, ok: !p.items.shoes },
    { id: 'visor', name: 'VISOR', desc: 'Revela secretos y vida enemiga', price: 90, ok: !p.items.visor },
    { id: 'glove', name: 'GUANTELETE', desc: 'El láser rebota x3', price: 120, ok: !p.items.glove && GAME.after >= 2 }
  ];
}
function buyItem(p, it) {
  if (!it.ok) { Audio.sNo(); return; } if (p.coins < it.price) { Audio.sNo(); GAME.shopMsg = { text: 'MONEDAS INSUFICIENTES', t: 60 }; return; }
  p.coins -= it.price; Audio.sBuy(); buzz(30);
  if (it.id === 'burger') p.burgers++; else if (it.id === 'gold') { p.maxHp += 2; p.hp = Math.min(p.maxHp, p.hp + 2); } else if (it.id === 'rate') p.fireRate++; else p.items[it.id] = true;
  GAME.shopMsg = { text: '¡COMPRADO: ' + it.name + '!', t: 60 };
}
function sceneShop() {
  const p = GAME.p, t = GAME.t; drawBG(GAME.lv, 1); ctx.globalAlpha = .6; R(0, 0, W, H, '#000'); ctx.globalAlpha = 1;
  // máquina expendedora oxidada
  R(14, 40, 86, 190, '#5a3a2a'); R(18, 44, 78, 182, '#7a4a30'); R(24, 52, 66, 100, '#101820'); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { drawBurger(28 + c * 20, 58 + r * 30, r === 1 ? 'g' : 'n'); } R(24, 160, 66, 8, '#111'); R(30, 175, 54, 40, '#2a1a10'); R(50, 180, 14, 4, '#ffd23f'); txt('$' + p.coins, 57, 195, 8, '#ffd23f', 'center'); R(40, 232, 40, 6, '#333');
  txt('TIENDA CLANDESTINA', 290, 44, 10, '#ff3fb0', 'center'); txt('TUS MONEDAS: ' + p.coins, 290, 58, 7, '#ffd23f', 'center');
  const items = shopItems(p), tp = Input.tap; Input.tap = null;
  for (let i = 0; i < items.length; i++) {
    const it = items[i], col = i % 3, row = Math.floor(i / 3), x = 122 + col * 116, y = 74 + row * 62, on = GAME.sel === i;
    R(x, y, 108, 56, on ? '#3a1a4a' : '#1a1020'); ctx.strokeStyle = on ? '#ffd23f' : (it.ok ? '#5a3a7a' : '#333'); ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, 107, 55);
    txt(it.name, x + 54, y + 6, 7, it.ok ? '#fff' : '#666', 'center'); txt(it.desc, x + 54, y + 20, 5, it.ok ? '#c9b8e0' : '#555', 'center'); txt(it.ok ? '$' + it.price : 'ADQUIRIDO', x + 54, y + 40, 7, it.ok ? (p.coins >= it.price ? '#ffd23f' : '#ff6a6a') : '#31ff8a', 'center');
    if (tp && tp.x > x && tp.x < x + 108 && tp.y > y && tp.y < y + 56) { if (GAME.sel === i) buyItem(p, it); else { GAME.sel = i; Audio.sCoin(); } }
  }
  // botón continuar
  const bx = 290 - 60, by = 208; R(bx, by, 120, 26, t % 40 < 30 ? '#2a63d6' : '#3b7cf0'); txt('CONTINUAR', 290, by + 9, 8, '#fff', 'center');
  if (tp && tp.x > bx && tp.x < bx + 120 && tp.y > by && tp.y < by + 26) { Audio.sInsert(); startLevel(GAME.after); return; }
  if (Input.r && !GAME.rHeld) { GAME.sel = (GAME.sel + 1) % 6; Audio.sCoin(); } if (Input.l && !GAME.lHeld) { GAME.sel = (GAME.sel + 5) % 6; Audio.sCoin(); }
  if (Input.d && !GAME.dHeld) { GAME.sel = (GAME.sel + 3) % 6; Audio.sCoin(); } if (Input.u && !GAME.uHeld) { GAME.sel = (GAME.sel + 3) % 6; Audio.sCoin(); }
  GAME.rHeld = Input.r; GAME.lHeld = Input.l; GAME.dHeld = Input.d; GAME.uHeld = Input.u;
  if (Input.jumpP) buyItem(p, items[GAME.sel]); if (Input.kickP || Input.keys.Enter) { Audio.sInsert(); Input.keys.Enter = false; startLevel(GAME.after); return; }
  if (GAME.shopMsg) { txt(GAME.shopMsg.text, 290, 244, 6, '#31ff8a', 'center'); if (--GAME.shopMsg.t <= 0) GAME.shopMsg = null; }
  else txt(IS_TOUCH ? 'TOCA DOS VECES PARA COMPRAR' : 'FLECHAS + X: COMPRAR   C: CONTINUAR', 290, 244, 5, '#8a7aa8', 'center');
}

// ============================================================
//  ARENA INFINITA: Coliseo Glitch
// ============================================================
const RANKS = [[2000, 'NOVATO DEL ARCADE'], [6000, 'CADETE GLITCH'], [15000, 'CAZADOR DE DRONES'], [30000, 'ROMPE-NÚCLEOS'], [60000, 'LEYENDA DEL COLISEO'], [Infinity, 'DIOS DEL CACAO DIGITAL']];
function rankFor(s) { for (const r of RANKS) if (s < r[0]) return r[1]; return RANKS[RANKS.length - 1][1]; }
function updateArena(lv, p) {
  const a = lv.arena;
  lv.hpMul = 1 + a.wave * 0.08; lv.spd = Math.min(1.9, 1 + a.wave * 0.025);
  // hazards por escenario
  lv.slippery = a.scen === 0 && a.wave > 10; lv.friction = lv.slippery ? 0.9 : 0.72; lv.wind = a.scen === 1 ? -0.04 : 0;
  for (const s of lv.solids) { if (s.grill) s.hazard = a.scen === 0; if (s.conv !== undefined && s.convBase) s.conv = a.scen === 2 ? s.convBase : 0; }
  if (a.rain > 0) { a.rain--; if (a.rain % 6 === 0) lv.coins.push({ x: rnd(60, W - 60), y: -6, vx: 0, vy: rnd(1, 2), t: 0, life: 400, ground: false }); }
  const alive = lv.enemies.filter(e => !e.dead).length;
  if (!a.bossWave && alive === 0 && !lv.boss) { a.waveT--; if (a.waveT <= 0) nextWave(lv, p); }
}
function nextWave(lv, p) {
  const a = lv.arena; a.wave++; a.waveT = 100;
  if (a.wave > 1 && a.wave % 10 === 1) { a.scen = (a.scen + 1) % 3; FX.glitch = 40; Audio.sStatic(); a.rain = 180; lv.msg = { text: 'FIEBRE DEL ORO', t: 100 }; }
  if (a.wave % 15 === 0) { a.bossWave = true; const B = [BossMicroondas, BossZepelin, BossNucleo][(a.wave / 15 - 1) % 3]; lv.boss = new B(W / 2 + 100); lv.boss.hp = Math.ceil(lv.boss.maxHp * 0.6); lv.boss.maxHp = lv.boss.hp; lv.boss.name = 'HOLOGRAMA: ' + lv.boss.name; lv.spd = 2; Audio.sAlarm(); lv.msg = { text: 'RULETA DE JEFES', t: 100 }; return; }
  lv.msg = { text: 'OLEADA ' + a.wave, t: 80 }; Audio.sAlarm();
  const n = 3 + Math.floor(a.wave * 0.8); const pool = a.wave < 4 ? ['taza', 'espatula'] : a.wave < 8 ? ['taza', 'espatula', 'dron'] : a.wave < 14 ? ['taza', 'espatula', 'dron', 'pinball'] : ['taza', 'espatula', 'dron', 'pinball', 'centinela'];
  for (let i = 0; i < n; i++) { const type = pick(pool), d = ENEMY[type]; const x = d.fly ? rnd(40, W - 40) : pick([60, 120, 360, 420, 240]); const y = d.fly ? rnd(90, 160) : 230; const e = spawnEnemy(lv, type, x, y, { spawnT: 20 + i * 18 }); a.spawned++; if (a.spawned % 5 === 0) e.gold = true; if (type === 'taza') { e.dir = x < W / 2 ? -1 : 1; e.vx = -0.9; e.upd0 = true; } }
}
function drawArenaBG(lv) { // vacío digital alrededor de la plataforma
  ctx.globalAlpha = .5; R(0, 230, 40, 40, '#000'); R(440, 230, 40, 40, '#000'); ctx.globalAlpha = 1; for (let i = 0; i < 10; i++) { R((i * 47 + frame) % 40, 235 + (i * 13 + frame * 2) % 35, 2, 2, '#a34dff'); R(440 + (i * 47 + frame) % 40, 235 + (i * 13 + frame * 2) % 35, 2, 2, '#a34dff'); } }
function drawArenaHUD(lv, p) { const a = lv.arena; txt('OLEADA ' + a.wave, W / 2, 8, 7, '#37f0ff', 'center'); if (p.mult > 1) txt('x' + p.mult, W / 2, 18, 7, '#ffd23f', 'center'); if (p.hp <= 1 && p.burgers === 0) { ctx.globalAlpha = .3 + .2 * Math.sin(frame * .3); R(0, 0, W, 3, '#ff2b5c'); R(0, H - 3, W, 3, '#ff2b5c'); ctx.globalAlpha = 1; } }
function arenaOver() { const p = GAME.p; GAME.rank = rankFor(p.score); if (p.score > Save.data.best) { Save.data.best = p.score; Save.data.bestRank = GAME.rank; GAME.newBest = true; } else GAME.newBest = false; Save.write(); setScene('arenaover'); }
function sceneArenaOver() {
  const t = GAME.t; drawArcadeRoom(t); ctx.globalAlpha = .7; R(0, 0, W, H, '#000'); ctx.globalAlpha = 1;
  txt('CAÍSTE EN EL COLISEO', W / 2, 50, 12, '#ff2b5c', 'center'); txt('OLEADA ' + GAME.lv.arena.wave + '  ·  BAJAS ' + GAME.lv.arena.kills, W / 2, 78, 7, '#aaa', 'center');
  txt('PUNTUACIÓN', W / 2, 100, 7, '#fff', 'center'); txt(String(GAME.p.score), W / 2, 112, 16, '#ffd23f', 'center');
  txt('RANGO CIBERNÉTICO', W / 2, 142, 7, '#fff', 'center'); txt(GAME.rank, W / 2, 156, 10, '#37f0ff', 'center');
  if (GAME.newBest && t % 30 < 20) txt('¡NUEVO RÉCORD!', W / 2, 178, 8, '#31ff8a', 'center');
  if (t > 60 && t % 50 < 35) txt('TOCA PARA VOLVER AL TÍTULO', W / 2, 220, 7, '#fff', 'center');
  if (Input.anyP && t > 60) { GAME.sel = 1; setScene('title'); }
}

// ============================================================
//  GAME OVER / FINAL
// ============================================================
function sceneGameOver() {
  const t = GAME.t; drawPlay(); ctx.globalAlpha = .7; R(0, 0, W, H, '#000'); ctx.globalAlpha = 1;
  txt('GAME OVER', W / 2, 80, 20, '#ff2b5c', 'center'); txt('ETAPA ' + (GAME.levelIdx + 1) + ' · ' + LEVEL_NAMES[GAME.levelIdx], W / 2, 112, 6, '#aaa', 'center');
  const opts = ['CONTINUAR (MISMA ETAPA)', 'VOLVER AL TÍTULO']; const tp = Input.tap; Input.tap = null;
  for (let i = 0; i < 2; i++) { const y = 150 + i * 20, on = GAME.sel === i; if (on && t % 30 < 20) txt('>', W / 2 - 110, y, 8, '#ffd23f', 'center'); txt(opts[i], W / 2, y, 8, on ? '#fff' : '#888', 'center'); if (tp && Math.abs(tp.y - y - 4) < 10 && t > 30) { if (GAME.sel === i) { pickGameOver(i); return; } GAME.sel = i; Audio.sCoin(); } }
  if ((Input.d && !GAME.dHeld) || (Input.u && !GAME.uHeld)) { GAME.sel = 1 - GAME.sel; Audio.sCoin(); } GAME.dHeld = Input.d; GAME.uHeld = Input.u;
  if ((Input.jumpP || Input.keys.Enter) && t > 30) { Input.keys.Enter = false; pickGameOver(GAME.sel); }
}
function pickGameOver(i) { Audio.sInsert(); if (i === 0) { const p = GAME.p; p.hp = p.maxHp; p.coins = Math.floor(p.coins * 0.7); p.meter = 0; p.dead = false; FX.dark = 0; startLevel(GAME.levelIdx); } else { GAME.sel = 0; setScene('title'); } }

function sceneEnding() {
  const t = GAME.t;
  if (t < 90) { // onda blanca que desintegra la fortaleza
    drawPlay(); const r = t * 8; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(W / 2, 140, r, 0, 7); ctx.fill(); if (t % 5 === 0) shake(10); if (t === 1) { Audio.sExplo(true); buzz(500); }
    return;
  }
  if (t === 90) { Save.data.arena = true; Save.write(); Audio.play('title'); }
  const f = clamp((t - 90) / 60, 0, 1);
  drawPhoto(); ctx.globalAlpha = 1 - f; R(0, 0, W, H, '#fff'); ctx.globalAlpha = 1;
  // máquina arcade humeando en el fondo
  ctx.globalAlpha = f; if (Assets.ok) { ctx.globalAlpha = f * .9; spr('boss_machine', 420, 230, 110, 'feet'); ctx.globalAlpha = f * .5; R(372, 130, 70, 100, '#000'); } else { R(400, 90, 40, 90, '#1a1a2a'); R(404, 96, 32, 26, '#111'); R(408, 100, 24, 18, t % 30 < 15 ? '#2a0a3a' : '#0a0a14'); R(400, 84, 40, 6, '#a34dff'); }
  for (let i = 0; i < 8; i++) { const yy = 84 - ((t * 0.7 + i * 12) % 70); ctx.globalAlpha = f * (yy / 84) * .7; R(410 + Math.sin(t * .05 + i) * 6 + i * 2, yy, 6 + i, 6 + i, '#777'); }
  ctx.globalAlpha = 1;
  ctx.globalAlpha = .6; R(0, 0, W, 60, '#000'); ctx.globalAlpha = 1;
  txt('EL NÚCLEO FERMENTADO HA CAÍDO', W / 2, 12, 9, '#ffd23f', 'center'); txt('MALANITO VUELVE A LA MESA CON SU HAMBURGUESA', W / 2, 28, 6, '#fff', 'center');
  txt('PUNTUACIÓN FINAL: ' + GAME.p.score, W / 2, 44, 6, '#37f0ff', 'center');
  if (t > 200) { ctx.globalAlpha = .7; R(0, 222, W, 48, '#000'); ctx.globalAlpha = 1; txt('COLISEO GLITCH DESBLOQUEADO', W / 2, 230, 9, frame % 20 < 10 ? '#ff3fb0' : '#fff', 'center'); txt('ARENA INFINITA DISPONIBLE EN EL TÍTULO', W / 2, 246, 6, '#aaa', 'center'); }
  if (Input.anyP && t > 240) { GAME.sel = 1; setScene('title'); }
}

// ============================================================
//  BUCLE PRINCIPAL
// ============================================================
let last = 0, acc = 0;
function tick(now) {
  requestAnimationFrame(tick);
  // Detección en tiempo real de cambios de pantalla/orientación
  const vv = window.visualViewport;
  const curW = (vv && vv.width > 0) ? Math.round(vv.width) : (window.innerWidth || 0);
  const curH = (vv && vv.height > 0) ? Math.round(vv.height) : (window.innerHeight || 0);
  if (curW > 0 && curH > 0 && (curW !== lastWW || curH !== lastWH)) {
    fit();
  }
  if (!last) last = now; let dt = (now - last) / 1000; last = now; if (dt > 0.1) dt = 0.1;
  acc += dt * 60 * FX.slow;
  let steps = 0;
  while (acc >= 1 && steps < 4) { acc -= 1; steps++; step(); }
  render();
}
function step() {
  frame++; Input.update(); Audio.update();
  if (FX.shake > 0) FX.shake = Math.max(0, FX.shake - 0.8); if (FX.flash > 0) FX.flash--; if (FX.glitch > 0) FX.glitch--; if (FX.negative > 0) FX.negative--;
  if (FX.freeze > 0) { FX.freeze--; return; }
  GAME.t++;
  switch (GAME.scene) {
    case 'boot': if (GAME.t > 2) { GAME.introPhase = 0; setScene('intro'); } break;
    case 'play': updatePlay(); break;
    default: break;
  }
}
function render() {
  ctx.setTransform(RS, 0, 0, RS, 0, 0); ctx.imageSmoothingEnabled = false;
  switch (GAME.scene) {
    case 'boot': R(0, 0, W, H, '#000'); break;
    case 'intro': sceneIntro(); break;
    case 'title': sceneTitle(); break;
    case 'portal': scenePortal(); break;
    case 'play': drawPlay(); break;
    case 'shop': sceneShop(); break;
    case 'gameover': sceneGameOver(); break;
    case 'ending': sceneEnding(); break;
    case 'arenaover': sceneArenaOver(); break;
  }
  if (FX.negative > 0) { ctx.globalCompositeOperation = 'difference'; R(0, 0, W, H, '#fff'); ctx.globalCompositeOperation = 'source-over'; }
  if (FX.flash > 0) { ctx.globalAlpha = Math.min(0.8, FX.flash / 12); R(0, 0, W, H, FX.flashCol); ctx.globalAlpha = 1; }
  if (FX.glitch > 0) { for (let i = 0; i < 6; i++) { const y = rint(0, H - 8), h = rint(2, 8), dx = rint(-14, 14); ctx.drawImage(cv, 0, y * RS, W * RS, h * RS, dx, y, W, h); } ctx.globalAlpha = .15; R(0, 0, W, H, pick(['#ff3fb0', '#37f0ff'])); ctx.globalAlpha = 1; }
  // líneas de escaneo CRT sutiles
  ctx.globalAlpha = .08; for (let y = 0; y < H; y += 2) R(0, y, W, 1, '#000'); ctx.globalAlpha = 1;
  // pausa: las escenas que no son 'play' siguen animando pero no avanzan lógica de nivel
  if (GAME.scene !== 'play' && GAME.scene !== 'boot') { Input.tap = null; }
}
// Pantalla de carga: fuente pixel
document.fonts && document.fonts.ready.then(() => { }).catch(() => { });
requestAnimationFrame(tick);
