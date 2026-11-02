# Plan: Ensamblado del entorno

## Source spec
- Path: ../specs/016-ensamblado-del-entorno.md
- Approval status: approved, aguss, 2026-10-20.

## Repository evidence
Environment.js usa frameFor y grupos consecutivos de assets.js; Game.#createClouds concatena 153–156. El atlas 360×162 es idéntico en assets/public y contiene familias con topologías distintas. CodeGraph informó que este repositorio no está indexado y ordenó usar herramientas de lectura en esta sesión.

## Proposed steps
1. Definir TILE_FAMILIES y tileForColumn como datos y función pura, no nuevas clases sin estado.
2. Componer suelo con superficie abierta abajo y base de tierra. Mantener cuerpos físicos.
3. Componer plataformas beige sin segunda superficie y roja con sus extremos reales.
4. Corregir nubes y GDD §2.5; agregar pruebas con node:test sin dependencias ni configuración de entrega.
5. Verificar PNG sin cambios, build, pruebas y capturas en navegador.

## Files and symbols
- src/game/constants/assets.js: TILE_FAMILIES.
- src/game/level/tileLayout.js: tileForColumn.
- src/game/level/Environment.js: buildGround/buildPlatform.
- src/game/scenes/Game.js: #createClouds.
- docs/GDD.md, tests/tile-layout.test.mjs y evidencia 016.

## Verification
node --test tests/tile-layout.test.mjs; npm run build; navegador y revisión de imágenes.

## Stopping conditions
No inventar frames, no cambiar PNG ni reglas de colisión/salto en esta unidad. Topología ambigua exige reexaminar el atlas.
