# Evidence: Goal Pole y fin de nivel

## Source records
- Spec: [014-meta-y-fin-de-nivel](../specs/014-meta-y-fin-de-nivel.md).
- Plan: [014-meta-y-fin-de-nivel](../plans/014-meta-y-fin-de-nivel.md).
- Fecha: 2026-10-19.

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Poste y bandera con tiles 32/52/72/85 | Revisión de GoalPole/TILES y captura en la sección final | Conservar el armado visual de 012 | Referencias conservadas; poste de seis celdas y bandera visibles | [Meta](014-meta.png), `src/game/entities/GoalPole.js` | No se compararon píxeles contra la hoja fuente |
| Tocar la meta detiene a Mario y bloquea input | Iniciar con `?startX=3630`, caminar a la derecha y mantener input después del contacto | Velocidad cero y posición estable | `vx=vy=0`, cuerpo deshabilitado, Game y física pausados; posición idéntica después de izquierda/salto | [Video](014-llegada.webm), `014-verificacion.json`: `completed`, `afterInput` | Aproximación local, no recorrido completo |
| Mensaje de victoria | Captura y lectura de objetos Text por CDP | «¡Nivel completado!» | Texto exacto y botón visibles en overlay sin zoom | [Victoria](014-completado.png) | Sin playtest humano |
| Disparo único | Mantener contacto e input en la primera llegada | Un evento de finalización por llegada | Se comprobó un solo log antes del retorno; el registro completo tiene tres eventos por tres partidas completadas | `014-verificacion.json`: `logs`, `afterInput` | — |
| Retorno al menú | Tres llegadas; retornar por Enter, clic y Espacio | Menú activo, nivel/overlay/Hud detenidos | Tres retornos correctos; nueva partida jugable tras cada retorno | [Menú](014-menu.png), `keyboardReturn`, `mouseReturn`, `spaceReturn` en JSON | — |
| No avanzar ni sufrir daño después de completar | Input posterior y llamada dirigida a `takeDamage()` | Posición y vidas sin cambios | Posición estable, vidas constantes; daño fatal posterior ignorado por el coordinador | `afterInput`, `damageAfterCompletionIgnored` en JSON | Daño dirigido vía CDP, no encuentro natural con enemigo en la meta |
| Build sin errores | `npm run build` | Exit 0 | Exit 0; advertencia de chunk >500 kB | Salida de la herramienta shell | Sin tests/lint configurados |

### Comprobaciones adicionales

- **Solo bandera:** posicionamiento dirigido por CDP en `(3708,160)`, sin tocar la columna del poste. El overlap inicia victoria: [captura](014-bandera.png), `flagOnly` en JSON.
- **Respawn:** llamada dirigida a `Mario.die()` antes de llegar; Game reinicia con dos vidas (`deathRespawn`).
- **Sin premio extra:** fixture de una moneda/100 puntos y dos vidas antes de tocar bandera; victoria conserva esos valores.
- **Nueva partida:** después de esa victoria y retorno con Espacio, HUD/estado vuelven a `000000 / 00 / 03`, con física activa (`resetAfterProgress`). La corrección de `MainMenu.#starting` permite volver a jugar.
- **Consola:** `errors: []`; resultado global `passed` en [014-verificacion.json](014-verificacion.json).
- **Artefactos:** video WebM de llegada y congelamiento (202606 bytes en la corrida final), capturas de meta, victoria, bandera, menú y [nueva partida](014-nueva-partida.png).

### Método de verificación

Chrome headless con CDP y servidor Vite, sin instalar dependencias. Script local usado:

```text
node C:/Users/aguss/AppData/Local/Temp/opencode/verify-014.cjs
```

La llegada inicial y los retornos usaron eventos de teclado/mouse. Para consultar estado se obtuvo la instancia de Mario mediante `Runtime.queryObjects`; el acceso de diagnóstico al juego solo existe en la página de prueba, no en el código de producción. Los casos dirigidos de bandera, muerte, moneda y daño utilizaron APIs existentes desde CDP y están diferenciados de las acciones naturales. Servidor y Chrome iniciados por el script se cerraron al terminar.

## Result and follow-up

**014 implementada y verificada automáticamente.** Archivos de código: `GoalPole.js` y `LevelComplete.js` nuevos; `Mario.js`, `Game.js`, `MainMenu.js` y `src/game/main.js` modificados. Patrón: composición para la meta, estados explícitos playing/dying/completed y overlay independiente sobre el nivel pausado.

Limitaciones y revisión humana pendiente:
- No hubo playtest humano; revisar sensación de llegada, legibilidad y navegación.
- Se utilizó el inicio de sección exclusivo de desarrollo. Esto no verifica el recorrido continuo de 012 ni el spawn normal al volver a jugar; ese recorrido sigue pendiente.
- No se probaron individualmente todas las celdas del poste; comparten el mismo overlap. Sí hubo llegada natural a la base y contacto aislado dirigido con la bandera.
- `015` (pantalla Game Over) sigue fuera de alcance. Sin dependencias nuevas, commits, cambios de staging ni publicación.
