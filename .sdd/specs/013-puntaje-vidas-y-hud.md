# SPEC: Puntaje, vidas y HUD

## Problem and player or user value

El HUD es la única lectura que tiene el jugador de su progreso: cuántas monedas lleva, cuánto vale y cuántas vidas le quedan. Sin estado de partida centralizado, cada sistema contaría por su cuenta.

## Current and expected behavior

**Actual**
- No existe estado de partida ni HUD.

**Esperado**
- El HUD se muestra en la parte superior de la pantalla, fijo respecto de la cámara.
- Muestra `MARIO`, `SCORE`, `COINS`, `LIVES` y `WORLD`.
- Formato de referencia: `MARIO 001200 | COINS 05 | LIVES 03 | WORLD 1-1`.
- Las cifras usan los dígitos chicos `160–169`; las palabras usan texto de Phaser.
- Los valores cambian a medida que Mario juega.
- La partida comienza con 3 vidas, 0 monedas y 0 puntos.

## Related GDD or design reference

- §2.5. Dígitos HUD (chicos `160–169`)
- §5.1. Moneda (+100 puntos, +1 moneda)
- §8.1. Puntos
- §8.2. Vidas
- §9. Información en pantalla — HUD
- §11.4. Reinicio de contadores en partida nueva

## Scope

- Estado de partida centralizado: `score`, `coins`, `lives`, `world`.
- Escucha de eventos de recolección de monedas y de pérdida de vida.
- HUD como componente de presentación fijo, suscripto a cambios de estado.
- Render de cifras con los dígitos `160–169` y de palabras con texto.
- Reinicio de contadores al comenzar una partida nueva.
- Formato con relleno de ceros según el ejemplo del GDD.

## Non-scope

- Lógica de recolección (`007`) y de daño (`005`).
- Pantalla de Game Over (`015`).
- Puntaje por enemigos: no está definido.
- Animación de incremento de puntaje.

## Constraints and assumptions

- **Formato asumido**: SCORE con `6` dígitos, COINS y LIVES con `2` dígitos, relleno con ceros; WORLD fijo en `1-1`.
- El HUD se actualiza en el mismo frame o el siguiente al cambio de estado.
- El estado no vive en el HUD: el HUD solo observa y dibuja (patrón Observer).
- Se usa `scene.registry` o un módulo de estado de partida, no variables globales.
- La hoja no tiene letras: `MARIO`, `COINS`, `LIVES` y `WORLD` van con texto de Phaser.
- `WORLD` usa `1-1` fijo; no hay progresión de mundos.
- El HUD se implementa como escena propia (`Hud`) con cámara sin zoom, para no verse afectado por el `zoom 3` del nivel.
- El puntaje se muestra después de `MARIO`, siguiendo el ejemplo de §9.

## Acceptance criteria

- [ ] El HUD es visible desde el inicio del nivel y no se desplaza con la cámara.
- [ ] Muestra `MARIO`, `SCORE`, `COINS`, `LIVES` y `WORLD` con el formato de referencia.
- [ ] Recoger una moneda actualiza COINS en +1 y SCORE en +100 en el mismo frame o el siguiente.
- [ ] Perder una vida actualiza LIVES en −1.
- [ ] El HUD inicia en 3 vidas, 0 monedas y 0 puntos al comenzar una partida.
- [ ] Una partida nueva reinicia los contadores a cero.
- [ ] Las cifras se dibujan con los tiles `160–169` y las palabras con texto.
- [ ] `npm run build` termina sin errores.

## Evidence expected

- Captura del HUD en estado inicial.
- Captura del HUD tras recoger monedas y tras perder una vida.
- Captura o registro del reinicio de contadores en partida nueva.
- Revisión del formato contra §9.

## Open questions

- ¿El puntaje por aplastar enemigos existe? El GDD solo define monedas; se asume que no.
- ¿La etiqueta `MARIO` es fija o cambia con el estado (Small/Super)? Se asume fija.

## Human approval

- Status: approved
- Approved by: aguss
- Date: 2026-10-19
