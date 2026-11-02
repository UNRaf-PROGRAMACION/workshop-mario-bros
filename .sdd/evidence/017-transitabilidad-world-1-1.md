# Evidence: Transitabilidad de World 1-1

## Source records
- Spec: [017-transitabilidad-world-1-1](../specs/017-transitabilidad-world-1-1.md).
- Plan: [017-transitabilidad-world-1-1](../plans/017-transitabilidad-world-1-1.md).
- Fecha: 2026-10-20.

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Cruzar la tubería reportada con ambas formas | Fixture desde x=950; derecha y salto, con peligros aislados | Cruzar x=1009, sin techo | Small x≈1063; Super x≈1063; salto 63,3 px y blocked.up falso en ambos | [JSON, reported-pipe](017-verificacion.json), [Small](017-paso-small.png), [Super](017-paso-super.png) | Prueba local con posición dirigida y contactos de enemigos desactivados |
| Plataformas rojas y monedas alcanzables | Salto desde suelo a primera/segunda roja, por forma | Pies en y=198 y tres monedas sobre la segunda roja | Ambas formas aterrizan en ambas rojas; cada una recoge las tres monedas originales | JSON: red-platform-48/130; [Small](017-plataforma-small.png), [Super](017-plataforma-super.png) | Cada forma usa partida nueva; no se añadieron monedas de prueba |
| Espacio libre suficiente | Layout, constructor y tests | Pasaje 36 px; separación 45 px | Plataformas de 18 px de grosor a 54 px del suelo; primera roja x=864..936 y tubo desde981 | [Tramo](016-tramo-corregido.png), tests/level-design.test.mjs | Límites locales, no una simulación completa |
| Conservar físicas y detectar regresión anterior | Diff de movement/Mario/assets; test de fixture previo | Tuning intacto; validador rechaza layout anterior | Sin diff de movement.js, Mario.js ni PNG. Layout anterior produce unreachable-platform e insufficient-runway; layout nuevo sin issues | tests/level-design.test.mjs; docs/GDD.md §10.1 | Se cambiaron geometría y coordenadas del nivel, no las reglas de salto |
| Tuberías y pozos | 11 fixtures por forma: salto libre, caso reportado, dos rojas, una beige, tres tubos restantes y tres pozos | 22 pruebas locales válidas | Todas pasan, sin vidas perdidas; ambas formas cruzan cuatro tubos y tres pozos | [017-verificacion.json: localTrials](017-verificacion.json) | En estos fixtures se desactivaron contactos de enemigos y meta; monedas reales activas |
| Tentativa de recorrido continuo | Nuevo juego desde menú/spawn normal, enemigos activos, solo input | Registrar resultado real sin forzar victoria | Small completó en 42,216 s, Small todo el recorrido, 3 vidas, 0 eventos de daño. Super recibió daño del primer Goomba y la prueba se detuvo | [Small, video](017-recorrido-small.webm), [Super, video del segundo intento](017-recorrido-super.webm), JSON principales y [reintento Super](017-verificacion-super.json) | **Recorrido completo Super pendiente**; no se convirtió daño absorbido en un pase exitoso |
| Skill, build y tests | Cargar skill con la herramienta; comandos finales | Skill reconocida y verificaciones correctas | platformer-level-design cargada correctamente; 9 tests sin fallos y build exit 0 | .opencode/skills/platformer-level-design/SKILL.md; references/checklist.md | Sin playtest humano; advertencia de chunk >500 kB |

## Result and follow-up

**Correcciones locales implementadas y verificadas. Small tiene un recorrido continuo automatizado exitoso. No se afirma un recorrido exitoso con Super ni aprobación humana.**

### Comparación con la auditoría

| Medida | Antes | Ahora |
| --- | --- | --- |
| Separación roja/tubería reportada | 9 px | 45 px |
| Altura de plataformas rojas sobre el suelo | 72 px | 54 px |
| Pasaje bajo plataformas beige | 18 px | 36 px |
| Salto desde el espacio de despegue, Small/Super | 32/28 px, limitado por techo | 63,3/63,3 px |
| Superficie y relleno | Dos filas de pasto y cierres interiores | Una superficie y base de tierra continua |

### Método reproducible

```text
node --test tests/*.test.mjs
npm run build
node scripts/verify-level-design.cjs --continuous
node scripts/verify-level-design.cjs --continuous --super-only
git diff --check
```

El script usa Node con WebSocket global (Node 22+), Vite instalado y Chrome/CDP, sin nuevas dependencias. Se puede definir CHROME_PATH si Chrome está en otra ruta. Puertos locales: Vite 8092 y CDP 9244. Inicia y cierra sus procesos. No correr ediciones de módulos en paralelo: una corrida fue interrumpida por la recarga de Vite mientras se editaba y se repitió completa con los módulos estables.

- **Fixtures locales:** cuerpo reposicionado mediante API de Phaser; contactos con Goombas/Piranhas/meta desactivados, monedas activas. Forma Super preparada con grow(). No constituyen recorrido continuo.
- **Recorrido Small:** página nueva, spawn x=54, enemigos y ciclos activos; sin reposicionar, desactivar cuerpos, restaurar vidas, añadir invulnerabilidad o activar la meta artificialmente. Input sintético decide saltos y espera ciclos de plantas. Checkpoints desde x≈400 hasta3600, final x≈3673. Se verificó escena LevelComplete activa.
- **Recorrido Super:** página nueva y grow() en spawn como fixture de forma. Primer intento: daño a x≈278; reintento con anticipación del salto de plataforma: daño a x≈280. La prueba se detiene ante daño, aunque siga habiendo3 vidas. Ambos resultados se conservan en JSON; no se cambió el juego para hacer pasar el bot.
- **FPS:** física60; render≈60/61 en estas corridas. No se verificaron otros FPS, recorrido en sentido inverso ni todas las fases posibles de enemigos.
- **Video:** Small registra el recorrido continuo completo; el video Super corresponde al reintento corto con daño, no a una victoria. El resumen `result: local-passed` de los JSON se refiere a las pruebas locales; consultar `continuous[].result` para el recorrido.

### Incidencias de verificación

Los primeros fixtures de plataforma beige saltaban debajo del bloque precedente o después de entrar bajo la plataforma y golpeaban techo, comportamiento esperado de superficies sólidas. Se corrigió el input del fixture para despegar antes del borde; **no** se ajustaron colisiones o salto para forzar ese aterrizaje. La ruta principal permite caminar bajo las plataformas; la subida opcional debe iniciarse antes de quedar debajo.

Una corrida falló por un selector del harness que buscaba solo Small después de preparar Super; se corrigió el selector. Estos fallos de automatización no se presentan como pases ni como bugs solucionados de gameplay.

### Archivos y alcance

- `src/game/level/Environment.js`: plataformas delgadas y validación del número de celdas.
- `src/game/level/world11.js`: posición/altura de rojas; conserva dimensiones, pozos, enemigos, tubos y monedas.
- `src/game/level/validateLevel.js` (nuevo): límites geométricos locales.
- `tests/level-design.test.mjs` y `scripts/verify-level-design.cjs` (nuevos).
- `docs/GDD.md`: contrato de transitabilidad y medidas.
- `.opencode/skills/platformer-level-design/SKILL.md` y `references/checklist.md` (nuevos): definiciones, flujo, márgenes, condiciones de freno y niveles de evidencia.
- Spec, plan, evidencia, capturas, videos y JSON de 017. Los archivos compartidos de ensamblado se enumeran en evidencia016.

### Revisión humana pendiente

1. Revisar sensación de salto y legibilidad del nuevo armado.
2. Probar el encuentro inicial con Goomba en Super y completar una corrida con esa forma. El fallo del bot no demuestra que sea imposible, pero tampoco lo valida.
3. Evaluar accesos opcionales y margen de error para principiantes, no solo capacidad de un bot con lectura del estado del mundo.

Sin dependencias nuevas, publicación, commits ni modificaciones de staging. Las pruebas aportan ahora evidencia continua automatizada de la ruta Small antes pendiente en012; la validación humana integral sigue pendiente.
