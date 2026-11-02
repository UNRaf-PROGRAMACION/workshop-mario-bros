# Plan: Transitabilidad de World 1-1

## Source spec
- Path: ../specs/017-transitabilidad-world-1-1.md
- Approval status: approved, aguss, 2026-10-20.

## Repository evidence
world11 define la plataforma roja 900..972 a y=180 y la tubería 981..999. Movimiento: velocidad 100, salto -400, gravedad ascendente 1200. Auditoría con agent-browser: salto libre 63,3; bajo techo 32/28 px. Ambas plataformas rojas necesitan bajar de 72 a 54 px; las beige tienen solo 18 px bajo su cuerpo.

## Proposed steps
1. Hacer todas las plataformas de una celda de grosor usando las familias de 016; mantener colisión sólida.
2. Mover primera roja de columna 50 a 48, bajar ambas rojas a fila 11. No mover monedas ni peligros salvo que la verificación detecte contradicción con el alcance.
3. Crear un validador puro de límites locales y tests que rechacen la geometría anterior.
4. Documentar medidas en GDD y crear .opencode/skills/platformer-level-design/SKILL.md con un checklist reproducible, sin configurar OpenCode globalmente.
5. Verificar por navegador ambas formas en tubería, plataformas y pozos. Intentar recorrido continuo con enemigos activos desde spawn normal y registrar límites reales.

## Files and symbols
- src/game/level/Environment.js: grosor de plataformas.
- src/game/level/world11.js: coordenadas de rojas.
- src/game/level/validateLevel.js y tests/level-design.test.mjs.
- docs/GDD.md y .opencode/skills/platformer-level-design/SKILL.md.
- Evidencia 017 y scripts reproducibles de verificación.

## Verification
node --test tests/*.test.mjs; npm run build; git diff --check; agent-browser/CDP. Tests puros no sustituyen físicas ni playtest. No instalar dependencias.

## Stopping conditions
No alterar movement.js, hitboxes, daño, alturas de tuberías ni ciclo de enemigos para lograr un resultado. Separar prueba local, recorrido sin peligros y recorrido completo real; no ocultar fallos del último.
