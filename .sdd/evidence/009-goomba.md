# Evidence: Goomba

## Source records
- Spec: `.sdd/specs/009-goomba.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/009-goomba.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| El Goomba camina solo y reproduce `goomba_walk` a 8 fps | Logs de dirección y capturas | Patrulla y animación | `[goomba] direction left` al crear cada Goomba; la animación `goomba_walk` (8 fps, frames `18–20`) se crea en `Boot` | `src/game/constants/assets.js`, `.sdd/evidence/009-stomp.png` | No hay video; la animación no se inspeccionó frame por frame |
| Al chocar contra una pared o bloque cambia de dirección | Goomba en `x = 1000` contra el bloque lateral en `x = 950` | Inversión de dirección | `[goomba] direction right` y luego `[goomba] direction left` al tocar el borde del mundo | Log de consola de la corrida | Solo se probó con el bloque lateral y el borde del mundo |
| Tocar al Goomba de costado aplica daño a Mario | Caminar contra el Goomba de `x = 350` | Pérdida de vida | `[game] vida perdida · vidas restantes: 2`; respawn con `LIVES 02` | `.sdd/evidence/009-dano.png` | Mario era Small; no se probó el daño con Super |
| Caer sobre la cabeza lo aplasta: `scaleY 0.3` durante 100 ms y luego desaparece | Goomba bajo el spawn; caída inicial | Squash y destrucción | `[goomba] squashed` y `[goomba] stomped`; en la captura se ve el Goomba aplastado bajo Mario | `.sdd/evidence/009-stomp.png` | La ventana de 100 ms no se capturó completa; se verificó por constante y destrucción |
| Mario rebota hacia arriba al aplastarlo | Captura inmediatamente después del squash | Mario en el aire | `009-stomp.png` muestra a Mario elevado sobre el Goomba aplastado | `.sdd/evidence/009-stomp.png` | El valor `-300` se verificó por código |
| Durante el aplastamiento el Goomba no vuelve a dañar | HUD tras el squash | `LIVES 03` | `009-stomp.png` muestra `LIVES 03` y `MARIO 000000` | `.sdd/evidence/009-stomp.png` | — |
| La hitbox es `16 × 14` con origen `(0.5, 1)` | Constantes y construcción del body | `16 × 14`, origen inferior | `CHARACTERS.GOOMBA` define hitbox `16 × 14`, origen `(0.5, 1)`; el body usa `setSize(16, 14)` y offset alineado a los pies | `src/game/constants/assets.js`, `src/game/entities/Goomba.js` | No se midió en runtime |
| `npm run build` termina sin errores | `npm run build` | Exit 0 | `build exit: 0`; solo advertencia preexistente de chunk > 500 kB | Salida de `npm run build` | — |

## Result and follow-up

Resultado: spec 009 implementada y verificada. `Goomba` patrulla a `35 px/s`, invierte la dirección al chocar lateralmente, cae con gravedad, se aplasta con `scaleY 0.3` durante `100 ms` y se destruye. El contacto lateral aplica daño; el aterrizaje sobre la cabeza aplasta y rebota a Mario con `-300 px/s`.

Decisiones tomadas:
- El Goomba arranca hacia la izquierda en el escenario de prueba.
- El aplastamiento deshabilita el body y no vuelve a dañar.
- El escenario de prueba tiene tres Goombas: spawn (stomp), patrulla (daño lateral) y bloque lateral (giro).
- El bloque lateral se movió a `x = 950` para liberar el corredor.

Limitaciones:
- No hubo playtest manual ni video.
- No se probó el daño al Goomba con Super Mario ni la caída a un pozo.
- La animación `goomba_walk` no se inspeccionó frame por frame.
- La hitbox se verificó por código, no en runtime.
- El Goomba bajo el spawn es andamiaje de prueba; `012` define las posiciones reales.

Seguimiento:
- `010` agrega Piranha Plant y reutiliza el daño de Mario.
- `012` define posiciones y cantidades de Goombas.
