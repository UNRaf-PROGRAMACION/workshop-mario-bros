# SPEC: Game Over y reinicio de partida

## Problem and player or user value

El Game Over cierra la partida cuando se agotan las vidas y devuelve al jugador a un estado inicial limpio. Sin él, perder todas las vidas dejaría el juego en un estado inconsistente.

## Current and expected behavior

**Actual**
- Ya existen vidas y reinicio de contadores al comenzar una partida. Al llegar a cero se emite `game-over` y se pausa Game, pero falta la pantalla de retorno.

**Esperado**
- Cuando Mario pierde todas las vidas, aparece la pantalla Game Over.
- La pantalla muestra el texto «GAME OVER» y un botón para regresar al menú principal.
- Al comenzar una nueva partida, Mario vuelve a tener 3 vidas y los contadores comienzan desde cero.
- Mario comienza como Small Mario.

## Related GDD or design reference

- §8.2. Vidas
- §11.4. Game Over
- §12. Recorrido del juego (paso 9)
- §9. HUD (contadores)

## Scope

- Detección de `lives == 0` y transición a Game Over.
- Escena o overlay Game Over con texto y botón de retorno.
- Reset completo del estado de partida al iniciar una nueva: vidas 3, monedas 0, puntaje 0, Mario Small.
- Corte limpio de la simulación del nivel.

## Non-scope

- Lógica de pérdida de vida (`005`).
- HUD (`013`).
- Continuaciones, puntajes altos o guardado.
- Mundo posterior a `1-1`.

## Constraints and assumptions

- Game Over se dispara inmediatamente después de agotar la última vida, sin pantalla intermedia.
- Volver al menú no conserva ningún progreso.
- No se muestra el puntaje final.
- `GAME OVER` se dibuja con texto de Phaser; la escena no tiene contenido jugable.
- El botón de retorno responde a mouse y a teclado, igual que el menú (`002`).

## Acceptance criteria

- [x] Al perder la última vida aparece la pantalla Game Over.
- [x] La pantalla muestra «GAME OVER» y un botón para volver al menú.
- [x] Mientras se muestra Game Over no se puede seguir jugando el nivel.
- [x] Al volver al menú y comenzar una nueva partida, las vidas son 3, las monedas 0 y el puntaje 0.
- [x] La nueva partida comienza con Small Mario en el inicio del nivel.
- [x] El flujo completo menú → nivel → Game Over → menú → nivel funciona sin errores.
- [x] `npm run build` termina sin errores.

## Evidence expected

- Video del flujo completo con las 3 vidas agotadas.
- Captura del Game Over.
- Captura del HUD reiniciado en la nueva partida.

## Open questions

- Resuelto: el botón vuelve al menú, de acuerdo con §11.4. Una nueva partida se inicia explícitamente desde Jugar.

## Human approval

- Status: approved
- Approved by: aguss (confirmación «continuar» al consultar el alcance)
- Date: 2026-10-19

## Related records

- Plan: `.sdd/plans/015-game-over-y-reinicio.md`.
- Evidence: `.sdd/evidence/015-game-over-y-reinicio.md` (verificación automatizada; revisión humana pendiente).
