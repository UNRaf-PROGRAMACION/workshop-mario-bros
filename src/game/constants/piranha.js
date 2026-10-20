/**
 * Tuning y medidas de la Piranha Plant (spec 010 y GDD §2.6).
 */
export const PIRANHA = Object.freeze({
    CANVAS_WIDTH: 20,
    CANVAS_HEIGHT: 34,
    TRAVEL: 26,
    RISE_MS: 1200,
    OUT_MS: 2000,
    FALL_MS: 1200,
    HIDDEN_MS: 2000,
    FRAME_MS: 250,
    HITBOX: Object.freeze({ width: 12, height: 10 }),
    BODY_OFFSET: Object.freeze({ x: 4, y: 2 }),
    DEPTH: 9
});

export const PIRANHA_COLORS = Object.freeze({
    HEAD: 0xdd442c,
    OUTLINE: 0x7e3125,
    WHITE: 0xffffff,
    STEM: 0x2eb082,
    LEAF: 0x36e377,
    SHADOW: 0x345551
});
