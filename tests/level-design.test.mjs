import assert from 'node:assert/strict';
import { test } from 'node:test';
import { WORLD_1_1 } from '../src/game/level/world11.js';
import { LEVEL_DESIGN_LIMITS, validateLevelGeometry } from '../src/game/level/validateLevel.js';

test('World 1-1 respeta los límites geométricos locales', () =>
{
    assert.deepEqual(validateLevelGeometry(WORLD_1_1), []);
    assert.equal(LEVEL_DESIGN_LIMITS.maxStepRise, 54);
    assert.equal(LEVEL_DESIGN_LIMITS.maxRunningPit, 36);
    assert.equal(WORLD_1_1.pipes[1].x - 9
        - (WORLD_1_1.platforms[1].left + WORLD_1_1.platforms[1].tiles * 18), 45);
});

test('la geometría anterior reproduce la plataforma inalcanzable y el despegue bloqueado', () =>
{
    const previous = structuredClone(WORLD_1_1);

    previous.platforms[1].left = 900;
    previous.platforms[1].top = 180;
    const codes = validateLevelGeometry(previous).map((issue) => issue.code);

    assert.ok(codes.includes('unreachable-platform'));
    assert.ok(codes.includes('insufficient-runway'));
});

test('detecta techos bajos, grilla rota, pozos excesivos y tuberías demasiado altas', () =>
{
    const invalid = structuredClone(WORLD_1_1);

    invalid.platforms[0].top = 234;
    invalid.platforms[2].left += 1;
    invalid.ground[1].from += 18;
    invalid.pipes[0].tiles = 4;
    const codes = validateLevelGeometry(invalid).map((issue) => issue.code);

    for (const code of ['insufficient-headroom', 'invalid-platform-grid', 'unsafe-ground-gap', 'unreachable-pipe'])
    {
        assert.ok(codes.includes(code), code);
    }
});

test('mantiene dimensiones, peligros y contenido del nivel integrado', () =>
{
    assert.equal(WORLD_1_1.width, 3780);
    assert.equal(WORLD_1_1.ground.length - 1, 3);
    assert.equal(WORLD_1_1.platforms.length, 5);
    assert.equal(WORLD_1_1.pipes.length, 4);
    assert.equal(WORLD_1_1.goombas.length, 7);
    assert.equal(WORLD_1_1.coins.length, 27);
});
