# Evidence: Piranha Plant

## Source records
- Spec: `.sdd/specs/010-piranha-plant.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/010-piranha-plant.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Las texturas `piranha_open` y `piranha_closed` se generan en runtime con tamaño `20 × 34` y los colores indicados | Logs de `createPiranhaTextures()` al iniciar la app | Dos texturas `20 × 34` | `[piranha] texture piranha_open 20×34` y `[piranha] texture piranha_closed 20×34` | Log de consola; `src/game/textures/piranha.js` | Los colores se verificaron por código, no píxel por píxel |
| La planta sube, permanece afuera, baja y se oculta respetando 1.2 / 2.0 / 1.2 / 2.0 s | Medición de timestamps de los logs del ciclo | `1200 / 2000 / 1200 / 2000 ms` | `hidden→rise 1990`, `rise→out 1217`, `out→hide 2015`, `hide→hidden 1201` | Logs de consola de la corrida | Diferencias de hasta 17 ms por frame/timer; aceptables |
| El recorrido vertical es de 26 px | Constante `PIRANHA.TRAVEL` y posición oculta/fuera | `26 px` | La planta aparece `26 px` por encima de la posición oculta | `src/game/constants/piranha.js`, `010-planta-fuera.png`, `010-planta-oculta.png` | No se midió en píxeles sobre la captura |
| Mientras está afuera alterna los dos frames a 4 fps | Evento de `250 ms` que alterna texturas; capturas separadas 260 ms | Alternancia open/closed | El código alterna `piranha_open`/`piranha_closed` cada `250 ms`; `010-planta-frame.png` es la captura siguiente a `010-planta-fuera.png` | `src/game/entities/PiranhaPlant.js`, capturas | La diferencia de boca no se distingue con claridad a simple vista en la captura |
| La tubería tapa a la planta cuando está oculta | Captura durante la fase `hidden` | Solo se ve la tubería | `010-planta-oculta.png` no muestra la planta; el pipe tiene `depth 10` y la planta `depth 9` | `.sdd/evidence/010-planta-oculta.png` | — |
| Tocar la planta por cualquier lado, incluido desde arriba, aplica daño | Saltar sobre la tubería mientras la planta sube | Pérdida de vida, sin squash | `[piranha] rise` seguido de `[game] vida perdida · vidas restantes: 2`; no se registra squash | `.sdd/evidence/010-dano.png` | El contacto fue sobre la tubería mientras la planta subía; no se probó un salto directo sobre la cabeza |
| La planta nunca se destruye ni se aplasta | Revisión del código y continuación del ciclo | Sin ruta de destrucción | `PiranhaPlant` no expone `squash`/`destroy` por daño; tras el respawn vuelve a ciclar | `src/game/entities/PiranhaPlant.js`, logs | — |
| `npm run build` termina sin errores | `npm run build` | Exit 0 | `build exit: 0`; solo advertencia preexistente de chunk > 500 kB | Salida de `npm run build` | — |

## Result and follow-up

Resultado: spec 010 implementada y verificada. Las texturas `piranha_open`/`piranha_closed` se generan con `Graphics` y solo `fillRect` en `20 × 34`; la planta vive en una tubería de prueba, cicla con `depth 9` bajo un pipe `depth 10`, alterna frames a 4 fps y daña por contacto sin poder aplastarse.

Decisiones tomadas:
- La planta inicia oculta y el ciclo arranca con la espera oculta de `2000 ms`.
- La hitbox está activa durante subida, permanencia y bajada; se desactiva solo con la planta completamente oculta.
- La tubería de prueba es andamiaje; `011` define la construcción real.
- El spawn de Mario se acercó a `x = 700` para poder observar el ciclo y el contacto.

Limitaciones:
- No hubo playtest manual ni video.
- Los colores y el recorrido de `26 px` se verificaron por código; la alternancia de boca no se distingue con claridad en las capturas.
- No se probó un salto directo sobre la cabeza de la planta, solo el contacto al subir la tubería.
- La tubería es de dos tiles y no representa aún la construcción de `011`.

Seguimiento:
- `011` define tuberías, suelo, plataformas y pozos reales.
- `012` integra la planta en el layout de World 1-1.
