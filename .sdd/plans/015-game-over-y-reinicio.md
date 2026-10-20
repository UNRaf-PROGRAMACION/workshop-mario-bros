# Plan: Game Over y reinicio de partida

## Source spec
- Path: `.sdd/specs/015-game-over-y-reinicio.md`.
- Approval status: approved, aguss, 2026-10-19.

## Repository evidence
- `Game.#handleMarioDamaged` descuenta vidas, protege contra doble muerte y emite `GAME_OVER_EVENT` a cero; actualmente solo pausa Game.
- `Game` detiene Hud en shutdown. `Mario.freeze()` detiene física y animación.
- `MainMenu.#startGame()` llama a `GameState.reset()`. Cada `Game.create()` crea Mario Small y usa el spawn del nivel, excepto el startX exclusivo de desarrollo.
- `LevelComplete` ya tiene mensaje y retorno mediante clic/Enter/Espacio. Es el segundo uso concreto del mismo ciclo de pantalla final.
- Phaser 4/JavaScript ES Modules; clases PascalCase con campos privados y comentarios en español. Build disponible: `npm run build`; sin tests/lint configurados.
- CodeGraph no está indexado; su herramienta indicó previamente usar lectura directa en esta sesión.

## Proposed steps
1. Extraer el ciclo compartido de LevelComplete a `ResultScreen` (Template Method simple): mensaje, fondo y retorno. Conservar overlay de victoria y bloquear repetición de teclas.
   Criteria covered: interfaz consistente y retorno accesible por mouse/teclado; regresión 014.
2. Crear `GameOver` con fondo opaco, texto GAME OVER y botón, sin puntaje ni nivel jugable; registrarlo en main.
   Criteria covered: pantalla sin contenido jugable ni puntaje final.
3. A cero vidas congelar Mario y física, conservar emisión del evento e iniciar GameOver deteniendo Game/Hud. Mantener respawn normal cuando quedan vidas.
   Criteria covered: aparición inmediata y corte limpio, sin cambiar las reglas de pérdida de vida.
4. Verificar ciclo con tres vidas, input posterior, retornos por mouse/teclado, nuevo estado inicial y Small Mario en spawn normal; repetir victoria por el código compartido.
   Criteria covered: criterios de 015 y regresión acotada de 014.

## Files and symbols
- `src/game/scenes/ResultScreen.js`: base compartida de pantallas finales.
- `src/game/scenes/LevelComplete.js`: especialización conservando overlay.
- `src/game/scenes/GameOver.js`: especialización opaca.
- `src/game/scenes/Game.js`: transición a GameOver en `#handleMarioDamaged`.
- `src/game/main.js`: registro de GameOver.
- `.sdd/evidence/015-game-over-y-reinicio.md`: tabla de resultados, capturas, video y logs.

## Verification
- `npm run build` y `git diff --check`.
- Chrome/CDP sin dependencias nuevas: entrar desde menú sin startX; agotar las tres vidas y verificar HUD 02/01/00, GameOver activo y Game/Hud detenidos; input no altera estado.
- Fixture dirigido para monedas y forma Super antes del último pozo: nueva partida debe restaurar 3/0/0 y Small en `(54,210)` al crear; al asentarse, pies en el suelo y x=54.
- Video del ciclo y capturas; diferenciar fixtures dirigidos de gameplay natural. Prueba de victoria tras extraer la interfaz compartida.
- Si no se realiza playtest humano o recorrido continuo, declararlo pendiente.

## Stopping conditions
- Divergencia con GDD, nuevos assets/dependencias, cambios a reglas de daño o expansión de las pantallas a un framework.
- Imposibilidad de verificar reinicio sin startX, escenas activas indebidamente o regresión en el retorno de victoria.
