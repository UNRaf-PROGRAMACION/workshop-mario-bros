# Evidence: Nivel World 1-1

## Source records
- Spec: `.sdd/specs/012-nivel-world-1-1.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/012-nivel-world-1-1.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| El nivel se recorre de principio a fin y termina en el Goal Pole | Bot de recorrido con salto continuo; secciones con `?startX=` | Recorrido completo | **No verificado**: el bot muere en el primer Goomba y no completa el nivel; las secciones y la meta se capturaron por separado | `012-inicio.png`, `012-meta.png` | **Criterio pendiente de playtest humano**; el recorrido completo no se automatizó |
| Aparecen ground, platforms, hard block, brick block, ? block, coin, Goomba, pipe, Piranha Plant, pit y Goal Pole | Capturas por secciones | Todos presentes | `012-inicio.png` (ground, coins, ? block, brick, hard, cloud), `012-tuberia.png` (pipe + Piranha), `012-tramo-medio.png` (red platform, Goomba, pipe), `012-meta.png` (Goal Pole, wood platform, ? block), `012-pozo.png` (pit, Goomba) | `.sdd/evidence/012-*.png` | No todos los elementos coexisten en una sola captura |
| El jugador puede obtener un Super Mushroom en el nivel | Golpear un ? Block; captura del hongo liberado | Hongo disponible | En `012-tramo-1.png` se ve un hongo sobre el ? Block tras el golpe | `.sdd/evidence/012-tramo-1.png` | No se recogió en esta corrida; la recogida está verificada en `008` |
| La cámara sigue a Mario y no muestra área fuera de los límites del nivel | Capturas con distintas posiciones y `startX` | Cámara dentro de límites | Las capturas muestran tramos distintos; `setBounds(0,0,3780,288)` y `zoom 3`; en la meta la cámara queda limitada al borde derecho | `012-tuberia.png`, `012-tramo-medio.png`, `012-meta.png` | La cámara no se comparó píxel por píxel contra los límites |
| La zona inicial permite caminar, saltar y recoger monedas sin obstáculos letales | `012-inicio.png` | Zona segura | El primer Goomba está en la columna `22`; antes solo hay monedas y bloques | `.sdd/evidence/012-inicio.png` | El primer Goomba está relativamente cerca del inicio |
| Al perder una vida, Mario reaparece en el punto de inicio del nivel | Caer al pozo desde `startX=1180` | Respawn | `[game] vida perdida · vidas restantes: 2`; Mario reaparece en el inicio del tramo | `.sdd/evidence/012-pozo.png` | No se probó la pérdida desde el inicio real del nivel |
| No hay elementos flotantes sin soporte ni huecos accidentales en el suelo | Revisión del layout y capturas | Sin huecos accidentales | Pozos solo en `68–70`, `116–118` y `164–166`; plataformas y bloques tienen posición declarada | `src/game/level/world11.js`, capturas | No se recorrió el nivel completo para inspeccionar cada tramo |
| `npm run build` termina sin errores | `npm run build` | Exit 0 | `build exit: 0`; solo advertencia preexistente de chunk > 500 kB | Salida de `npm run build` | — |

## Result and follow-up

Resultado: spec 012 implementada. World 1-1 se define en `WORLD_1_1` con 210 × 16 tiles: 4 tramos de suelo con 3 pozos de 2 tiles, 5 plataformas, 4 tuberías (3 con Piranha), 11 bloques, 27 monedas, 7 Goombas, nubes y un Goal Pole visual. La cámara usa zoom `3`, lerp `0.1` y límites del nivel.

Decisiones tomadas:
- El Goal Pole es solo visual; la finalización corresponde a `014`.
- No se dibuja HUD para evitar conflictos con el zoom; `013` lo implementa.
- Se agregó un parámetro de desarrollo `?startX=` (solo en `import.meta.env.DEV`) para inspeccionar tramos; el build de producción usa el inicio normal.
- Los pozos miden 2 tiles (`36 px`), superables con el salto de ≈66 px.

Limitaciones:
- **El recorrido completo de principio a fin no se verificó**. El bot automático muere en el primer Goomba y no es un jugador real.
- Las capturas de secciones usan el parámetro de desarrollo, no un recorrido continuo.
- No se probó la recogida del hongo en esta corrida ni la interacción con la meta.
- No se verificó cada tramo en busca de huecos accidentales.
- Sin HUD, los valores de vidas/puntaje solo se ven en logs.

Seguimiento:
- `013` implementa el HUD con cámara y zoom.
- `014` implementa la interacción con el Goal Pole y el fin de nivel.
- `015` implementa Game Over y reinicio de partida.
- El recorrido completo requiere playtest humano.
