---
name: Platformer Level Design
description: Diseñar, ensamblar o auditar niveles de plataformas Phaser; verificar familias de tiles, rutas, saltos, espacio de cabeza, aterrizajes, enemigos y coleccionables. Usar al crear o modificar un nivel o investigar atascos y saltos imposibles.
---

# Level design de plataformas

## Fuentes y autorización

1. Leer `AGENTS.md`, `docs/GDD.md`, las specs aprobadas, el layout, el constructor del entorno, las hitboxes y las constantes de movimiento del proyecto.
2. Inspeccionar el atlas real; usar `tileset-analyzer` para confirmar topología. No inferir roles por números consecutivos. Leer `references/checklist.md` antes de cerrar.
3. Respetar SDD y modo Plan. No crear specs, cambiar física, assets o reglas sin aprobación. No instalar herramientas ni delegar automáticamente.

## Definiciones que deben quedar explícitas

- **Ruta principal:** conecta spawn con meta sin exigir power-ups, daño ni exploits salvo regla expresa del GDD. **Ruta opcional:** desvío con entrada, recompensa y salida comprobables.
- **Módulo visual:** familia y roles aislado/izquierda/centro/derecha/superficie/relleno/base. No equivale a cuerpo físico.
- **Superficie:** sólida por todos sus lados, unidireccional o decorativa. Nunca cambiar una por otra para ocultar un atasco.
- **Envolvente de salto:** alturas y distancias medidas para cada forma, tanto desde reposo como a carrera; techo y aceleración modifican el resultado. La fórmula analítica es una referencia, no evidencia de recorrido.
- **Despegue:** tramo donde todo el cuerpo abandona techos y puede iniciar el salto. **Espacio de cabeza:** distancia libre considerando hitbox y trayectoria, no solo el sprite.
- **Aterrizaje:** superficie de apoyo con margen lateral y recuperación antes del siguiente peligro. Un apoyo de un píxel no es una ruta confiable.
- **Legibilidad:** arte, profundidad y colisión comunican dónde se puede caminar, saltar, esperar o recibir daño.

## Flujo de trabajo

1. Inventariar capas y módulos; documentar unidades, origen de grilla, bordes y centros. Conservar celdas completas y filtro nearest.
2. Clasificar familias y construir piezas de 1/2/4 y más columnas. Aislados solo si existen; centros repetibles sin extremos interiores; superficie una sola vez. Si una familia no admite una celda, rechazar ese tamaño.
3. Medir salto libre y con techos; registrar versión de tuning, forma, FPS, velocidad inicial, altura/alcance y método de input. Recalcular tras cambios de físicas o hitboxes.
4. Dibujar conexiones de la ruta: despegue → trayectoria libre → aterrizaje. Revisar tubos, techos, pozos, bloques, formas Small/Super y posibles encierros al crecer o recibir daño.
5. Reservar márgenes y zonas de espera. Enseñar cada mecánica antes de combinarla con enemigos o pozos. No introducir peligros fuera de cámara que hagan obligatorio daño no anticipable.
6. Comprobar cada recompensa con una ruta realizable y segura; no basta con que esté cerca del máximo teórico. No convertir monedas en indicadores de saltos imposibles.
7. Ejecutar validador local, tests y build disponibles; después probar navegador por módulos y finalmente desde spawn hasta meta con peligros activos. Si hay `agent-browser`, cargar `agent-browser skills get core` y usar una sesión propia; no instalarlo si falta sin autorización.
8. Guardar evidencia reproducible y separar resultados según su nivel de confianza.

## Criterios del proyecto actual (revalidar, no universalizar)

- Grilla 18 px; unidades de mundo independientes del zoom 3.
- Small: 16×22; Super: 20×26. Movimiento en `src/game/constants/movement.js`.
- Salto libre observado: 63,3 px; altura de diseño obligatoria ≤54 px. Bajo techos puede ser mucho menor.
- Espacio inferior ≥35 px; plataformas actuales dejan 36 px. Separación de salida de techo antes de tubo ≥38 px; el tramo corregido deja 45 px.
- Pozos de 36 px se verifican a carrera y con margen; no prometer ese alcance desde reposo.
- `node --test tests/*.test.mjs` y `npm run build` son comprobaciones disponibles. `validateLevelGeometry` es una guardia local, NO un solucionador de rutas.

## Prohibiciones y condiciones de freno

- No aumentar salto, reducir hitboxes, volver plataformas atravesables ni quitar enemigos para lograr un pase sin autorización.
- No depender de esquinas, tunneling, frame exacto o coincidencias del orden de colisión.
- No usar valores teóricos como máximos garantizados ni copiar márgenes entre proyectos sin medir.
- No presentar fixtures teletransportados, peligros desactivados, vidas restauradas o victoria forzada como recorrido completo.
- Si la ruta no puede verificarse o contradice el GDD, registrar bloqueo y decisión pendiente; no marcar el nivel como terminado.

## Entrega mínima

Familias utilizadas, mapa/tabla de rutas, riesgos con ubicación, márgenes y medidas, archivos modificados, comandos/resultados, evidencia antes/después y limitaciones. Distinguir: análisis estático → prueba local dirigida → recorrido sin peligros → recorrido real continuo → revisión humana. Solo afirmar los niveles de evidencia realmente obtenidos.
