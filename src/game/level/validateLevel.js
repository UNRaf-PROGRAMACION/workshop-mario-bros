import { HITBOXES, TEXTURES } from '../constants/assets.js';
import { MARIO_MOVEMENT } from '../constants/movement.js';

const TILE_SIZE = TEXTURES.TILES_SHEET.frameWidth;
const jumpHeight = MARIO_MOVEMENT.JUMP_VELOCITY ** 2 / (2 * MARIO_MOVEMENT.GRAVITY_RISING);
const flightTime = Math.abs(MARIO_MOVEMENT.JUMP_VELOCITY) / MARIO_MOVEMENT.GRAVITY_RISING
    + Math.sqrt(2 * jumpHeight / MARIO_MOVEMENT.GRAVITY_FALLING);

/** Límites conservadores locales, no una prueba de completabilidad del nivel. */
export const LEVEL_DESIGN_LIMITS = Object.freeze({
    maxStepRise: Math.floor((jumpHeight - TILE_SIZE / 2) / TILE_SIZE) * TILE_SIZE,
    minHeadroom: HITBOXES.MARIO_SUPER.height + TILE_SIZE / 2,
    minRunway: HITBOXES.MARIO_SUPER.width + TILE_SIZE,
    maxRunningPit: Math.floor((MARIO_MOVEMENT.MAX_SPEED * flightTime - TILE_SIZE / 2) / TILE_SIZE) * TILE_SIZE
});

/** Audita el contrato geométrico de World 1-1; no simula saltos ni enemigos. */
export const validateLevelGeometry = (level) =>
{
    const issues = [];
    const add = (code, location) => issues.push({ code, location });

    level.platforms.forEach((platform, index) =>
    {
        const location = `platforms[${index}]`;
        const right = platform.left + platform.tiles * TILE_SIZE;
        const clearance = level.groundTop - platform.top - TILE_SIZE;

        if (!Number.isInteger(platform.tiles) || platform.tiles < (platform.kind === 'red' ? 2 : 1)
            || platform.left < 0 || right > level.width
            || platform.left % TILE_SIZE !== 0 || platform.top % TILE_SIZE !== 0)
        {
            add('invalid-platform-grid', location);
        }

        if (level.groundTop - platform.top > LEVEL_DESIGN_LIMITS.maxStepRise)
        {
            add('unreachable-platform', location);
        }

        if (clearance < LEVEL_DESIGN_LIMITS.minHeadroom)
        {
            add('insufficient-headroom', location);
        }

        level.pipes.forEach((pipe, pipeIndex) =>
        {
            const gap = pipe.x - TILE_SIZE / 2 - right;

            if (gap >= 0 && gap < LEVEL_DESIGN_LIMITS.minRunway)
            {
                add('insufficient-runway', `${location} -> pipes[${pipeIndex}]`);
            }
        });
    });

    level.pipes.forEach((pipe, index) =>
    {
        if (!Number.isInteger(pipe.tiles) || pipe.tiles < 2
            || pipe.x - TILE_SIZE / 2 < 0 || pipe.x + TILE_SIZE / 2 > level.width)
        {
            add('invalid-pipe', `pipes[${index}]`);
        }

        if (pipe.tiles * TILE_SIZE > LEVEL_DESIGN_LIMITS.maxStepRise)
        {
            add('unreachable-pipe', `pipes[${index}]`);
        }
    });

    level.ground.forEach((span, index) =>
    {
        if (span.from < 0 || span.to > level.width || span.to <= span.from
            || span.from % TILE_SIZE !== 0 || span.to % TILE_SIZE !== 0)
        {
            add('invalid-ground', `ground[${index}]`);
        }

        if (index > 0)
        {
            const gap = span.from - level.ground[index - 1].to;

            if (gap < 0 || gap > LEVEL_DESIGN_LIMITS.maxRunningPit)
            {
                add('unsafe-ground-gap', `ground[${index - 1}] -> ground[${index}]`);
            }
        }
    });

    return issues;
};
