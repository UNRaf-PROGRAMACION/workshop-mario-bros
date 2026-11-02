# SPEC: Ensamblado del entorno

## Problem and player or user value
El suelo, las plataformas y las nubes tienen cortes y bordes interiores por interpretar todas las familias como una secuencia genérica. El jugador necesita leer superficies continuas y distinguir decoración de obstáculos.

## Current and expected behavior
Actual: frameFor usa un tile aislado como extremo y alterna extremos con centros; el suelo duplica pasto en su segunda fila y las nubes concatenan una pieza aislada.
Esperado: selección explícita de aislado/izquierda/centro/derecha por familia; pasto solo en la superficie, relleno de tierra y nubes cerradas correctamente.

## Related GDD or design reference
GDD §2.2, §2.5, §2.7, §7 y §10. Se corrigen las descripciones erróneas de las piezas según la auditoría visual y de píxeles aprobada.

## Scope
- Familias de tiles por función y selector puro verificable.
- Corregir suelo, plataformas y nubes sin cambiar PNG ni física de Mario.
- Documentar la topología de las piezas del atlas.

## Non-scope
Layout/transitabilidad (017), nuevos assets, tintes, cambios de enemigos o de reglas de salto.

## Constraints and assumptions
Conservar celdas de 18 px completas, colisiones actuales y tamaño del nivel en esta unidad. La plataforma beige conserva su identificador wood por compatibilidad; no se identifica su material solo por el nombre histórico.

## Acceptance criteria
- [x] Suelo profundo: superficie 21/22/23 y base 141/142/143, sin extremos dentro del tramo; variantes aisladas 20/140 para una columna.
- [x] Plataformas beige sin repetir superficies en una misma pieza; roja con extremos 14/15 y centros 12/13.
- [x] Nube compuesta 153/154/155; nube aislada 156, no concatenada al final.
- [x] Casos de 1/2/4 columnas y familias sin tile aislado validados sin índices inventados.
- [x] PNG originales sin cambios, GDD alineado, tests y build correctos.

## Evidence expected
Pruebas Node, capturas por familia y build. Diferenciar la comprobación de ensamblado de la jugabilidad completa.

## Open questions
Ninguna: el usuario aprobó implementar las correcciones propuestas en la auditoría.

## Human approval
- Status: approved
- Approved by: aguss (pedido «implementar» tras la auditoría y propuesta)
- Date: 2026-10-20

## Related records
- Plan: ../plans/016-ensamblado-del-entorno.md
- Evidence: ../evidence/016-ensamblado-del-entorno.md
