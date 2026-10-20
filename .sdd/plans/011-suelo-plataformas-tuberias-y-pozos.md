# Plan: Suelo, plataformas, tuberías y pozos

## Source spec
- Path: `.sdd/specs/011-suelo-plataformas-tuberias-y-pozos.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `TILE_SEQUENCES` ya contiene `GRASS_GROUND`, `DIRT_GROUND`, `WOOD_PLATFORM` y `RED_PLATFORM`; `TILES` contiene `PIPE_TOP` y `PIPE_BODY`.
- `Game` construye suelo, bloques, monedas, hongos, Goombas y Piranha de forma dispersa.
- `Mario.die()` y el manejo de vida/respawn existen.
- No hay un módulo de entorno ni datos declarativos de nivel.
- Decisión: escenario de prueba 1024 × 768 con umbral de muerte 750; 012 define el nivel definitivo.

## Proposed steps
1. Crear `src/game/level/testEnvironment.js` con los datos de suelo, plataformas, tubería y umbral de muerte.
   Criteria covered: API declarativa.
2. Crear `src/game/level/Environment.js` con `buildEnvironment`, `#buildGround`, `#buildPlatform` y `#buildPipe`.
   Criteria covered: suelo, plataformas, tuberías y pozos como ausencia de suelo.
3. Usar cuerpos estáticos continuos por tramo para evitar costuras y colisiones entre tiles.
   Criteria covered: suelo sin huecos y superficies pisables.
4. Simplificar el escenario de prueba de `Game` al entorno + Mario + HUD, manteniendo el código de entidades para `012`.
   Criteria covered: entorno observable sin interferencias.
5. Reincorporar la muerte por caída usando `deathY` de los datos.
   Criteria covered: caída en pozo con pérdida de vida.
6. Verificar con build y corrida CDP: suelo, plataforma de madera, plataforma roja, tubería y pozo.
   Criteria covered: todos los criterios observables.

## Files and symbols

- `src/game/level/testEnvironment.js` (nuevo): `TEST_ENVIRONMENT`
- `src/game/level/Environment.js` (nuevo): `buildEnvironment`
- `src/game/scenes/Game.js`: entorno declarativo, muerte por caída, sin entidades de prueba
- `.sdd/evidence/011-*`

## Verification

- `npm run build` sin errores.
- Chrome headless/CDP:
  - captura del tramo inicial con suelo, plataformas y tubería;
  - salto y apoyo sobre la plataforma de madera;
  - salto y apoyo sobre la tubería;
  - salto y apoyo sobre la plataforma roja;
  - caída al pozo → `[game] vida perdida` y respawn.
- Consola sin errores.

## Stopping conditions

- El suelo presenta huecos o Mario se hunde.
- Las plataformas o la tubería no son sólidas/pisables.
- El pozo no dispara la pérdida de vida.
- Aparece necesidad de cámara, layout o decoración (fuera de alcance).
