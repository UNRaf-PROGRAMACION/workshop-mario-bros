/**
 * Datos del escenario de prueba de la spec 011. El layout definitivo lo
 * reemplaza la spec 012 con un nivel de 3780 × 288 y cámara.
 */
export const TEST_ENVIRONMENT = Object.freeze({
    groundTop: 700,
    deathY: 750,
    ground: Object.freeze([
        Object.freeze({ from: 0, to: 594 }),
        Object.freeze({ from: 630, to: 1008 })
    ]),
    platforms: Object.freeze([
        Object.freeze({ kind: 'wood', left: 180, top: 640, tiles: 4 }),
        Object.freeze({ kind: 'red', left: 500, top: 640, tiles: 4 })
    ]),
    pipes: Object.freeze([
        Object.freeze({ x: 400, baseY: 700, tiles: 2 })
    ])
});
