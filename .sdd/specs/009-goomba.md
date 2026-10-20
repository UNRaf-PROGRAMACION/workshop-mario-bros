# SPEC: Goomba

## Problem and player or user value

El Goomba es el enemigo básico y el que enseña la regla central de plataformas: saltar encima derrota, tocar de costado duele. Es el primer obstáculo con el que el jugador negocia el movimiento.

## Current and expected behavior

**Actual**
- No existen enemigos.

**Esperado**
- El Goomba camina automáticamente hacia un lado.
- Al chocar contra una pared o bloque, invierte la dirección y sigue caminando.
- Si Mario lo toca de costado, Mario recibe daño (`005`).
- Si Mario cae sobre su cabeza:
  - El Goomba queda aplastado con `scaleY 0.3` durante 100 ms.
  - Luego se destruye.
  - Mario recibe un pequeño impulso hacia arriba.
- Mientras está aplastado no vuelve a dañar a Mario.

## Related GDD or design reference

- §2.4. Goomba y Goomba aplastado (frames `[18, 19, 20]` → `(0, 48, 24, 24)`, `(24, 48, 24, 24)` y `(48, 48, 24, 24)`, `goomba_walk` 8 fps, hitbox `16 × 14`, origen `(0.5, 1)`; asset `crawler_blue`)
- §6.1. Goomba
- §8.2. Vidas

## Scope

- Entidad Goomba con sprite, origen y hitbox `16 × 14`.
- Patrulla horizontal automática.
- Inversión de dirección al colisionar lateralmente.
- Animación `goomba_walk` de 8 fps en loop.
- Detección diferenciada de contacto lateral y de aterrizaje sobre la cabeza.
- Estado aplastado con temporizador de 100 ms y destrucción.
- Rebote de Mario al aplastar.

## Non-scope

- Aplicación del daño y vidas (`005`).
- Sonido de aplastamiento.
- Puntaje por derrotar enemigos: el GDD no lo define.
- Otros enemigos.

## Constraints and assumptions

- **Tuning asumido**: velocidad de patrulla `35 px/s`; impulso de rebote de Mario `-300 px/s`; aplastamiento de `100 ms` con `scaleY 0.3`.
- El contacto se evalúa por la posición relativa: si Mario viene cayendo y sus pies están por encima del centro del Goomba, cuenta como aplastamiento.
- El Goomba cae por pozos y se destruye al salir del mundo.
- No se otorgan puntos por aplastar: §8.1 solo puntúa monedas.
- Dirección inicial hacia la izquierda en el escenario de prueba; `012` define posiciones y direcciones del nivel.
- Al aplastarse se deshabilita el body, se aplica `scaleY 0.3` y se destruye a los `100 ms`; no vuelve a dañar.
- El escenario de prueba incluye un Goomba bajo el spawn para el aplastamiento, uno de patrulla para el daño lateral y uno contra el bloque lateral para el giro.

## Acceptance criteria

- [ ] El Goomba camina solo y reproduce `goomba_walk` a 8 fps.
- [ ] Al chocar contra una pared o bloque, cambia de dirección.
- [ ] Tocar al Goomba de costado aplica daño a Mario.
- [ ] Caer sobre la cabeza lo aplasta: `scaleY 0.3` durante 100 ms y luego desaparece.
- [ ] Mario rebota hacia arriba al aplastarlo.
- [ ] Durante el aplastamiento el Goomba no vuelve a dañar.
- [ ] La hitbox es `16 × 14` con origen `(0.5, 1)`.
- [ ] `npm run build` termina sin errores.

## Evidence expected

- Video de patrulla con cambio de dirección.
- Video de contacto lateral y de aplastamiento con rebote.
- Playtest manual del estado aplastado.

## Open questions

- ¿Cuántos Goombas y en qué posiciones? Lo define `012`.

## Human approval

- Status: approved
- Approved by: aguss
- Date: 2026-10-19
