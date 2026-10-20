# SPEC: Suelo, plataformas, tuberías y pozos

## Problem and player or user value

El escenario define el recorrido: dónde se puede caminar, qué se puede escalar y dónde se pierde una vida. Sin esta capa, Mario no tiene mundo ni riesgo.

## Current and expected behavior

**Actual**
- No existe escenario jugable.

**Esperado**
- Suelo continuo con tiles de pasto y tierra, con extremos y centros correctos.
- Plataformas elevadas de madera y plataforma roja.
- Tuberías sólidas: no se atraviesan, se puede saltar y pararse encima, no transportan a ningún lado.
- Pozos sin suelo que Mario debe superar saltando.
- Si Mario cae en un pozo, pierde una vida (`005`).

## Related GDD or design reference

- §2.5. Suelo, plataformas, tuberías
- §2.6. Tuberías (color original, sin tinte)
- §7.1. Suelo y plataformas
- §7.2. Tuberías
- §7.3. Pozos
- §10. Diseño del nivel

## Scope

- Construcción de suelo y plataformas a partir de los tiles `0–3` / `20–23` (pasto), `120–123` / `140–143` (tierra), `40–43` / `60–63` (madera) y `12–15` (roja).
- Cuerpos estáticos de colisión para suelo, plataformas y tuberías.
- Tuberías con `95` (borde) y `115` (cuerpo), sin tinte.
- Detección de caída por debajo del mundo como disparador de pérdida de vida.
- API para declarar estas piezas desde los datos del nivel.

## Non-scope

- Layout y posiciones concretas (`012`).
- Piranha Plants dentro de tuberías (`010`).
- Cámara.
- Decoración de nubes (`012`).
- Tuberías transitables: §7.2 las excluye explícitamente.

## Constraints and assumptions

- El nivel mide `16` filas de alto (`288 px`); el umbral de muerte es `y > 288`.
- La plataforma roja (`12–15`) es sólida y pisable.
- Las tuberías tienen altura configurable por los datos del nivel, con un mínimo de `2` tiles (borde + cuerpo).
- Los pozos son ausencia de suelo; su ancho lo define `012`.
- Los tiles no se recortan: celda completa de `18 × 18`.
- Se conserva el color original azul de las tuberías; no se aplica tinte.
- Mientras `012` no defina el nivel definitivo, el escenario de prueba usa `1024 × 768`, suelo en `y = 700`, pozo de `40 px` y umbral de muerte `y = 750`.
- `012` reemplaza esas medidas por las `3780 × 288` con cámara y ajusta el umbral a la altura del nivel.
- Cualquier caída por debajo del umbral, dentro o fuera de un pozo, cuesta una vida.

## Acceptance criteria

- [ ] Mario camina sobre el suelo sin hundirse ni atravesarlo.
- [ ] Las plataformas elevadas son sólidas y pisables desde arriba.
- [ ] Mario no atraviesa las tuberías y puede pararse encima.
- [ ] Las tuberías se ven con el color original del pack, sin tinte.
- [ ] Mario puede caer en un pozo.
- [ ] Al caer por debajo del mundo, pierde una vida y reaparece al inicio del nivel.
- [ ] El suelo no muestra huecos visuales entre tiles contiguos.
- [ ] `npm run build` termina sin errores.

## Evidence expected

- Captura del tramo inicial con suelo, plataformas y tubería.
- Video de salto sobre un pozo y de caída con pérdida de vida.
- Playtest de colisión con tuberías desde los cuatro lados.

## Open questions

- ¿Qué pasa si Mario toca el borde inferior del mundo fuera de un pozo? Se asume que muere igual.

## Human approval

- Status: approved
- Approved by: aguss
- Date: 2026-10-19
