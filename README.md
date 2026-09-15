# Malanito Destructor

Plataformas retro estilo 16 bits para celular en horizontal (también se juega con teclado en PC).
HTML5 + Canvas + JavaScript puro, sin dependencias ni compilación. Los gráficos del héroe, el fondo,
las plataformas, el HUD y el jefe final están recortados del video original.

## Cómo ejecutarlo en Antigravity (o cualquier editor)

1. Abre la carpeta `malanito-destructor` como proyecto.
2. Levanta un servidor local en la raíz del proyecto (las imágenes se cargan por ruta relativa):
   - `python -m http.server 8080` y abre <http://localhost:8080>, o
   - `npx serve .`, o la extensión *Live Server*.
3. Para probarlo en el teléfono, entra desde el celular a la IP de tu PC en la misma red
   (por ejemplo `http://192.168.1.20:8080`) y gira el teléfono.

> También funciona abriendo `index.html` directamente (doble clic), pero algunos navegadores
> bloquean el audio o las imágenes con `file://`; el servidor local es la opción segura.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Lienzo, aviso "gira tu teléfono" y el orden de carga de los scripts (ese orden importa). |
| `css/style.css` | Estilos: lienzo pixelado a pantalla completa y la pantalla de rotación. |
| `js/assets.js` | Atlas de la hoja de sprites (`[x, y, ancho, alto]` por sprite) y rutas de las imágenes. |
| `js/core.js` | Motor base: lienzo 480×270 lógico (960×540 real), utilidades, guardado, efectos, partículas, entrada táctil/teclado, audio chiptune sintetizado y el cargador de sprites (`spr()`). |
| `js/entities.js` | Héroe (poses, física, disparo, Rayo Calavera, Patada Súper Extrema), monedas, objetos, proyectiles y la tabla de enemigos `ENEMY`. |
| `js/levels.js` | Los tres niveles, la bonificación, la arena, el dibujado del fondo/plataformas y los tres jefes. |
| `js/game.js` | Máquina de estados: intro con la foto, título, portal, juego, HUD, bonificación, tienda, arena infinita, game over, final y el bucle principal. |
| `assets/` | `sheet.png` (sprites), `bg.jpg` (salón arcade), `photo.jpg` (fotograma real). |
| `tools/build_single.py` | Empaqueta todo en `dist/malanito_destructor.html`, un solo archivo con las imágenes embebidas. |

## Controles

| Acción | Táctil | Teclado |
|---|---|---|
| Moverse / agacharse | Cruceta izquierda | Flechas o WASD |
| Salto (doble con Zapatillas) | Botón azul | X, K o Espacio |
| Disparo / mantener = Rayo Calavera | Botón rosa | Z o J |
| Patada Súper Extrema (medidor lleno) | Botón dorado | C o L |
| Comer hamburguesa | Botón bajo la vida | E o Q |
| Pausa | Tres dedos | P o Esc |

## Dónde tocar cada cosa

- **Dificultad**: vida inicial y velocidad en `newPlayer()` y `movePlayer()` (`entities.js`); vida y ritmo de jefes en los constructores de `BossMicroondas`, `BossZepelin` y `BossNucleo` (`levels.js`); escala de la arena en `updateArena()` (`game.js`).
- **Niveles**: `buildLevel1/2/3()` en `levels.js`. `ground()` crea suelo, `plat()` plataformas delgadas, `spawnEnemy()` enemigos, `coinLine()/coinArc()` monedas.
- **Nuevos sprites**: agrega el PNG a `assets/sheet.png`, anota su rectángulo en `ATLAS` (`assets.js`) y dibújalo con `spr('nombre', x, y, alto, 'feet' | 'center' | 'tl', volteado)`.
- **Precios de la tienda**: `shopItems()` en `game.js`.
- **Música**: patrones en `Audio.pat` (`core.js`), notas MIDI por semicorchea.

## Pendientes conocidos

- Enemigos comunes, Horno Microondas y Zepelín siguen dibujados por código (no hay material de ellos en el video).
- Cinturón de Gravedad Inversa, multijugador y ranking en línea no están implementados; el guardado es local (`localStorage`).
