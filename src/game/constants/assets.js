/**
 * Referencias de assets del GDD §2.
 *
 * Los frames son índices de celda de cada hoja y los rects se derivan con la
 * fórmula de §2.2, de modo que ninguna escena repita índices ni coordenadas.
 * Cualquier elemento nuevo del GDD debe agregarse acá, no en la escena.
 */

export const TEXTURES = Object.freeze({
    TILES_SHEET: Object.freeze({
        key: 'tiles',
        file: 'tilemap_packed.png',
        frameWidth: 18,
        frameHeight: 18,
        columns: 20,
        frameCount: 180
    }),
    CHARACTERS_SHEET: Object.freeze({
        key: 'characters',
        file: 'tilemap-characters_packed.png',
        frameWidth: 24,
        frameHeight: 24,
        columns: 9,
        frameCount: 27
    })
});

export const ORIGINS = Object.freeze({
    BOTTOM_CENTER: Object.freeze({ x: 0.5, y: 1 })
});

export const HITBOXES = Object.freeze({
    MARIO_SMALL: Object.freeze({ width: 16, height: 22 }),
    MARIO_SUPER: Object.freeze({ width: 20, height: 26 }),
    GOOMBA: Object.freeze({ width: 16, height: 14 }),
    PIRANHA_PLANT: Object.freeze({ width: 12, height: 10 }),
    BLOCK: Object.freeze({ width: 16, height: 14 }),
    COIN: Object.freeze({ width: 14, height: 14 })
});

const rectFor = (sheet, frame) => Object.freeze({
    x: (frame % sheet.columns) * sheet.frameWidth,
    y: Math.floor(frame / sheet.columns) * sheet.frameHeight,
    width: sheet.frameWidth,
    height: sheet.frameHeight
});

const frameData = (sheet, frame) => Object.freeze({
    texture: sheet.key,
    frame,
    rect: rectFor(sheet, frame)
});

const sequence = (sheet, frames) => Object.freeze(frames.map((frame) => frameData(sheet, frame)));

const character = ({ frames, hitbox, origin = ORIGINS.BOTTOM_CENTER, scale = 1, sheet = TEXTURES.CHARACTERS_SHEET }) => Object.freeze({
    texture: sheet ? sheet.key : null,
    frames: Object.freeze([...frames]),
    rects: sheet ? Object.freeze(frames.map((frame) => rectFor(sheet, frame))) : Object.freeze([]),
    origin,
    hitbox,
    scale
});

/** Tiles individuales del escenario, objetos y HUD (§2.5). */
export const TILES = Object.freeze({
    HARD_BLOCK: frameData(TEXTURES.TILES_SHEET, 11),
    QUESTION_BLOCK: frameData(TEXTURES.TILES_SHEET, 10),
    EMPTY_BLOCK: frameData(TEXTURES.TILES_SHEET, 9),
    BRICK_BLOCK: frameData(TEXTURES.TILES_SHEET, 29),
    COIN: frameData(TEXTURES.TILES_SHEET, 151),
    SUPER_MUSHROOM: frameData(TEXTURES.TILES_SHEET, 128),
    PIPE_TOP: frameData(TEXTURES.TILES_SHEET, 95),
    PIPE_BODY: frameData(TEXTURES.TILES_SHEET, 115),
    GOAL_POLE_SEGMENT: frameData(TEXTURES.TILES_SHEET, 32),
    GOAL_POLE_MIDDLE: frameData(TEXTURES.TILES_SHEET, 52),
    GOAL_POLE_BASE: frameData(TEXTURES.TILES_SHEET, 72),
    FLAG: frameData(TEXTURES.TILES_SHEET, 85)
});

/** Secuencias consecutivas del escenario, objetos y HUD (§2.5). */
export const TILE_SEQUENCES = Object.freeze({
    GRASS_GROUND: sequence(TEXTURES.TILES_SHEET, [0, 1, 2, 3, 20, 21, 22, 23]),
    DIRT_GROUND: sequence(TEXTURES.TILES_SHEET, [120, 121, 122, 123, 140, 141, 142, 143]),
    WOOD_PLATFORM: sequence(TEXTURES.TILES_SHEET, [40, 41, 42, 43, 60, 61, 62, 63]),
    RED_PLATFORM: sequence(TEXTURES.TILES_SHEET, [12, 13, 14, 15]),
    CLOUD: sequence(TEXTURES.TILES_SHEET, [153, 154, 155, 156]),
    HUD_DIGITS_SMALL: sequence(TEXTURES.TILES_SHEET, [160, 161, 162, 163, 164, 165, 166, 167, 168, 169]),
    HUD_DIGITS_LARGE: sequence(TEXTURES.TILES_SHEET, [170, 171, 172, 173, 174, 175, 176, 177, 178, 179])
});

/** Personajes y enemigos (§2.4). Piranha Plant no tiene asset: su textura se genera en 010. */
export const CHARACTERS = Object.freeze({
    SMALL_MARIO: character({ frames: [0, 1], hitbox: HITBOXES.MARIO_SMALL }),
    SUPER_MARIO: character({ frames: [0, 1], hitbox: HITBOXES.MARIO_SUPER, scale: 1.5 }),
    MARIO_IDLE: character({ frames: [0], hitbox: HITBOXES.MARIO_SMALL }),
    MARIO_JUMP: character({ frames: [1], hitbox: HITBOXES.MARIO_SMALL }),
    GOOMBA: character({ frames: [18, 19, 20], hitbox: HITBOXES.GOOMBA }),
    GOOMBA_FLATTENED: character({ frames: [18], hitbox: HITBOXES.GOOMBA }),
    PIRANHA_PLANT: character({ sheet: null, frames: [], hitbox: HITBOXES.PIRANHA_PLANT })
});

/** Animaciones de §2.4. Las que el pack no trae se resuelven con frame congelado. */
export const ANIMATIONS = Object.freeze({
    MARIO_WALK: Object.freeze({
        key: 'mario_walk',
        texture: CHARACTERS.SMALL_MARIO.texture,
        frames: CHARACTERS.SMALL_MARIO.frames,
        frameRate: 10,
        repeat: -1
    }),
    GOOMBA_WALK: Object.freeze({
        key: 'goomba_walk',
        texture: CHARACTERS.GOOMBA.texture,
        frames: CHARACTERS.GOOMBA.frames,
        frameRate: 8,
        repeat: -1
    })
});
