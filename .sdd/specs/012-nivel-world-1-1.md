# SPEC: Nivel World 1-1

## Problem and player or user value

El GDD define un único nivel. Sin un layout concreto, todos los sistemas anteriores existen pero no hay juego que recorrer. Este nivel es el entregable jugable del workshop.

## Current and expected behavior

**Actual**
- No existe nivel. La escena de plantilla no tiene mundo ni cámara.

**Esperado**
- Un único nivel horizontal llamado **World 1-1**, recorrible de izquierda a derecha.
- La cámara acompaña a Mario y no muestra fuera del nivel.
- El recorrido contiene: ground y platforms, hard blocks, brick blocks, ? blocks, coins, un Super Mushroom, Goombas, warp pipes, Piranha Plants, pits y el Goal Pole.
- La zona inicial es simple: caminar, saltar y recoger monedas.
- A medida que se avanza aparecen bloques, enemigos y obstáculos.
- El nivel termina en el Goal Pole.
- Al reiniciar por pérdida de vida, Mario vuelve al inicio del nivel.

## Related GDD or design reference

- §7. Elementos del escenario
- §10. Diseño del nivel — World 1-1
- §11.3. Nivel — World 1-1
- §12. Recorrido del juego
- §2.5 y §2.6. Assets del nivel

## Scope

- Formato de datos declarativo del nivel (plataformas, bloques, monedas, enemigos, tuberías, meta, nubes).
- Construcción del nivel a partir de esos datos.
- Cámara con seguimiento horizontal y límites del nivel.
- Nubes decorativas (`153–156`) sin colisión.
- Punto de inicio de Mario y orden de creación de entidades.
- Integración de todos los sistemas previos en una escena jugable.

## Non-scope

- Editor de niveles, múltiples niveles o progresión de mundos.
- Pantallas de menú, World Screen, Game Over y fin de nivel (`002`, `014`, `015`).
- Música y sonido.
- Cambios de tuning de los sistemas ya especificados.

## Constraints and assumptions

- El GDD **no define el layout exacto**: solo la lista de elementos y la progresión de dificultad. Se requiere aprobar un bosquejo o aceptar libertad de diseño.
- **Tuning asumido**:
  - Nivel de `210` columnas × `16` filas (`3780 × 288 px`).
  - Cámara con zoom `3` (viewport de `341 × 256 px`), seguimiento con lerp `0.1` y límites al nivel.
  - Nubes estáticas, sin parallax y sin colisión, en una capa de fondo.
- Un solo nivel; no hay transición a `1-2`.
- El nivel es más ancho que el canvas; la cámara sigue a Mario horizontal y verticalmente dentro de los límites.
- Las nubes no afectan la jugabilidad.
- **Layout aprobado para esta spec**: 210 columnas × 16 filas; suelo con 3 pozos de 2 tiles (`68–70`, `116–118`, `164–166`); 5 plataformas, 4 tuberías (3 con Piranha), 11 bloques, 27 monedas, 7 Goombas y el Goal Pole en la columna `205`.
- El Goal Pole se construye visualmente en esta spec; la interacción de fin de nivel corresponde a `014`.
- El HUD definitivo se implementa en `013`; esta spec no dibuja HUD para evitar conflictos con el zoom.

## Acceptance criteria

- [ ] El nivel se recorre de principio a fin y termina en el Goal Pole.
- [ ] Aparecen al menos: ground, platforms, hard block, brick block, ? block, coin, Goomba, pipe, Piranha Plant, pit y Goal Pole.
- [ ] El jugador puede obtener un Super Mushroom en el nivel.
- [ ] La cámara sigue a Mario y no muestra área fuera de los límites del nivel.
- [ ] La zona inicial permite caminar, saltar y recoger monedas sin obstáculos letales.
- [ ] Al perder una vida, Mario reaparece en el punto de inicio del nivel.
- [ ] No hay elementos flotantes sin soporte ni huecos accidentales en el suelo.
- [ ] `npm run build` termina sin errores.

## Evidence expected

- Captura del mapa completo o de varios tramos.
- Video de un recorrido de inicio a fin.
- Playtest de cada tipo de elemento presente.
- Documento o módulo con los datos del nivel.

## Open questions

- **Layout exacto**: ¿se aprueba un bosquejo propuesto o se deja libertad de diseño?
- Cantidad y posición de Goombas y Piranha Plants.

## Human approval

- Status: approved
- Approved by: aguss
- Date: 2026-10-19
