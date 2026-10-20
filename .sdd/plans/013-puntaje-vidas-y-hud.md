# Plan: Puntaje, vidas y HUD

## Source spec
- Path: `.sdd/specs/013-puntaje-vidas-y-hud.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `GameState` ya guarda `score`, `coins`, `lives` y `world`; `addCoin()` y `loseLife()` los mutan.
- `Game` actualiza el estado y registra logs, pero no dibuja HUD.
- `TILE_SEQUENCES.HUD_DIGITS_SMALL` contiene los frames `160–169`.
- El nivel usa cámara con `zoom 3`; un HUD en la misma escena se vería afectado.
- `MainMenu` inicia una partida sin reiniciar explícitamente los contadores.

## Proposed steps
1. Agregar `reset()` a `GameState` y `STATE_CHANGED_EVENT`.
   Criteria covered: reinicio de contadores y Observer.
2. Crear la escena `Hud` con cámara propia sin zoom, labels de texto y dígitos `160–169`.
   Criteria covered: HUD fijo y formato.
3. Suscribir `Hud` a `STATE_CHANGED_EVENT` y renderizar score/coins/lives.
   Criteria covered: actualización por moneda y vida.
4. Lanzar `Hud` desde `Game` y detenerlo en su shutdown.
   Criteria covered: HUD visible solo durante el nivel.
5. Emitir `STATE_CHANGED_EVENT` al recoger monedas y perder vidas.
   Criteria covered: actualización de valores.
6. Llamar `GameState.reset()` desde `MainMenu` al iniciar una partida.
   Criteria covered: contadores en cero en partida nueva.
7. Verificar con build y capturas: inicial, tras monedas, tras vida y con cámara en la meta.
   Criteria covered: todos los criterios observables.

## Files and symbols

- `src/game/state/GameState.js`: `STATE_CHANGED_EVENT`, `reset`
- `src/game/scenes/Hud.js` (nuevo): `Hud`, `#render`, `#createDigits`
- `src/game/scenes/Game.js`: emisión de estado y lanzamiento del HUD
- `src/game/scenes/MainMenu.js`: reinicio de contadores
- `src/game/main.js`: registro de `Hud`
- `.sdd/evidence/013-*`

## Verification

- `npm run build` sin errores.
- Chrome headless/CDP:
  - HUD inicial `000000 / 00 / 03`;
  - tras monedas `000300 / 03`;
  - tras perder una vida `LIVES 02`;
  - HUD en la misma posición con la cámara en la meta.
- Consola sin errores.

## Stopping conditions

- El HUD se mueve con la cámara o lo afecta el zoom.
- Los dígitos no usan los frames `160–169`.
- Los contadores no se actualizan o no se reinician.
- Aparece necesidad de Game Over o fin de nivel (fuera de alcance).
