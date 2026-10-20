# Evidence: Puntaje, vidas y HUD

## Source records
- Spec: `.sdd/specs/013-puntaje-vidas-y-hud.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/013-puntaje-vidas-y-hud.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| El HUD es visible desde el inicio del nivel y no se desplaza con la cámara | Capturas al inicio y con cámara en la meta | HUD fijo | `013-hud-inicial.png` y `013-hud-meta.png` muestran el HUD en la misma posición; el HUD es una escena con cámara sin zoom | `.sdd/evidence/013-hud-inicial.png`, `.sdd/evidence/013-hud-meta.png` | — |
| Muestra `MARIO`, `SCORE`, `COINS`, `LIVES` y `WORLD` con el formato de referencia | Inspección de la captura | Formato del GDD | `MARIO 000000 \| COINS 00 \| LIVES 03 \| WORLD 1-1` (el puntaje va tras `MARIO`, como en el ejemplo de §9) | `.sdd/evidence/013-hud-inicial.png` | No aparece la palabra literal `SCORE`; el GDD usa `MARIO` + dígitos |
| Recoger una moneda actualiza COINS en +1 y SCORE en +100 | Saltar sobre las primeras monedas | `COINS 03`, `SCORE 000300` | Logs `coins 1/2/3` y `score 100/200/300`; HUD muestra `000300` y `03` | `.sdd/evidence/013-hud-moneda.png` | — |
| Perder una vida actualiza LIVES en −1 | Caminar contra el primer Goomba | `LIVES 02` | HUD muestra `LIVES 02` tras el respawn; log `vidas restantes: 2` | `.sdd/evidence/013-hud-vida.png` | — |
| El HUD inicia en 3 vidas, 0 monedas y 0 puntos al comenzar una partida | Captura inicial | `000000 / 00 / 03` | `013-hud-inicial.png` muestra `MARIO 000000`, `COINS 00`, `LIVES 03` | `.sdd/evidence/013-hud-inicial.png` | — |
| Una partida nueva reinicia los contadores a cero | `GameState.reset()` + `MainMenu.#startGame()`; recarga de la app | Contadores en cero | `reset()` vuelve a `3/0/0/1-1`; `MainMenu` lo invoca al iniciar una partida; la recarga muestra el estado inicial | `src/game/state/GameState.js`, `src/game/scenes/MainMenu.js`, `.sdd/evidence/013-hud-inicial.png` | No hay flujo de vuelta al menú hasta `015`; no se probó un reinicio en caliente |
| Las cifras se dibujan con los tiles `160–169` y las palabras con texto | Revisión de `Hud.js` y captura | Dígitos del tileset y labels de texto | `Hud` crea imágenes con `TILE_SEQUENCES.HUD_DIGITS_SMALL` (frames `160–169`) y labels con `Text` | `src/game/scenes/Hud.js`, `.sdd/evidence/013-hud-inicial.png` | Los dígitos se ven espaciados por la celda de `18 px`; no se comparó con el ejemplo del GDD píxel por píxel |
| `npm run build` termina sin errores | `npm run build` | Exit 0 | `build exit: 0`; solo advertencia preexistente de chunk > 500 kB | Salida de `npm run build` | — |

## Result and follow-up

Resultado: spec 013 implementada. El HUD vive en una escena `Hud` independiente con su propia cámara sin zoom, de modo que el `zoom 3` del nivel no lo afecta. Se suscribe a `STATE_CHANGED_EVENT` del registry y dibuja `MARIO` + score de 6 dígitos, `COINS` y `LIVES` de 2 dígitos con los tiles `160–169`, y `WORLD 1-1` como texto.

Decisiones tomadas:
- El HUD es una escena separada (`Hud`) lanzada por `Game` y detenida en su shutdown.
- `GameState.reset()` reinicia contadores; `MainMenu` lo invoca al iniciar una partida.
- Los cambios de estado se emiten por `registry.events` como `STATE_CHANGED_EVENT` (Observer).
- El puntaje se muestra tras `MARIO`, siguiendo el ejemplo de §9.

Limitaciones:
- No hay flujo de vuelta al menú hasta `015`; el reinicio en caliente no se probó.
- Los dígitos se ven espaciados por la celda de `18 px`; no se compararon píxel por píxel con el GDD.
- No hubo playtest manual.

Seguimiento:
- `015` debe detener el HUD al volver al menú y reiniciar los contadores de una partida nueva.
- `014` no modifica el HUD.
