# Plan: Super Mushroom

## Source spec
- Path: `.sdd/specs/008-super-mushroom.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `QuestionBlock` ya invoca `onRelease(x, y)` al golpearse (`006`).
- `Game` crea actualmente un hongo estático de prueba con overlap; hay que reemplazarlo.
- `Mario.grow()` implementa la transformación (`005`).
- `TILES.SUPER_MUSHROOM` (`128`) y `MARIO_MOVEMENT.GRAVITY_FALLING` ya existen.
- No existe entidad hongo con emersión, movimiento ni giro en paredes.

## Proposed steps
1. Crear `src/game/constants/mushrooms.js` con velocidad `60 px/s`, emersión `18 px` / `300 ms` y hitbox `16 × 16`.
   Criteria covered: tuning centralizado.
2. Crear `src/game/entities/Mushroom.js`: emersión con tween y body deshabilitado, gravedad, movimiento horizontal, giro al chocar y desaparición en pozo.
   Criteria covered: aparición, recorrido, caída, giro y limpieza.
3. Cambiar `QuestionBlock` para entregar el centro del bloque y que `Game` cree el hongo sobre él.
   Criteria covered: spawn desde ? Block.
4. Conectar colisiones con suelo/bloques, overlap con Mario, `grow()` y logs de emersión/giro/recogida.
   Criteria covered: recogida con Small y Super.
5. Agregar un segundo ? Block al escenario de prueba para probar la recogida con Super.
   Criteria covered: no duplicar estado.
6. Verificar con build y corrida CDP: emersión, giro en pared, recogida Small→Super y recogida con Super sin cambios.
   Criteria covered: todos los criterios observables.

## Files and symbols

- `src/game/constants/mushrooms.js` (nuevo): `MUSHROOM`
- `src/game/entities/Mushroom.js` (nuevo): `Mushroom`, `collect`, `MUSHROOM_COLLECTED_EVENT`, `#setDirection`
- `src/game/entities/blocks/QuestionBlock.js`: `onRelease` con centro del bloque
- `src/game/scenes/Game.js`: `#createMushroom`, update de hongos, segundo ? Block
- `.sdd/evidence/008-*`

## Verification

- `npm run build` sin errores.
- Chrome headless/CDP:
  - golpear el primer ? Block y capturar la emersión;
  - esperar el giro contra el bloque lateral;
  - dejar que vuelva y recogerlo: `[mario] state super`;
  - golpear el segundo ? Block y recoger con Super: `[mushroom] collected` sin nuevo `state super`;
  - capturas antes/después.
- Consola sin errores.

## Stopping conditions

- El hongo queda superpuesto al bloque o no emerge.
- El hongo atraviesa paredes o no invierte la dirección.
- La recogida con Super dispara una transformación o duplica estado.
- Aparece necesidad de enemigos o layout real (fuera de alcance).
