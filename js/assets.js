// ============================================================
//  RECURSOS: mapa de la hoja de sprites (assets/sheet.png) y rutas de imágenes
//  Cada entrada del atlas es [x, y, ancho, alto] dentro de sheet.png
// ============================================================
'use strict';
const ATLAS = {"hero_stand": [0, 0, 46, 83], "hero_eat": [48, 0, 57, 88], "hero_run": [107, 0, 44, 86], "hero_shoot": [153, 0, 58, 78], "hero_kick": [213, 0, 60, 73], "hero_victory": [275, 0, 50, 94], "hero_burger_up": [327, 0, 87, 122], "hero_cheer": [416, 0, 66, 97], "boss_machine": [484, 0, 209, 253], "plat_cap": [695, 0, 34, 75], "plat_mid": [731, 0, 186, 75], "hud_portrait": [919, 0, 64, 60], "hud_heart": [985, 0, 30, 28], "hud_coin": [0, 255, 36, 28], "hud_orb": [38, 255, 28, 28]};
const SHEET_SRC = 'assets/sheet.png';   // héroe, jefe, plataformas y HUD recortados del video
const BG_SRC = 'assets/bg.jpg';         // salón arcade (fondo con paralaje)
const PHOTO_SRC = 'assets/photo.jpg';   // fotograma real del video para la intro y el final
