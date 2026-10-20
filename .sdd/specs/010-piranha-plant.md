# SPEC: Piranha Plant

## Problem and player or user value

La Piranha Plant introduce un enemigo que no se puede derrotar y obliga a esperar el momento correcto para pasar. Es el único elemento del juego sin asset en el pack y, por lo tanto, también una prueba de generación de texturas en runtime.

## Current and expected behavior

**Actual**
- No existe la planta ni sus texturas.

**Esperado**
- La planta vive dentro de una tubería, oculta.
- Ciclo continuo: sube 1.2 s (`Sine.easeOut`) → permanece afuera 2.0 s → baja 1.2 s (`Sine.easeIn`) → permanece oculta 2.0 s (6.4 s totales).
- Recorrido vertical de 26 px desde la posición oculta.
- Alterna `piranha_open` (boca 4 px) y `piranha_closed` (boca 2 px) a 4 fps mientras está afuera.
- Si Mario la toca, recibe daño.
- Mario **no** puede derrotarla saltando sobre ella: saltar encima también causa daño.
- La planta se dibuja con `depth 9` y la tubería con `depth 10`, de modo que queda tapada al esconderse.

## Related GDD or design reference

- §2.4. Piranha Plant (sin asset, hitbox `12 × 10`, origen `(0.5, 1)`)
- §2.6. Piranha Plant (textura generada, medidas, colores, ciclo, profundidad)
- §6.2. Planta Piraña
- §7.2. Tuberías

## Scope

- Generación de `piranha_open` y `piranha_closed` con `Graphics.generateTexture()`, lienzo `20 × 34`, filtro nearest, solo `fillRect`.
- Construcción de la cabeza, boca, dientes, manchas, tallo y hojas según la tabla de §2.6.
- Ciclo de subida, espera, bajada y ocultamiento con tweens.
- Interpolación de frames open/closed a 4 fps mientras está visible.
- Hitbox `12 × 10` activa solo cuando la planta está fuera de la tubería.
- Daño por contacto, sin posibilidad de aplastamiento.
- Profundidades relativas a la tubería.

## Non-scope

- Construcción geométrica de las tuberías (`011`).
- Aplicación del daño y vidas (`005`).
- Sonido.
- Variantes de planta o proyectiles.

## Constraints and assumptions

- No se usan `fillCircle`: la textura se compone solo con `fillRect` (§2.6).
- Colores exactos: cabeza `#dd442c`, contorno `#7e3125`, dientes/manchas `#ffffff`, tallo `#2eb082`, hojas `#36e377`, sombra `#345551`.
- La planta no puede ser derrotada por ningún medio.
- El ciclo es constante y no depende de la posición de Mario.
- La hitbox no debe dañar mientras la planta está completamente oculta.
- La planta inicia oculta y el ciclo arranca al cargar el nivel, con la espera oculta de `2000 ms`.
- La hitbox está activa durante subida, permanencia y bajada; se desactiva solo con la planta completamente oculta.
- La tubería de prueba es andamiaje; `011` define la construcción real.

## Acceptance criteria

- [ ] Las texturas `piranha_open` y `piranha_closed` se generan en runtime con tamaño `20 × 34` y los colores indicados.
- [ ] La planta sube, permanece afuera, baja y se oculta respetando 1.2 / 2.0 / 1.2 / 2.0 s.
- [ ] El recorrido vertical es de 26 px.
- [ ] Mientras está afuera alterna los dos frames a 4 fps.
- [ ] La tubería tapa a la planta cuando está oculta.
- [ ] Tocar la planta por cualquier lado, incluido desde arriba, aplica daño.
- [ ] La planta nunca se destruye ni se aplasta.
- [ ] `npm run build` termina sin errores.

## Evidence expected

- Captura de ambas texturas generadas.
- Video del ciclo completo con la tubería delante.
- Playtest de contacto lateral y desde arriba.
- Revisión de medidas y colores contra §2.6.

## Open questions

- ¿La planta está activa desde que inicia el nivel o espera su primer ciclo? Se asume que inicia oculta y arranca el ciclo al cargar el nivel.
- ¿La hitbox daña durante la subida y la bajada, o solo con la planta totalmente afuera?

## Human approval

- Status: approved
- Approved by: aguss
- Date: 2026-10-19
