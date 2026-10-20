# Plan: Goal Pole y fin de nivel

## Source spec
- Path: `.sdd/specs/014-meta-y-fin-de-nivel.md`
- Approval status: approved, aguss, 2026-10-19.

## Repository evidence
- `Game.#createGoal()` dibuja los frames de `TILES` sin cuerpos físicos.
- `WORLD_1_1.goal` define posición, base y altura del poste.
- `Game` coordina input, daño y reinicio; usa `#handlingDeath` como protección.
- `Hud` ya usa una escena independiente para evitar el zoom 3 del nivel.
- `MainMenu.#starting` no se reinicia en `create()`: impediría jugar después de volver al menú.
- Convenciones: clases ES con campos privados, identificadores en inglés y comentarios en español. No hay tests ni lint configurados. Verificación disponible: build y navegador.
- CodeGraph no tiene índice en este proyecto; la herramienta indicó usar lectura directa. No se inicializó un índice.

## Proposed steps
1. Extraer la meta visual y sus zonas estáticas a `GoalPole`, con overlap separado para poste y bandera, respetando las celdas de 18 px del GDD.
   Criteria covered: assets, detección en cualquier parte del poste o bandera.
2. Sustituir el guard de muerte por estados explícitos playing/dying/completed. Completar solo desde playing, congelar a Mario mediante su API y pausar el nivel completo.
   Criteria covered: disparo único, bloqueo de input, física y daño.
3. Registrar una escena transparente `LevelComplete` con mensaje y retorno mediante clic, Enter o Espacio. Detener Game al retornar (su shutdown detiene Hud).
   Criteria covered: overlay fijo y retorno explícito al menú.
4. Reiniciar `MainMenu.#starting` en create para permitir otra partida.
   Criteria covered: navegación posterior al retorno.
5. Ejecutar build y pruebas CDP de llegada, input sostenido, retorno por teclado y mouse y nueva partida. Registrar resultados reales y limitaciones.

## Files and symbols
- `src/game/entities/GoalPole.js`: nueva clase compuesta para visuales y zonas de overlap.
- `src/game/entities/Mario.js`: `freeze()` para detener cuerpo y animación.
- `src/game/scenes/Game.js`: estados, creación de meta y transición de victoria.
- `src/game/scenes/LevelComplete.js`: nueva escena de overlay y retorno.
- `src/game/scenes/MainMenu.js`: reset del guard de inicio.
- `src/game/main.js`: registro de LevelComplete.
- `.sdd/evidence/014-meta-y-fin-de-nivel.md` y capturas asociadas.

## Verification
- `npm run build`.
- Navegador Chrome/CDP sin instalar dependencias: usar el startX de desarrollo para aproximarse a la meta; comprobar mensaje, pausa, posición estable de Mario y vidas constantes con input posterior, activación única y retorno con teclado/mouse.
- Repetir menú → juego después de volver, comprobando contadores iniciales.
- Capturas antes/después y logs; si no se obtiene video o playtest humano, declararlo sin darlo por verificado.

## Stopping conditions
- Contradicción con GDD, necesidad de nuevos assets/dependencias o modificación de Game Over (015).
- Superposición de escenas que impida volver al menú o que deje física activa tras completar.
- No extender este cambio al recorrido continuo pendiente de 012.
