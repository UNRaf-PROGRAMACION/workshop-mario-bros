# Evidence: Game Over y reinicio de partida

## Source records
- Spec: [015-game-over-y-reinicio](../specs/015-game-over-y-reinicio.md).
- Plan: [015-game-over-y-reinicio](../plans/015-game-over-y-reinicio.md).
- Fecha: 2026-10-19.

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Game Over al perder la última vida | Reubicar sobre el primer pozo tres veces; dejar actuar gravedad y deathY | Respawn a 2/1 vidas, Game Over a 0 | `pitDeaths` registra 2, 1 y 0; GameOver solo aparece con la tercera caída | [Video del ciclo](015-ciclo.webm), [JSON](015-verificacion.json) | Reubicaciones dirigidas, no recorrido natural hasta el pozo |
| Texto y botón de retorno | Captura y lectura de objetos Text | GAME OVER y Volver al menú; sin puntaje final | Textos exactos, fondo opaco y sin HUD | [Captura](015-game-over.png), `pitDeaths[2].messages` en JSON | Sin revisión humana |
| No se puede seguir jugando | Input derecho y repetición de Espacio tras Game Over | Nivel detenido, estado sin cambios | Game inactivo, mundo físico destruido, Mario ausente, Hud detenido; snapshot idéntico tras input | `blockedInput` en JSON | La repetición de Espacio no retorna; una pulsación nueva sí |
| Nueva partida con 3 vidas y 0 monedas/puntos | Fixture de 1 moneda/100 puntos antes de la última muerte; volver y pulsar Jugar | 3/0/0 y HUD reiniciado | Estado correcto y frames HUD `[160,160,160,160,160,160,160,160,160,163]` | [Nueva partida](015-nueva-partida.png), `newGame` en JSON | Moneda agregada mediante API desde CDP |
| Small Mario en inicio normal | Crecer antes de la última muerte; reiniciar sin startX | Small en spawn normal | Mario vuelve a `small`, x=54, y=252 tras asentarse sobre el suelo; create usa y=210 según WORLD_1_1 | `progressBeforeLastDeath`, `newGame` en JSON; `Game.create()` | Crecimiento dirigido desde CDP |
| Ciclo completo sin errores | Menú → juego → tres caídas → GameOver → menú → juego; repetir con retornos alternativos | Enter, clic y Espacio funcionan; simulación reiniciada | Tres ciclos, un evento game-over por ciclo, Game activo al reiniciar; movimiento posterior x>54; `errors: []`, `result: passed` | Video y JSON: `enterReturn`, `mouseReturn`, `spaceReturn`, `gameOverEvents`, `movementAfterRestart` | Los ciclos extra usan Mario.die() dirigido |
| Build correcto | `npm run build` | Exit 0 | Exit 0; solo advertencia de chunk >500 kB | Salida de shell durante la implementación | Sin tests/lint configurados |

### Regresión de victoria (014)

Tras extraer la interfaz común a `ResultScreen`, se repitió la prueba de llegada, congelamiento, mensaje, retorno por Enter/clic/Espacio, contacto aislado con bandera y nueva partida. Resultado: `passed`, `errors: []` en [015-regresion-victoria.json](015-regresion-victoria.json). Esta regresión usa startX de desarrollo; no reemplaza el recorrido continuo pendiente de 012. No se sobrescribieron los artefactos previos de 014.

### Método y artefactos

Chrome headless/CDP con Vite, sin nuevas dependencias. Scripts locales ejecutados:

```text
node C:/Users/aguss/AppData/Local/Temp/opencode/verify-015.cjs
node C:/Users/aguss/AppData/Local/Temp/opencode/verify-014.cjs
```

El segundo script se adaptó para escribir su JSON de regresión en 015 y las capturas temporales fuera del repositorio. Las instancias se consultaron con Runtime.queryObjects: el acceso de diagnóstico solo existe en la página de prueba, sin globals nuevos en producción.

La prueba de 015 **no usa startX**. Los retornos e inicio usan eventos de teclado/mouse. Para acelerar las tres pérdidas se posicionó a Mario en `(1242,270)` dentro del primer pozo; la gravedad y la detección real de deathY producen la muerte. Antes de la última caída se invocaron las APIs de moneda y crecimiento para probar el reset desde valores no iniciales. Video: [015-ciclo.webm](015-ciclo.webm), con menú inicial, tres pérdidas, Game Over, retorno e inicio nuevo. Capturas adicionales: [menú](015-menu.png) y nueva partida. Servidor y Chrome propios cerrados al finalizar.

`git diff --check` pasó (solo avisos de normalización LF/CRLF).

## Result and follow-up

**015 implementada y verificada automáticamente.**

Archivos modificados:
- `src/game/scenes/Game.js`: congela Mario/física y transiciona a GameOver a cero vidas, conservando el evento existente.
- `src/game/scenes/GameOver.js` (nuevo): pantalla opaca sin nivel ni puntaje final.
- `src/game/scenes/ResultScreen.js` (nuevo): ciclo compartido de mensaje, botón y retorno, con cleanup de teclado y protección contra doble retorno.
- `src/game/scenes/LevelComplete.js`: especialización de la base compartida; conserva overlay de victoria.
- `src/game/main.js`: registra GameOver.
- Spec, plan y evidencia de 015, capturas, video y dos JSON.

Se reutilizan `GameState.reset()` y la creación de Small Mario ya existentes. El estado se reinicia al seleccionar Jugar; no se guarda progreso para partidas nuevas. No hubo dependencias, cambios de staging, commits ni publicación.

Limitaciones y decisiones pendientes:
- Falta playtest humano de navegación y sensación de pérdida de la última vida.
- Las caídas son fixtures dirigidos, no un recorrido continuo; la verificación integral pendiente de 012 sigue sin resolverse.
- Sin cambios de alcance pendientes en 015. La revisión humana debe confirmar el aspecto de las pantallas y la experiencia completa.
