# Plan: Nivel World 1-1

## Source spec
- Path: `.sdd/specs/012-nivel-world-1-1.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `buildEnvironment` construye suelo, plataformas y tuberías desde datos.
- `Mario`, `Coin`, `Mushroom`, `Goomba`, `PiranhaPlant`, `createBlock` y `GameState` existen.
- `Game` actual usa el escenario de prueba 011 sin cámara ni HUD.
- `012` define un nivel de 210 × 16 tiles (`3780 × 288`), cámara con zoom 3 y lerp 0.1.
- El Goal Pole es visual; la finalización es `014`.

## Proposed steps
1. Crear `src/game/level/world11.js` con el layout declarativo completo.
   Criteria covered: datos del nivel y posiciones.
2. Extender `Environment` para devolver las tuberías construidas y permitir plantas asociadas.
   Criteria covered: tuberías con Piranha.
3. Reescribir `Game` para construir el nivel completo e integrar bloques, monedas, hongos, Goombas, plantas, nubes y Goal Pole.
   Criteria covered: presencia de todos los elementos.
4. Configurar cámara con `zoom 3`, `lerp 0.1` y límites del nivel; ajustar los límites físicos para permitir la caída.
   Criteria covered: seguimiento y límites.
5. Mantener el respawn al inicio y la pérdida de vida por caída.
   Criteria covered: reinicio tras muerte.
6. Verificar con build y corrida CDP: inicio, tramos con cámara, tubería con planta, meta y HUD por logs.
   Criteria covered: todos los criterios observables.

## Files and symbols

- `src/game/level/world11.js` (nuevo): `WORLD_1_1`
- `src/game/level/Environment.js`: retorno `{ solids, pipes }`
- `src/game/scenes/Game.js`: integración del nivel, cámara, entidades y meta
- `.sdd/evidence/012-*`

## Verification

- `npm run build` sin errores.
- Chrome headless/CDP:
  - captura del inicio con cámara zoom 3;
  - captura de un tramo intermedio (cámara sigue a Mario);
  - captura de tubería con Piranha;
  - captura de la meta;
  - log de vida perdida al caer en un pozo y respawn.
- Consola sin errores.

## Stopping conditions

- La cámara deja ver fuera del nivel.
- Faltan elementos del layout.
- El nivel no es recorrible por pozos o tuberías mal ubicados.
- Aparece necesidad de HUD o finalización (fuera de alcance).
