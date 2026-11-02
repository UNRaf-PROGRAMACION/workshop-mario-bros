import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { TILE_FAMILIES } from '../src/game/constants/assets.js';
import { tileForColumn } from '../src/game/level/tileLayout.js';

const frames = (family, columns) => Array.from({ length: columns }, (_, index) =>
    tileForColumn(family, index, columns).frame);

test('suelo profundo: superficie sin cierres interiores y base sin pasto', () =>
{
    assert.deepEqual(frames(TILE_FAMILIES.GRASS_TOP, 1), [20]);
    assert.deepEqual(frames(TILE_FAMILIES.GRASS_TOP, 2), [21, 23]);
    assert.deepEqual(frames(TILE_FAMILIES.GRASS_TOP, 4), [21, 22, 22, 23]);
    assert.deepEqual(frames(TILE_FAMILIES.DIRT_BASE, 1), [140]);
    assert.deepEqual(frames(TILE_FAMILIES.DIRT_BASE, 4), [141, 142, 142, 143]);
});

test('plataforma beige cerrada y roja con sus extremos reales', () =>
{
    assert.deepEqual(frames(TILE_FAMILIES.BEIGE_PLATFORM, 1), [40]);
    assert.deepEqual(frames(TILE_FAMILIES.BEIGE_PLATFORM, 4), [41, 42, 42, 43]);
    assert.deepEqual(frames(TILE_FAMILIES.RED_PLATFORM, 2), [14, 15]);
    assert.deepEqual(frames(TILE_FAMILIES.RED_PLATFORM, 4), [14, 12, 13, 15]);
    assert.throws(() => frames(TILE_FAMILIES.RED_PLATFORM, 1), /no tiene tile aislado/);
});

test('nubes: aislada o compuesta, sin pieza extra al final', () =>
{
    assert.deepEqual(frames(TILE_FAMILIES.CLOUD, 1), [156]);
    assert.deepEqual(frames(TILE_FAMILIES.CLOUD, 2), [153, 155]);
    assert.deepEqual(frames(TILE_FAMILIES.CLOUD, 4), [153, 154, 154, 155]);
});

test('rechaza índices y cantidades fuera de la grilla', () =>
{
    for (const [index, columns] of [[0, 0], [0, 1.5], [-1, 4], [4, 4], [0.5, 4]])
    {
        assert.throws(() => tileForColumn(TILE_FAMILIES.CLOUD, index, columns), /Columna inválida/);
    }
});

test('atlas fuente y runtime coinciden y conservan las celdas completas', () =>
{
    const source = readFileSync(new URL('../assets/tilemap_packed.png', import.meta.url));
    const runtime = readFileSync(new URL('../public/assets/tilemap_packed.png', import.meta.url));

    assert.ok(source.equals(runtime));
    assert.equal(source.readUInt32BE(16), 20 * 18);
    assert.equal(source.readUInt32BE(20), 9 * 18);
});
