const col = (index) => index * 18;
const row = (index) => index * 18;

/**
 * Layout de World 1-1 (spec 012): 210 columnas × 16 filas.
 * Las coordenadas de bloques y monedas son centros; las de plataformas, bordes.
 */
export const WORLD_1_1 = Object.freeze({
    width: col(210),
    height: row(16),
    groundTop: row(14),
    deathY: row(16),
    marioStart: Object.freeze({ x: col(3), y: 210 }),

    ground: Object.freeze([
        Object.freeze({ from: col(0), to: col(68) }),
        Object.freeze({ from: col(70), to: col(116) }),
        Object.freeze({ from: col(118), to: col(164) }),
        Object.freeze({ from: col(166), to: col(210) })
    ]),

    platforms: Object.freeze([
        Object.freeze({ kind: 'wood', left: col(16), top: row(11), tiles: 4 }),
        Object.freeze({ kind: 'red', left: col(48), top: row(11), tiles: 4 }),
        Object.freeze({ kind: 'wood', left: col(88), top: row(11), tiles: 4 }),
        Object.freeze({ kind: 'red', left: col(130), top: row(11), tiles: 4 }),
        Object.freeze({ kind: 'wood', left: col(190), top: row(11), tiles: 4 })
    ]),

    pipes: Object.freeze([
        Object.freeze({ x: col(30), baseY: row(14), tiles: 3, piranha: true }),
        Object.freeze({ x: col(55), baseY: row(14), tiles: 2, piranha: false }),
        Object.freeze({ x: col(100), baseY: row(14), tiles: 3, piranha: true }),
        Object.freeze({ x: col(150), baseY: row(14), tiles: 2, piranha: true })
    ]),

    blocks: Object.freeze([
        Object.freeze({ type: 'question', x: col(10), y: row(11) + 9 }),
        Object.freeze({ type: 'brick', x: col(12), y: row(11) + 9 }),
        Object.freeze({ type: 'hard', x: col(14), y: row(11) + 9 }),
        Object.freeze({ type: 'question', x: col(34), y: row(11) + 9 }),
        Object.freeze({ type: 'brick', x: col(36), y: row(11) + 9 }),
        Object.freeze({ type: 'question', x: col(78), y: row(11) + 9 }),
        Object.freeze({ type: 'brick', x: col(80), y: row(11) + 9 }),
        Object.freeze({ type: 'hard', x: col(82), y: row(11) + 9 }),
        Object.freeze({ type: 'question', x: col(140), y: row(11) + 9 }),
        Object.freeze({ type: 'brick', x: col(142), y: row(11) + 9 }),
        Object.freeze({ type: 'question', x: col(196), y: row(11) + 9 })
    ]),

    coins: Object.freeze([
        Object.freeze({ x: col(6), y: row(11) + 9 }),
        Object.freeze({ x: col(7), y: row(11) + 9 }),
        Object.freeze({ x: col(8), y: row(11) + 9 }),
        Object.freeze({ x: col(10), y: row(9) + 9 }),
        Object.freeze({ x: col(11), y: row(9) + 9 }),
        Object.freeze({ x: col(12), y: row(9) + 9 }),
        Object.freeze({ x: col(34), y: row(9) + 9 }),
        Object.freeze({ x: col(35), y: row(9) + 9 }),
        Object.freeze({ x: col(68), y: row(9) + 9 }),
        Object.freeze({ x: col(69), y: row(9) + 9 }),
        Object.freeze({ x: col(78), y: row(9) + 9 }),
        Object.freeze({ x: col(79), y: row(9) + 9 }),
        Object.freeze({ x: col(80), y: row(9) + 9 }),
        Object.freeze({ x: col(88), y: row(10) + 9 }),
        Object.freeze({ x: col(89), y: row(10) + 9 }),
        Object.freeze({ x: col(90), y: row(10) + 9 }),
        Object.freeze({ x: col(91), y: row(10) + 9 }),
        Object.freeze({ x: col(116), y: row(9) + 9 }),
        Object.freeze({ x: col(117), y: row(9) + 9 }),
        Object.freeze({ x: col(130), y: row(9) + 9 }),
        Object.freeze({ x: col(131), y: row(9) + 9 }),
        Object.freeze({ x: col(132), y: row(9) + 9 }),
        Object.freeze({ x: col(164), y: row(9) + 9 }),
        Object.freeze({ x: col(165), y: row(9) + 9 }),
        Object.freeze({ x: col(190), y: row(9) + 9 }),
        Object.freeze({ x: col(191), y: row(9) + 9 }),
        Object.freeze({ x: col(200), y: row(11) + 9 })
    ]),

    goombas: Object.freeze([
        Object.freeze({ x: col(22), y: row(14) }),
        Object.freeze({ x: col(44), y: row(14) }),
        Object.freeze({ x: col(62), y: row(14) }),
        Object.freeze({ x: col(92), y: row(14) }),
        Object.freeze({ x: col(125), y: row(14) }),
        Object.freeze({ x: col(145), y: row(14) }),
        Object.freeze({ x: col(185), y: row(14) })
    ]),

    clouds: Object.freeze([
        Object.freeze({ x: col(8), y: row(3) + 9 }),
        Object.freeze({ x: col(40), y: row(3) + 9 }),
        Object.freeze({ x: col(75), y: row(3) + 9 }),
        Object.freeze({ x: col(110), y: row(3) + 9 }),
        Object.freeze({ x: col(145), y: row(3) + 9 }),
        Object.freeze({ x: col(180), y: row(3) + 9 }),
        Object.freeze({ x: col(200), y: row(3) + 9 })
    ]),

    goal: Object.freeze({ x: col(205), baseY: row(14), height: 6 })
});
