# **🎮 Game Design Document (GDD)**

## **Super Mario Bros — Versión simplificada**

**Proyecto:** Workshop de programación con agentes  
**Género:** Plataformas 2D  
**Juego de referencia:** Super Mario Bros (1985)  
**Herramienta:** Phaser  
**Modo de juego:** Un jugador

---

## **1\. Descripción del juego**

Vamos a crear una versión simplificada del clásico **Super Mario Bros**.

El jugador controla a Mario, un personaje que debe recorrer un escenario lleno de plataformas, bloques, monedas, obstáculos y enemigos.

Mario puede caminar, saltar, golpear bloques con la cabeza, recoger objetos y derrotar enemigos saltando sobre ellos.

El objetivo es llegar hasta la bandera que se encuentra al final del nivel sin perder todas las vidas.

## **2\. Estilo visual y recursos**

El juego tendrá un estilo de dibujos pixelados, coloridos y sencillos.

Para crear el escenario, los personajes y los objetos utilizaremos los recursos gratuitos del paquete **Pixel Platformer de Kenney**.

**Recursos visuales:** [https\://kenney.nl/assets/pixel-platformer](https://kenney.nl/assets/pixel-platformer)

**Licencia:** Creative Commons CC0.

Utilizaremos estos dibujos para representar los elementos del juego, aunque no sean idénticos a los originales de Super Mario Bros.

Los personajes y objetos conservarán sus nombres del juego de Mario, pero tendrán una apariencia basada en los recursos de Kenney.

### **2.1. Hojas de sprites disponibles**

| Archivo | Celda | Grilla | Celdas | Contenido |
|---|---:|---|---:|---|
| `assets/tilemap_packed.png` | 18 × 18 px | 20 × 9 | 180 | Escenario, bloques, objetos, decoración y fuente de dígitos |
| `assets/tilemap-characters_packed.png` | 24 × 24 px | 9 × 3 | 27 | Personajes y enemigos |

Ambas hojas están empaquetadas: **margen 0 px y separación 0 px** entre celdas.

### **2.2. Convención de referencia**

Cada elemento del juego se referencia con este formato:

`archivo · frame(s) · rect(s) · animación · origen · hitbox`

- **Escenario** (`tilemap_packed.png`): índice `i` → columna `i % 20`, fila `floor(i / 20)`; rect `((i % 20) × 18, floor(i / 20) × 18, 18, 18)`.
- **Personajes** (`tilemap-characters_packed.png`): índice `i` → columna `i % 9`, fila `floor(i / 9)`; rect `((i % 9) × 24, floor(i / 9) × 24, 24, 24)`.
- Los "frames" son siempre **índices de celda** de la hoja, no archivos recortados.

Ejemplo: Mario = `tilemap-characters_packed.png`, frames `[0, 1]`, rects `(0, 0, 24, 24)` y `(24, 0, 24, 24)`.

### **2.3. Carga en Phaser**

```js
this.load.spritesheet('tiles', 'assets/tilemap_packed.png', { frameWidth: 18, frameHeight: 18 });
this.load.spritesheet('characters', 'assets/tilemap-characters_packed.png', { frameWidth: 24, frameHeight: 24 });
```

El índice de frame en Phaser coincide con el índice de celda de este documento (`tiles` → `0`–`179`, `characters` → `0`–`26`).

### **2.4. Personajes y enemigos**

| Elemento | Archivo | Frames | Rects | Animación | Origen | Hitbox |
|---|---|---|---|---|---|---|
| Small Mario | `tilemap-characters_packed.png` | `[0, 1]` | `(0, 0, 24, 24)` · `(24, 0, 24, 24)` | `mario_walk`, 10 fps, loop | `(0.5, 1)` | 16 × 22 |
| Super Mario | `tilemap-characters_packed.png` | `[0, 1]` | ídem | `mario_walk`, 10 fps, loop, `scale 1.5` | `(0.5, 1)` | 20 × 26 |
| Mario quieto / salto / caída | `tilemap-characters_packed.png` | `[0]` (quieto) · `[1]` (salto y caída) | ídem | frame congelado, sin animación propia | `(0.5, 1)` | — |
| Mario con daño | — | — | — | parpadeo por alpha, sin frames propios | — | — |
| Goomba | `tilemap-characters_packed.png` | `[18, 19, 20]` | `(0, 48, 24, 24)` · `(24, 48, 24, 24)` · `(48, 48, 24, 24)` | `goomba_walk`, 8 fps, loop | `(0.5, 1)` | 16 × 14 |
| Goomba aplastado | `tilemap-characters_packed.png` | `[18]` | `(0, 48, 24, 24)` | frame congelado + `scaleY 0.3` durante 100 ms, luego se destruye | `(0.5, 1)` | — |
| Piranha Plant | **sin asset** | — | — | textura generada por geometría (ver 2.6) | `(0.5, 1)` | 12 × 10 |

El pack no incluye animaciones de reposo, salto, daño ni muerte: se resuelven con frame congelado o tween, nunca con frames inexistentes.

### **2.5. Escenario, bloques, objetos y HUD**

| Elemento | Tile | Rect | Uso |
|---|---:|---|---|
| Hard Block | `11` | `(198, 0, 18, 18)` | Bloque duro, no se rompe |
| ? Block | `10` | `(180, 0, 18, 18)` | Bloque que trae un "!" y se usa como bloque de interrogación |
| Empty Block | `9` | `(162, 0, 18, 18)` | Bloque vacío después de usarlo |
| Brick Block | `29` | `(162, 18, 18, 18)` | Bloque de ladrillo (sustituto: caja con remaches) |
| Coin | `151` | `(198, 126, 18, 18)` | Moneda (giro simulado con `scaleX`) |
| Super Mushroom | `128` | `(144, 108, 18, 18)` | Hongo que da el estado Super |
| Tubería (borde) | `95` | `(270, 72, 18, 18)` | Tramo superior |
| Tubería (cuerpo) | `115` | `(270, 90, 18, 18)` | Tramo vertical, repetible |
| Poste de meta | `32` / `52` / `72` | `(216, 18, 18, 18)` · `(216, 36, 18, 18)` · `(216, 54, 18, 18)` | Tramo, tramo y base del poste |
| Bandera de meta | `85` | `(90, 72, 18, 18)` | Cartel de madera usado como bandera |
| Suelo de pasto | `0–3` / `20–23` | `(0–54, 0)` / `(0–54, 18)` | Franja cerrada: aislado `0`, izquierda `1`, centro `2`, derecha `3`. Superficie abierta abajo: aislado `20`, izquierda `21`, centro `22`, derecha `23` |
| Suelo de tierra | `120–123` / `140–143` | `(0–54, 108)` / `(0–54, 126)` | Relleno abierto verticalmente: aislado horizontal `120`, izquierda `121`, centro `122`, derecha `123`. Base cerrada abajo: `140`/`141`/`142`/`143`, mismos roles |
| Plataforma beige (id histórico `wood`) | `40–43` / `60–63` | `(0–54, 36)` / `(0–54, 54)` | Franja cerrada: aislado `40`, izquierda `41`, centro `42`, derecha `43`. `60–63` son superficie abierta abajo, no una segunda fila inferior |
| Plataforma roja | `12–15` | `(216–270, 0)` | Centros `12`/`13`, izquierda `14`, derecha `15`; mínimo dos celdas, sin variante aislada documentada |
| Nubes | `153–156` | `(234–288, 126)` | Compuesta: izquierda `153`, centro `154`, derecha `155`. `156` es una nube aislada, no un cuarto tramo |
| Dígitos HUD (chicos) | `160–169` | `(0–162, 144)` | `SCORE`, `COINS`, `LIVES` |
| Dígitos grandes | `170–179` | `(180–342, 144)` | World Screen y Game Over |

Los rects con guion indican una secuencia consecutiva: `0–3` son `(0, 0, 18, 18)`, `(18, 0, 18, 18)`, `(36, 0, 18, 18)` y `(54, 0, 18, 18)`.

**Ensamblado verificado (016):** el suelo de dos filas combina superficie `21/22/23` y base `141/142/143`, con solo centros en el interior. No repetir pasto en filas inferiores ni asumir un orden universal en las familias. Las plataformas actuales son franjas cerradas de una fila (`41/42/43` o `14/12/13/15`); la apariencia beige no implica que las celdas sean piezas de madera.

### **2.6. Elementos sin asset directo**

| Elemento del GDD | Solución adoptada |
|---|---|
| ? Block | Tile `10`, que trae un "!" dibujado. El pack no tiene ningún bloque con "?" |
| Brick Block | Tile `29` (caja de madera con remaches). El pack no tiene textura de ladrillo |
| Bandera / Goal Pole | Se arma con los postes `32`/`52`/`72` y el cartel `85`. No existe una bandera |
| Tuberías verdes | Se usan `95` + `115` con el **color original azul** del pack (`#2cc5f6` / `#1490c3`), sin tinte |
| Super Mario | Mismos frames que Small Mario con `scale 1.5`; el pack no trae una versión grande |

**Piranha Plant (textura generada).** No hay ningún enemigo planta en el pack, así que se dibuja con geometría y se genera como textura en tiempo de ejecución.

| Parámetro | Valor |
|---|---|
| Texturas | `piranha_open` y `piranha_closed`, generadas con `Graphics.generateTexture()` |
| Lienzo | `20 × 34 px`, origen `(0.5, 1)`, filtro nearest, solo `fillRect` (sin `fillCircle`) |
| Cabeza | `16 × 14`, centro `x = 10`, filas de ancho `6, 10, 12, 14, 14, 16, 16, 16, 16, 14, 14, 12, 10, 6` |
| Boca | banda blanca `10 × 4` en `y = 8`; dientes rojos `2 × 2` desde arriba en `x = 6, 10, 14` y desde abajo en `x = 8, 12` |
| Manchas | blanco `2 × 2` en `(4, 4)` y `(14, 4)` |
| Tallo | verde `4 × 20`, `x = 8`, `y = 14..34` |
| Hojas | dos rectángulos `6 × 3` en `y = 20` y `y = 26`, a la izquierda (`x = 0`) y a la derecha (`x = 14`) |
| Colores | cabeza `#dd442c`, contorno `#7e3125`, dientes/manchas `#ffffff`, tallo `#2eb082`, hojas `#36e377`, sombra `#345551` |
| Frames | `piranha_open` (boca 4 px) y `piranha_closed` (boca 2 px), 4 fps mientras está afuera |
| Ciclo | 1.2 s subir (`Sine.easeOut`) → 2.0 s afuera → 1.2 s bajar (`Sine.easeIn`) → 2.0 s oculta (6.4 s en total) |
| Recorrido | 26 px verticales desde la posición oculta |
| Profundidad | planta `depth 9`, tubería `depth 10` (queda tapada al esconderse) |

### **2.7. Reglas de uso del pixel art**

- Filtro **Nearest / Point**, sin compresión, sin mipmaps y sin antialias.
- Escalar solo con múltiplos enteros (×2, ×3, …). La única excepción documentada es Super Mario (`scale 1.5`).
- No recortar al contenido: conservar siempre la celda completa (`18 × 18` o `24 × 24`).
- Las hojas no comparten grilla: escenario `18 px`, personajes `24 px`. Al pintar un personaje sobre el mapa corresponde un corrimiento de **−3 px en X**.
- Origen fijo por personaje: **bottom-center** `(0.5, 1)` para los que caminan.
- Las hitboxes no coinciden con la celda: jugador `16 × 22`, caja `16 × 14`, moneda `14 × 14`, planta `12 × 10`.

## **3\. Personaje principal — Mario**

### **3.1. Primer personaje**

Comenzaremos con un personaje sencillo que puede:

* Caminar hacia la izquierda y derecha.  
* Saltar.  
* Caer por su propio peso.  
* Pararse sobre el suelo y las plataformas.  
* Chocar contra bloques y paredes.

El salto será normal, sin ninguna mejora. Cuando presionamos el botón de saltar, el personaje sube y vuelve a caer.

> **Assets:** `tilemap-characters_packed.png` · `alien_green` · frames `[0, 1]` · `mario_walk` 10 fps · origen `(0.5, 1)` · hitbox `16 × 22` · ver §2.4.

### **3.2. Mario y su movimiento**

Después vamos a convertir nuestro personaje en Mario.

Mario tendrá los mismos movimientos, pero con un salto más cómodo y agradable.

* **Subida suave:** cuando Mario salta, sube lentamente.  
* **Caída rápida:** cuando comienza a caer, baja con más fuerza.  
* **Recordar el salto:** si presionamos saltar un poquito antes de tocar el suelo, Mario salta apenas aterriza. (INPUT BUFFER)  
* **Salto tardío:** si Mario acaba de caminar fuera de una plataforma, todavía tiene un pequeño instante para saltar. (COYOTE TIME)

### **3.3. Estados de Mario**

Mario tendrá dos estados.

**Estado 0 — Small Mario (Mario pequeño)**

Es el estado con el que comienza el juego.

* Tiene un tamaño pequeño.  
* Puede caminar y saltar.  
* Puede golpear bloques con la cabeza.  
* No puede romper bloques de ladrillo.  
* Si un enemigo lo lastima, pierde una vida.

**Estado 1 — Super Mario (Mario grande)**

Mario se transforma en Super Mario cuando recoge un Super Mushroom.

* Su cuerpo aumenta de tamaño. Se implementa con `scale 1.5` sobre los mismos frames (`[0, 1]`); el pack no trae un sprite grande.  
* Puede caminar y saltar.  
* Puede romper bloques de ladrillo con la cabeza.  
* Si un enemigo lo lastima, vuelve a ser Small Mario sin perder una vida.

> **Assets:** mismos frames que Small Mario (`[0, 1]`) con `scale 1.5` y hitbox `20 × 26` · ver §2.4.

Después de recibir daño, Mario queda protegido durante unos segundos para evitar que un mismo enemigo lo lastime varias veces seguidas.

## **4\. Bloques del escenario**

### **4.1. Bloque duro — Hard Block**

Es un bloque sólido que no se puede romper.

En nuestra versión simplificada, cuando Mario lo golpea desde abajo:

* Se mueve un poquito hacia arriba.  
* Vuelve a su lugar.  
* No se rompe.  
* Puede golpearse varias veces.

Esto sucede tanto con Small Mario como con Super Mario.

### **4.2. Bloque de ladrillo — Brick Block**

Es el clásico bloque de ladrillos que Mario puede romper cuando es grande.

Su comportamiento depende del estado de Mario.

**Small Mario (Estado 0\)**

* Cuando lo golpea desde abajo, el bloque se mueve ligeramente hacia arriba.  
* Vuelve a su posición original.  
* No se rompe.

**Super Mario (Estado 1\)**

* Cuando lo golpea desde abajo, el bloque se rompe.  
* El bloque desaparece del escenario.  
* Mario puede pasar por el espacio que dejó.

### **4.3. Bloque de interrogación — ? Block**

Es el clásico bloque con un signo de pregunta que contiene un objeto en su interior.

Cuando Mario lo golpea desde abajo:

1. El bloque se mueve ligeramente hacia arriba.  
2. Aparece un Super Mushroom.  
3. El bloque se transforma en un Empty Block.  
4. No vuelve a entregar otro objeto.

### **4.4. Bloque vacío — Empty Block**

Es el bloque que queda después de utilizar un ? Block.

* Ya no contiene ningún objeto.  
* No entrega monedas ni honguitos.  
* Mario puede pararse sobre él.  
* No se puede romper.

> **Assets:** Hard Block `11` · ? Block `10` · Empty Block `9` · Brick Block `29`, todos en `tilemap_packed.png` (celda `18 × 18`). Ver §2.5 y §2.6.

## **5\. Objetos y poderes**

### **5.1. Moneda — Coin 🪙**

Las monedas estarán distribuidas por el escenario.

Mario puede recogerlas simplemente tocándolas.

Cuando Mario toca una moneda:

* La moneda desaparece.  
* El contador de monedas aumenta en 1\.  
* Mario gana 100 puntos.

### **5.2. Super Mushroom 🍄**

Es el clásico honguito que permite que Mario crezca.

Aparece cuando Mario golpea un ? Block.

**Comportamiento:**

* Sale desde el interior del bloque.  
* Comienza a moverse por el escenario.  
* Puede caer desde las plataformas.  
* Cuando choca contra una pared, cambia de dirección.

**Cuando Mario lo recoge:**

* Si es Small Mario, se transforma en Super Mario.  
* Si ya es Super Mario, permanece grande.

> **Assets:** Coin = tile `151` `(198, 126, 18, 18)` · Super Mushroom = tile `128` `(144, 108, 18, 18)`. Ver §2.5.

## **6\. Enemigos**

### **6.1. Goomba**

El Goomba es uno de los enemigos clásicos de Super Mario Bros.

Es una pequeña criatura marrón que camina por el escenario.

**Comportamiento:**

* Camina automáticamente hacia un lado.  
* Cuando choca contra una pared, cambia de dirección.  
* Continúa caminando hacia el lado contrario.

**Interacción con Mario:**

Si Mario toca al Goomba desde un costado, recibe daño.

Si Mario salta y cae sobre la cabeza del Goomba:

* El Goomba se aplasta.  
* Desaparece del escenario.  
* Mario recibe un pequeño impulso hacia arriba, como si hubiera rebotado sobre él.

### **6.2. Planta Piraña — Piranha Plant**

La Piranha Plant es un enemigo que vive dentro de las tuberías.

**Comportamiento:**

* Comienza escondida dentro de una tubería.  
* Sale lentamente hacia arriba.  
* Permanece afuera unos instantes.  
* Vuelve a esconderse.  
* Repite este movimiento constantemente.

**Interacción con Mario:**

* Si Mario toca la planta, recibe daño.  
* Mario no puede derrotarla saltando sobre ella.  
* Debe esquivarla y esperar el momento adecuado para pasar.

> **Assets:** Goomba = `crawler_blue`, frames `[18, 19, 20]` → `(0, 48, 24, 24)`, `(24, 48, 24, 24)` y `(48, 48, 24, 24)`, 8 fps, hitbox `16 × 14`. Piranha Plant = sin asset, `piranha_open` / `piranha_closed` generadas por geometría. Ver §2.4 y §2.6.

## **7\. Elementos del escenario**

### **7.1. Suelo y plataformas — Ground / Platforms**

Son las superficies sobre las que Mario puede caminar y saltar.

Algunas estarán a diferentes alturas y deberán alcanzarse saltando.

### **7.2. Tuberías — Warp Pipes**

Son las tuberías del pack Pixel Platformer: azul claro con borde oscuro (`#2cc5f6` / `#1490c3`). Se mantiene el color original del recurso, sin tinte.

* Mario no puede atravesarlas.  
* Puede saltar y pararse encima.  
* Algunas contienen una Piranha Plant.

En esta versión las tuberías no permitirán viajar a otros lugares.

### **7.3. Pozos — Pits**

Son espacios sin suelo que Mario debe superar saltando.

Si cae en un pozo, pierde una vida.

### **7.4. Meta con bandera — Goal Pole**

Es el poste con una bandera que marca el final del nivel.

Cuando Mario toca la bandera:

* Mario deja de moverse.  
* El nivel termina.  
* Aparece un mensaje de «¡Nivel completado\!».  
* El jugador puede volver al menú principal.

> **Assets:** Suelo `0–3` / `20–23` (pasto) y `120–123` / `140–143` (tierra) · plataformas `40–43` / `60–63` · tuberías `95` + `115` (color original) · meta `32`/`52`/`72` + `85`. Ver §2.5.

## **8\. Puntos y vidas**

### **8.1. Puntos — Score**

Mario consigue puntos al recoger monedas.

Cada moneda recogida suma 100 puntos.

Los puntos se acumulan durante toda la partida.

### **8.2. Vidas — Lives**

Mario comienza la partida con 3 vidas.

Pierde una vida cuando:

* Recibe daño de un enemigo mientras es Small Mario.  
* Cae en un pozo.

Cuando pierde una vida, vuelve al comienzo del nivel siendo Small Mario.

Si pierde todas las vidas, aparece la pantalla Game Over.

## **9\. Información en pantalla — HUD**

Durante el juego aparecerá información en la parte superior de la pantalla.

* **SCORE:** puntos acumulados.  
* **COINS:** monedas recogidas.  
* **LIVES:** vidas restantes.  
* **WORLD:** mundo y nivel actual.

Ejemplo:

`MARIO 001200 | COINS 05 | LIVES 03 | WORLD 1-1`

Los valores cambian a medida que Mario juega.

> **Assets:** dígitos chicos `160–169` en `(0–162, 144)`; dígitos grandes `170–179` en `(180–342, 144)`. Las palabras (`MARIO`, `COINS`, `LIVES`, `WORLD`) van con texto de Phaser, porque la hoja solo trae números. Ver §2.5.

## **10\. Diseño del nivel — World 1-1**

El juego tendrá un único nivel llamado **World 1-1**, inspirado en el primer nivel de Super Mario Bros.

El escenario avanzará horizontalmente, de izquierda a derecha.

La cámara acompañará a Mario a medida que se mueve.

Durante el recorrido encontraremos:

* Ground y Platforms.  
* Hard Blocks.  
* Brick Blocks.  
* ? Blocks.  
* Coins.  
* Super Mushrooms.  
* Goombas.  
* Warp Pipes.  
* Piranha Plants.  
* Pits.  
* Goal Pole.

El nivel comenzará con una zona sencilla donde Mario podrá caminar, saltar y recoger monedas.

A medida que avance encontrará bloques, enemigos y obstáculos que deberá superar.

Finalmente llegará al Goal Pole que marca el final del nivel.

### 10.1. Contrato de transitabilidad (017)

- Coordenadas en unidades de mundo, no píxeles de cámara. Grilla del escenario: 18 px. `left/top` son bordes; bloques, monedas y tuberías usan centros según los datos del nivel. No aplicar un desplazamiento global a entidades ya posicionadas.
- Todas las plataformas están a 54 px del suelo y tienen 18 px de grosor: queda un pasaje inferior de 36 px para Small y Super (hitboxes de 22/26 px de alto). Siguen siendo sólidas por todos sus lados.
- Primera plataforma roja: columnas 48–52, `x=864..936`; tubería siguiente: `x=981..999`. Espacio libre de 45 px para salir del techo antes de saltar. Segunda roja: columnas 130–134, también con su superficie en y=198.
- Mantener el tuning de Mario. Referencia medida en navegador con físicas actuales: salto libre 63,3 px; ascenso obligatorio máximo de 54 px. El límite analítico de 66,7 px no debe usarse como altura garantizada.
- Márgenes locales: espacio bajo techo ≥35 px y separación plataforma/tubería ≥38 px. Pozos actuales de 36 px requieren despegue a carrera; no son saltos garantizados desde cualquier posición o con cualquier input.
- Las plataformas rojas son accesibles desde el suelo, sin depender de atravesar esquinas. Las monedas sobre ellas deben poder recogerse desde su superficie.
- `validateLevelGeometry` controla restricciones locales. Una validación geométrica o una captura no demuestra completabilidad: verificar rutas Small/Super, peligros y recorrido continuo con enemigos activos, sin teletransporte ni invulnerabilidad añadida.

> **Assets del nivel:** tiles `0–3`/`20–23` (pasto), `120–123`/`140–143` (tierra), `40–43`/`60–63` (plataformas), `12–15` (plataforma roja), `11` (hard), `10` (?), `9` (vacío), `29` (ladrillo), `151` (moneda), `128` (hongo), `95`+`115` (tubería), `32`/`52`/`72`+`85` (meta), `153–156` (nubes). Enemigos: frames `[18, 19, 20]` (Goomba) y Piranha generada. Ver §2.4–2.6.

## **11\. Pantallas del juego**

### **11.1. Menú principal — Main Menu**

Es la primera pantalla que aparece cuando abrimos el juego.

Contendrá:

* El título del videojuego.  
* Un botón que diga «Jugar».

Cuando el jugador presiona Jugar, pasa a la pantalla del mundo.

### **11.2. Pantalla del mundo — World Screen**

Antes de comenzar el nivel aparece una pantalla que indica dónde vamos a jugar.

En el centro aparecerá:

**WORLD 1-1**

Después de unos segundos, comenzará el nivel.

### **11.3. Nivel — World 1-1**

Es donde ocurre toda la acción.

El jugador controla a Mario y debe recorrer el escenario, recoger Coins, golpear bloques, evitar enemigos y llegar al Goal Pole.

Cuando llega a la bandera, completa el nivel.

### **11.4. Game Over**

Aparece cuando Mario pierde todas sus vidas.

Contendrá:

* El texto «GAME OVER».  
* Un botón para regresar al menú principal.

Al comenzar una nueva partida, Mario vuelve a tener 3 vidas y los contadores comienzan desde cero.

> **Assets:** títulos y botones con texto de Phaser; `WORLD 1-1` y `GAME OVER` pueden usar los dígitos grandes `170–179`. Ver §2.5.

## **12\. Recorrido del juego**

1. El jugador abre el juego y aparece el Main Menu.  
2. Presiona Jugar.  
3. Aparece la pantalla World 1-1.  
4. Comienza el nivel con Small Mario.  
5. Mario recorre el escenario, recoge Coins y golpea bloques.  
6. Puede conseguir un Super Mushroom y transformarse en Super Mario.  
7. Debe superar a los Goombas, las Piranha Plants y los Pits.  
8. Si pierde una vida, vuelve al comienzo del nivel.  
9. Si pierde todas sus vidas, aparece Game Over.  
10. Si llega al Goal Pole, completa el nivel.

## **13\. Alcance del videojuego**

Crearemos una versión sencilla de Super Mario Bros que incluya:

* Un personaje principal: Mario.  
* Dos estados: Small Mario y Super Mario.  
* Movimiento y salto.  
* Tres tipos principales de bloques y su versión vacía.  
* Coins y Super Mushrooms.  
* Dos enemigos: Goomba y Piranha Plant.  
* Warp Pipes y Pits.  
* Un único nivel: World 1-1.  
* Puntos, monedas y vidas.  
* Main Menu, World Screen, World 1-1 y Game Over.  
* Gráficos del paquete Pixel Platformer de Kenney.
