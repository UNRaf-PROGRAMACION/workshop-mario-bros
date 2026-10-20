# SPEC: Goal Pole y fin de nivel

## Problem and player or user value

La meta da sentido al recorrido: sin ella el nivel no tiene final ni recompensa. Es el cierre del lazo de juego y el punto donde el jugador decide volver al menú.

## Current and expected behavior

**Actual**
- El poste y la bandera ya se dibujan al final del nivel (`012`), pero no tienen overlap ni condición de victoria.

**Esperado**
- Al final del nivel hay un poste armado con los tiles `32`, `52` y `72`, y una bandera con el tile `85`.
- Cuando Mario toca la bandera:
  - Mario deja de moverse.
  - El nivel termina.
  - Aparece el mensaje «¡Nivel completado!».
  - El jugador puede volver al menú principal.
- El nivel no continúa después de la meta.

## Related GDD or design reference

- §2.5. Poste de meta y bandera
- §2.6. Bandera / Goal Pole (sin asset propio)
- §7.4. Meta con bandera
- §11.3. Nivel — World 1-1
- §12. Recorrido del juego (paso 10)

## Scope

- Construcción visual del poste y la bandera con los tiles indicados.
- Zona de disparo por overlap con Mario.
- Congelamiento de entrada, física y avance de Mario al activarse.
- Overlay con el mensaje de nivel completado.
- Botón o acción para volver al Main Menu.
- Disparo único, sin repetirse.

## Non-scope

- Puntaje por tiempo restante, altura del salto o bandera: el GDD no lo define.
- Progresión a otro nivel.
- Game Over (`015`).
- Animación de Mario bajando por el poste.

## Constraints and assumptions

- Tocar cualquier parte del poste o de la bandera dispara el final.
- El mensaje aparece de inmediato, sin animación de bajada por el poste.
- El mensaje usa texto de Phaser; no hay letras en la hoja.
- El overlay pausa la física; el retorno al menú es una acción explícita del jugador, no automática.
- El botón de retorno responde a mouse y a teclado, igual que el menú (`002`).

## Acceptance criteria

- [x] El poste y la bandera se ven al final del nivel con los tiles `32`, `52`, `72` y `85`.
- [x] Tocar la meta detiene a Mario y bloquea el input de juego.
- [x] Aparece el mensaje «¡Nivel completado!».
- [x] La activación ocurre una sola vez aunque Mario siga en contacto.
- [x] El botón de retorno lleva al Main Menu.
- [x] Después de completar el nivel no se puede seguir avanzando ni sufrir daño.
- [x] `npm run build` termina sin errores.

## Evidence expected

- Captura de la meta armada.
- Video de la llegada, congelamiento y mensaje.
- Captura del retorno al menú.

## Open questions

- Resuelto: escena transparente `LevelComplete` sobre el nivel pausado, con cámara propia sin zoom, igual que el HUD.

## Human approval

- Status: approved
- Approved by: aguss (confirmación «continaur» al consultar el alcance)
- Date: 2026-10-19

## Related records

- Plan: `.sdd/plans/014-meta-y-fin-de-nivel.md`.
- Evidence: `.sdd/evidence/014-meta-y-fin-de-nivel.md` (verificación automatizada; revisión humana pendiente).
