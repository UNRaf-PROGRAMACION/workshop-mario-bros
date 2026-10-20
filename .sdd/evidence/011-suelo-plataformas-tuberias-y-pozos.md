# Evidence: Suelo, plataformas, tuberías y pozos

## Source records
- Spec: `.sdd/specs/011-suelo-plataformas-tuberias-y-pozos.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/011-suelo-plataformas-tuberias-y-pozos.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Mario camina sobre el suelo sin hundirse ni atravesarlo | Captura inicial y recorrido | Mario apoyado | `011-escenario.png` y `011-madera.png` muestran a Mario sobre el suelo sin hundirse | `.sdd/evidence/011-escenario.png` | Sin medición física del body; verificado visualmente |
| Las plataformas elevadas son sólidas y pisables desde arriba | Salto sobre la plataforma de madera y la roja | Mario sobre ambas | `011-madera.png` y `011-roja.png` muestran a Mario parado sobre cada plataforma | `.sdd/evidence/011-madera.png`, `.sdd/evidence/011-roja.png` | No se probó la colisión lateral de las plataformas |
| Mario no atraviesa las tuberías y puede pararse encima | Salto sobre la tubería de `x = 400` | Mario sobre la tubería | `011-tuberia.png` muestra a Mario sobre el borde superior | `.sdd/evidence/011-tuberia.png` | — |
| Las tuberías se ven con el color original del pack, sin tinte | Revisión de código y captura | Azul original | `buildPipe` no aplica `setTint`; la tubería se ve azul | `src/game/level/Environment.js`, `.sdd/evidence/011-tuberia.png` | No se comparó el color píxel por píxel |
| Mario puede caer en un pozo | Caminar hacia el hueco `594..630` | Caída | La captura final muestra el pozo y el respawn | `.sdd/evidence/011-pozo.png` | No hay video de la caída |
| Al caer por debajo del mundo pierde una vida y reaparece al inicio | Esperar el umbral `deathY = 750` | `LIVES 02` y respawn | `[game] vida perdida · vidas restantes: 2`; `011-pozo.png` con `LIVES 02` en el inicio | `.sdd/evidence/011-pozo.png` | El umbral es `750` en el escenario de prueba; `012` lo ajusta a la altura definitiva |
| El suelo no muestra huecos visuales entre tiles contiguos | Inspección de las capturas | Tiles contiguos | Las filas de pasto/tierra se ven continuas dentro de cada tramo | `.sdd/evidence/011-escenario.png` | No se hizo análisis de píxeles |
| `npm run build` termina sin errores | `npm run build` | Exit 0 | `build exit: 0`; solo advertencia preexistente de chunk > 500 kB | Salida de `npm run build` | — |

## Result and follow-up

Resultado: spec 011 implementada y verificada. El entorno se construye desde datos declarativos (`TEST_ENVIRONMENT`) mediante `buildEnvironment`, con cuerpos estáticos continuos por tramo para suelo y plataformas, tuberías de altura configurable sin tinte y pozos como ausencia de suelo. La caída por debajo de `deathY` dispara `Mario.die()` y el respawn con pérdida de vida.

Decisiones tomadas:
- El escenario de prueba mide `1024 × 768`, con suelo en `y = 700`, pozo de `36 px` (`594..630`) y muerte en `y = 750`.
- `012` reemplaza estos datos por el nivel `3780 × 288` con cámara y ajusta el umbral a la altura del nivel.
- Los tramos de suelo deben ser múltiplos de `18 px`; los datos lo validan y lanzan error si no lo son.
- El escenario de 011 se limita a entorno + Mario + HUD; las entidades de las specs anteriores se reintegran en `012`.

Limitaciones:
- No hubo playtest manual ni video.
- La caída y el pozo se verificaron con capturas y logs, no con video.
- No se probó la colisión lateral de plataformas ni se midió el color de la tubería píxel por píxel.
- El umbral de muerte y el tamaño del nivel son provisionales hasta `012`.

Seguimiento:
- `012` define el layout completo, la cámara con zoom `3` y el nivel `3780 × 288`.
- `012` reintegra bloques, monedas, hongos, Goombas y Piranha Plants en el nivel.
