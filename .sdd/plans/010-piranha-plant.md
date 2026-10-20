# Plan: Piranha Plant

## Source spec
- Path: `.sdd/specs/010-piranha-plant.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `Boot` carga las hojas y crea animaciones; no genera texturas.
- `Game` tiene suelo, bloques, monedas, hongos, Goombas y un bloque lateral; no hay tuberías.
- `Mario.takeDamage()` existe y no distingue el origen.
- `PIRANHA_PLANT` está en `CHARACTERS` con origen `(0.5, 1)` y hitbox `12 × 10`, pero sin textura.
- No existe la planta ni el ciclo de aparición.

## Proposed steps
1. Crear `src/game/constants/piranha.js` con lienzo, ciclo, recorrido, hitbox y colores.
   Criteria covered: medidas y tuning centralizados.
2. Crear `src/game/textures/piranha.js` con `createPiranhaTextures()` usando solo `fillRect` y `generateTexture`.
   Criteria covered: texturas `20 × 34` con colores de §2.6.
3. Llamar la generación desde `Boot` antes de iniciar el menú.
   Criteria covered: texturas disponibles en runtime.
4. Crear `src/game/entities/PiranhaPlant.js`: body estático `12 × 10`, ciclo de tweens, frames a 4 fps, depth 9 y body deshabilitado solo oculta.
   Criteria covered: ciclo, recorrido, frames y daño.
5. Agregar una tubería de prueba en `x = 850` con `depth 10` y conectar overlap de daño sin aplastamiento.
   Criteria covered: tubería tapa la planta y contacto daña desde cualquier lado.
6. Acercar el spawn de Mario a la tubería para facilitar la prueba.
   Criteria covered: evidencia del ciclo y del daño.
7. Verificar con build y corrida CDP: texturas, tiempos del ciclo, capturas afuera/oculta, daño lateral y desde arriba.
   Criteria covered: todos los criterios observables.

## Files and symbols

- `src/game/constants/piranha.js` (nuevo): `PIRANHA`
- `src/game/textures/piranha.js` (nuevo): `PIRANHA_TEXTURES`, `createPiranhaTextures`
- `src/game/entities/PiranhaPlant.js` (nuevo): `PiranhaPlant`, `#rise`, `#fall`, `#syncBody`
- `src/game/scenes/Boot.js`: generación de texturas
- `src/game/scenes/Game.js`: tubería de prueba, planta, overlap de daño y spawn cercano
- `.sdd/evidence/010-*`

## Verification

- `npm run build` sin errores.
- Chrome headless/CDP:
  - logs `[piranha] texture ... 20×34`;
  - logs `rise`, `out`, `hide`, `hidden` con tiempos medidos;
  - capturas de la planta afuera y oculta;
  - salto sobre la tubería con la planta afuera/hidden → `[game] vida perdida`.
- Consola sin errores.

## Stopping conditions

- La textura generada no mide `20 × 34` o queda suavizada.
- El ciclo no respeta los tiempos o el recorrido no es de `26 px`.
- La planta daña estando completamente oculta o se puede aplastar.
- Aparece necesidad de tuberías reales o layout (fuera de alcance).
