# Evidence: Super Mushroom

## Source records
- Spec: `.sdd/specs/008-super-mushroom.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/008-super-mushroom.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Golpear un ? Block hace aparecer un hongo sobre el bloque | Golpear el primer ? Block y esperar la emersión | Hongo sobre el bloque | `[block] question used`, `[mushroom] emerged`; `008-emergido.png` muestra el hongo apoyado sobre el bloque | `.sdd/evidence/008-emergido.png` | — |
| El hongo emerge verticalmente sin superponerse con el bloque | Tween de `18 px` en `300 ms` con body deshabilitado; captura posterior | Sin solapamiento al quedar arriba | El body está deshabilitado durante la emersión y se habilita al terminar; el hongo queda encima | `src/game/entities/Mushroom.js`, `.sdd/evidence/008-emergido.png` | La emersión no se capturó a mitad del tween; durante esa fase queda detrás del bloque |
| Después de emerger se desplaza horizontalmente y cae con gravedad | Logs de dirección y captura tras el recorrido | Movimiento y caída | `[mushroom] direction right`; luego aparece en el suelo tras caer del bloque | `.sdd/evidence/008-giro-pared.png` | No hay video; la caída se infiere de la posición en el suelo |
| Al chocar contra una pared o tubería invierte la dirección | Esperar el giro contra el bloque lateral en `x = 720` | Cambio de dirección | `[mushroom] direction left` tras el giro | `.sdd/evidence/008-giro-pared.png` | Solo se probó el bloque lateral; no una tubería |
| Si se queda sin plataforma, cae | Recorrido desde el bloque hasta el suelo | Caída sin penalización | El hongo queda en el suelo tras salir del bloque | `.sdd/evidence/008-giro-pared.png` | La caída al pozo no se probó porque el escenario no tiene pozo |
| Recogerlo con Small transforma a Super y lo elimina | Dejar que el hongo vuelva y toque a Mario | `[mario] state super` y hongo eliminado | `[mario] state super · hitbox 20×26 · escala 1.5` y `[mushroom] collected`; `008-super.png` muestra a Mario grande sin hongo | `.sdd/evidence/008-super.png` | — |
| Recogerlo con Super no altera el estado ni duplica nada | Golpear el segundo ? Block y recoger con Super | Sin nueva transformación | Dos `[mushroom] collected` y **una sola** línea `[mario] state super`; `008-super-sin-cambio.png` mantiene a Mario grande | `.sdd/evidence/008-super-sin-cambio.png` | — |
| `npm run build` termina sin errores | `npm run build` | Exit 0 | `build exit: 0`; solo advertencia preexistente de chunk > 500 kB | Salida de `npm run build` | — |

## Result and follow-up

Resultado: spec 008 implementada y verificada. `Mushroom` emerge con un tween de `18 px` en `300 ms` con el body deshabilitado, y después se mueve a `60 px/s`, cae con la gravedad compartida, invierte la dirección al chocar y se destruye al recogerse o al caer bajo `y = 740`.

Constantes (`src/game/constants/mushrooms.js`): `SPEED 60`, `EMERGE_DISTANCE 18`, `EMERGE_MS 300`, `HITBOX 16`, `PIT_Y 740`.

Decisiones tomadas:
- El hongo sale hacia la derecha por defecto.
- Los enemigos no lo destruyen; el GDD no lo define.
- El escenario de prueba tiene dos ? Blocks para probar la recogida con Small y con Super.
- Hitbox de recogida `16 × 16` (el GDD no define una para el hongo).

Limitaciones:
- No hubo playtest manual ni video.
- La emersión no se capturó a mitad del tween: durante esa fase el hongo queda detrás del bloque.
- No se probó el giro contra una tubería ni la caída a un pozo.
- No se probó interacción con enemigos (no existen todavía).

Seguimiento:
- `009` y `010` agregan enemigos y su interacción con Mario.
- `011`/`012` agregan pozos y el layout real.
