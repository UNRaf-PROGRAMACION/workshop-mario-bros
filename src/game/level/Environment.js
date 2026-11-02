import { TILES, TILE_FAMILIES, TEXTURES } from '../constants/assets.js';
import { tileForColumn } from './tileLayout.js';

const TILE_SIZE = TEXTURES.TILES_SHEET.frameWidth;
const PIPE_DEPTH = 10;

const addStaticBody = (scene, solids, x, y, width, height) =>
{
    solids.add(scene.add.rectangle(x, y, width, height, 0x000000, 0));
};

const buildGround = (scene, solids, { from, to }, topY) =>
{
    const columns = (to - from) / TILE_SIZE;

    if (!Number.isInteger(columns) || columns < 1)
    {
        throw new Error(`Tramo de suelo inválido: ${from}..${to}`);
    }

    for (let index = 0; index < columns; index++)
    {
        const x = from + index * TILE_SIZE + TILE_SIZE / 2;
        const top = tileForColumn(TILE_FAMILIES.GRASS_TOP, index, columns);
        const bottom = tileForColumn(TILE_FAMILIES.DIRT_BASE, index, columns);

        scene.add.image(x, topY + TILE_SIZE / 2, top.texture, top.frame).setDepth(0);
        scene.add.image(x, topY + TILE_SIZE * 1.5, bottom.texture, bottom.frame).setDepth(0);
    }

    addStaticBody(scene, solids, from + (to - from) / 2, topY + TILE_SIZE, to - from, TILE_SIZE * 2);
};

const buildPlatform = (scene, solids, { kind, left, top, tiles }) =>
{
    const family = { wood: TILE_FAMILIES.BEIGE_PLATFORM, red: TILE_FAMILIES.RED_PLATFORM }[kind];

    if (!family)
    {
        throw new Error(`Familia de plataforma desconocida: ${kind}`);
    }

    if (!Number.isInteger(tiles) || tiles < 1)
    {
        throw new Error(`Cantidad de tiles de plataforma inválida: ${tiles}`);
    }

    // Una celda sólida: deja 36 px libres debajo para ambas formas de Mario.
    const height = TILE_SIZE;

    for (let index = 0; index < tiles; index++)
    {
        const x = left + index * TILE_SIZE + TILE_SIZE / 2;
        const topTile = tileForColumn(family, index, tiles);

        scene.add.image(x, top + TILE_SIZE / 2, topTile.texture, topTile.frame).setDepth(0);
    }

    addStaticBody(
        scene,
        solids,
        left + (tiles * TILE_SIZE) / 2,
        top + height / 2,
        tiles * TILE_SIZE,
        height
    );
};

const buildPipe = (scene, solids, { x, baseY, tiles, piranha }) =>
{
    if (tiles < 2)
    {
        throw new Error('La tubería necesita al menos 2 tiles');
    }

    const height = tiles * TILE_SIZE;
    const rim = baseY - height;

    scene.add.image(x, rim + TILE_SIZE / 2, TILES.PIPE_TOP.texture, TILES.PIPE_TOP.frame).setDepth(PIPE_DEPTH);

    for (let index = 1; index < tiles; index++)
    {
        scene.add
            .image(x, rim + TILE_SIZE / 2 + index * TILE_SIZE, TILES.PIPE_BODY.texture, TILES.PIPE_BODY.frame)
            .setDepth(PIPE_DEPTH);
    }

    addStaticBody(scene, solids, x, baseY - height / 2, TILE_SIZE, height);

    return { x, baseY, tiles, rim, piranha: Boolean(piranha) };
};

/**
 * Construye suelo, plataformas y tuberías a partir de datos declarativos.
 * Los pozos son ausencia de tramos de suelo.
 */
export const buildEnvironment = (scene, data) =>
{
    const solids = scene.physics.add.staticGroup();

    data.ground.forEach((span) => buildGround(scene, solids, span, data.groundTop));
    data.platforms.forEach((platform) => buildPlatform(scene, solids, platform));

    const pipes = data.pipes.map((pipe) => buildPipe(scene, solids, pipe));

    return { solids, pipes };
};
