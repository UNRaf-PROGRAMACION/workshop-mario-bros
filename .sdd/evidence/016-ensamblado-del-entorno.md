# Evidence: Ensamblado del entorno

## Source records
- Spec: [016-ensamblado-del-entorno](../specs/016-ensamblado-del-entorno.md).
- Plan: [016-ensamblado-del-entorno](../plans/016-ensamblado-del-entorno.md).
- Fecha: 2026-10-20.

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Suelo con superficie y base correctas | node:test y lectura de frames de imágenes en Phaser por CDP | Izquierda/centro/derecha, sin otra fila de pasto | Primeras columnas `[21,22,22]`; base `[141,142,142]`; extremos y variantes aisladas cubiertos por tests | [JSON: checks.assembly](017-verificacion.json), [tramo corregido](016-tramo-corregido.png) | Inspección visual de capturas, no comparación automática píxel por píxel |
| Plataformas sin bordes interiores | Tests de familias y consulta de frames en escena | Beige 41/42/42/43; roja 14/12/13/15 | Coincidencia exacta en runtime | [Ensamblado](016-ensamblado.png), JSON, tests/tile-layout.test.mjs | El grosor final de una fila corresponde a 017 |
| Nubes compuestas sin aislado añadido | Tests y consulta de primera nube | 153/154/155; aislado 156 solo con una columna | Runtime `[153,154,155]`; tests de 1/2/4 columnas correctos | JSON; [meta con nube](017-recorrido-small.png) | No se introdujeron nubes aisladas nuevas en el layout |
| Tamaños válidos y rechazo de variante inexistente | `node --test tests/*.test.mjs` | Casos 1/2/4 y errores controlados | Tests correctos; roja de una celda rechazada; índices inválidos rechazados | tests/tile-layout.test.mjs | No es un generador universal para todas las familias del atlas |
| Assets intactos, GDD y build | Test de igualdad binaria, diff de rutas de assets, `npm run build` | Sin PNG modificados; documentación consistente | Atlas 360×162 fuente/runtime idénticos; sin diff de assets; build exit 0 | Test de integridad, docs/GDD.md §2.5 | Advertencia de chunk >500 kB preexistente |

## Result and follow-up

**Ensamblado corregido y verificado automáticamente.** `TILE_FAMILIES` modela roles explícitos y `tileForColumn` es una función pura. Los constructores no infieren conectividad por orden de índices. GDD actualizado según las celdas completas del atlas, sin recortar ni reemplazar imágenes.

Archivos: `src/game/constants/assets.js`, `src/game/level/tileLayout.js` (nuevo), `src/game/level/Environment.js`, `src/game/scenes/Game.js`, `docs/GDD.md`, `tests/tile-layout.test.mjs` (nuevo), spec/plan/evidencia 016 y capturas. Se conserva el identificador histórico `wood`; la documentación lo describe como plataforma beige.

Comandos finales:

```text
node --test tests/*.test.mjs
npm run build
git diff --check
```

Resultado conjunto 016/017: **9 tests, 0 fallos**, build exit 0 y diff-check sin errores (avisos LF/CRLF). Inspección de capturas realizada por el asistente. Falta revisión humana de legibilidad y aspecto; no se afirma aprobación visual humana.
