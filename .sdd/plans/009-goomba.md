# Plan: Goomba

## Source spec
- Path: `.sdd/specs/009-goomba.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `CHARACTERS.GOOMBA` ya usa `crawler_blue` frames `[18, 19, 20]`, origen `(0.5, 1)` y hitbox `16 × 14`.
- `Boot` crea todas las animaciones declaradas en `ANIMATIONS`; falta `goomba_walk`.
- `Mario` expone `takeDamage()` y su lógica de vida/respawn.
- `Game` tiene suelo, bloques, monedas, hongos y un bloque lateral en `x = 720`.
- No existen enemigos.

## Proposed steps
1. Agregar `ANIMATIONS.GOOMBA_WALK` (8 fps, loop) en `src/game/constants/assets.js`.
   Criteria covered: animación de patrulla.
2. Crear `src/game/constants/goombas.js` con velocidad `35`, rebote `-300`, squash `0.3` / `100 ms` y umbral de pozo.
   Criteria covered: tuning centralizado.
3. Crear `src/game/entities/Goomba.js`: body `16 × 14`, patrulla, giro en paredes, gravedad, squash y destrucción.
   Criteria covered: patrulla, giro, aplastamiento y limpieza.
4. Agregar `Mario.bounce()` para aplicar el impulso del rebote.
   Criteria covered: rebote al aplastar.
5. Integrar en `Game`: tres Goombas de prueba, colliders con sólidos/bloques, overlap con detección de aplastamiento lateral vs. aterrizaje, y update por frame.
   Criteria covered: daño lateral, aplastamiento y rebote.
6. Mover el bloque lateral a `x = 950` para dejar libre el corredor de los Goombas y probar el giro.
   Criteria covered: giro contra bloque.
7. Verificar con build y corrida CDP: aplastamiento al spawn, daño lateral, giro y HUD sin puntos.
   Criteria covered: todos los criterios observables.

## Files and symbols

- `src/game/constants/assets.js`: `ANIMATIONS.GOOMBA_WALK`
- `src/game/constants/goombas.js` (nuevo): `GOOMBA`
- `src/game/entities/Goomba.js` (nuevo): `Goomba`, `squash`, `update`, `#setDirection`
- `src/game/entities/Mario.js`: `bounce`
- `src/game/scenes/Game.js`: `#createGoombas`, overlap y update de enemigos
- `.sdd/evidence/009-*`

## Verification

- `npm run build` sin errores.
- Chrome headless/CDP:
  - `[goomba] squashed` al spawn, sin pérdida de vida;
  - HUD con `LIVES 03` y `MARIO 000000` tras el aplastamiento;
  - `[goomba] direction right` del goomba contra el bloque lateral;
  - caminar contra el goomba de patrulla: `[game] vida perdida` y respawn;
  - capturas del squash y del respawn.
- Consola sin errores.

## Stopping conditions

- El aplastamiento se confunde con daño lateral.
- El Goomba no gira o atraviesa el bloque.
- El squash sigue dañando a Mario.
- Aparece necesidad de Piranha Plant o layout real (fuera de alcance).
