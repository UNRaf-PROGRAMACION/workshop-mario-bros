# SPEC: Transitabilidad de World 1-1

## Problem and player or user value
Mario golpea la plataforma al saltar frente a la tubería de x=990. Las plataformas rojas a 72 px superan el salto real medido (63,3 px). El nivel debe ofrecer rutas confiables para ambas formas.

## Current and expected behavior
Actual: solo 9 px entre plataforma y tubería; salto reducido a 32/28 px por el techo; plataformas beige de 36 px de grosor dejan un túnel de 18 px.
Esperado: espacio de despegue real, plataformas alcanzables y pasajes que admitan Small y Super, sin depender de esquinas ni aumentar el salto.

## Related GDD or design reference
GDD §3, §7, §10 y auditoría de transitabilidad aprobada. Se precisan medidas de diseño que el GDD no fijaba.

## Scope
- Plataformas delgadas de 18 px, manteniendo la colisión sólida por todos sus lados.
- Plataformas rojas a 54 px del suelo; mover la primera dos columnas a la izquierda para dejar 45 px antes de la tubería.
- Validación geométrica reproducible de alturas, espacio inferior, separación de obstáculos y pozos.
- Skill local de level design con definiciones, criterios y checklist de evidencia.

## Non-scope
Cambiar tuning de Mario, volver plataformas atravesables, eliminar peligros, rediseñar todo el nivel o garantizar el recorrido solo mediante teletransporte.

## Constraints and assumptions
Mantener 210 columnas, 3 pozos, 5 plataformas, 4 tuberías, 7 Goombas, monedas y meta. Margen de altura de referencia: tres tiles (54 px); paso bajo plataforma ≥35 px; separación plataforma/tubería ≥38 px. Estas reglas son límites locales, no una prueba de completabilidad.

## Acceptance criteria
- [x] Small y Super pasan la tubería de x=990 sin golpear la plataforma durante el despegue desde el espacio libre.
- [x] Ambas formas pueden aterrizar en las plataformas rojas y alcanzar sus monedas.
- [x] Pasaje inferior de plataformas de 36 px y separación de 45 px en el tramo reportado.
- [x] Movimiento y salto originales intactos; validador detecta el layout anterior y acepta el corregido.
- [x] Pruebas de pozos/tuberías y tentativa de recorrido continuo registradas sin presentar fixtures aislados como recorrido completo.
- [x] Skill local creada con criterios y límites de verificación; build y tests correctos.

## Evidence expected
Capturas, mediciones Small/Super, resultados de tests, video o registro de recorrido continuo. Playtest humano pendiente si no se realiza.

## Open questions
Ninguna para este alcance. Si surge otro bloqueo que requiera cambiar física, enemigos o reglas, detenerse y volver a la spec.

## Human approval
- Status: approved
- Approved by: aguss (pedido «implementar» tras la auditoría y propuesta)
- Date: 2026-10-20

## Related records
- Plan: ../plans/017-transitabilidad-world-1-1.md
- Evidence: ../evidence/017-transitabilidad-world-1-1.md
