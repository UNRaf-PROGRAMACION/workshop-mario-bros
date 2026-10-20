# SPEC: Super Mushroom

## Problem and player or user value

El hongo es el único objeto que cambia el estado de Mario y, con él, el acceso a romper ladrillos y sobrevivir un golpe. Es la recompensa de golpear un ? Block y el primer objetivo de exploración.

## Current and expected behavior

**Actual**
- No existe el hongo.

**Esperado**
- Aparece al golpear un ? Block.
- Emerge desde el interior del bloque hacia arriba.
- Luego se mueve horizontalmente por el escenario.
- Cae si se queda sin plataforma.
- Al chocar contra una pared, cambia de dirección.
- Al recogerlo:
  - Small Mario pasa a Super Mario.
  - Super Mario permanece igual.
- El hongo desaparece al recogerse.

## Related GDD or design reference

- §2.5. Super Mushroom (tile `128`)
- §4.3. ? Block
- §5.2. Super Mushroom
- §3.3. Estados de Mario

## Scope

- Spawn desde un ? Block con emersión vertical controlada.
- Movimiento horizontal automático con gravedad.
- Colisión con suelo, plataformas, paredes y tuberías.
- Inversión de dirección al chocar lateralmente.
- Overlap con Mario y aplicación del efecto de transformación.

## Non-scope

- Detección del golpe al bloque (`006`).
- Máquina de estados de Mario (`005`).
- Sonido de aparición o recogida.
- Hongos que salgan de otro origen distinto de un ? Block.

## Constraints and assumptions

- Frame `128`, celda `18 × 18` (§2.5).
- **Tuning asumido**: velocidad horizontal `60 px/s`; emersión de `18 px` en `300 ms`; gravedad compartida con `003` (`2100 px/s²` de caída).
- La emersión ocurre sin atravesar el bloque que lo contiene.
- El hongo puede caer en un pozo y desaparecer sin penalización.
- Un hongo recogido por Super Mario no produce ningún efecto ni duplica estado.
- El hongo no rebota al caer.
- El hongo emerge hacia la derecha por defecto.
- Los enemigos no destruyen ni aplastan el hongo: el GDD no lo menciona.
- El escenario de prueba tiene dos ? Blocks para poder probar la recogida con Small y con Super.

## Acceptance criteria

- [ ] Golpear un ? Block hace aparecer un hongo sobre el bloque.
- [ ] El hongo emerge verticalmente sin superponerse con el bloque.
- [ ] Después de emerger, se desplaza horizontalmente y cae con gravedad.
- [ ] Al chocar contra una pared o tubería, invierte la dirección.
- [ ] Si se queda sin plataforma, cae.
- [ ] Recogerlo con Small transforma a Super y lo elimina del escenario.
- [ ] Recogerlo con Super no altera el estado ni duplica nada.
- [ ] `npm run build` termina sin errores.

## Evidence expected

- Video del ciclo: golpe al ? Block, aparición, recorrido, caída y recogida.
- Captura del estado de Mario antes y después de recogerlo.
- Constantes de velocidad y emersión documentadas.

## Open questions

- ¿El hongo sale siempre hacia la derecha o hacia el lado opuesto a Mario?
- ¿Puede ser aplastado o destruido por un enemigo? El GDD no lo menciona.

## Human approval

- Status: approved
- Approved by: aguss
- Date: 2026-10-19
