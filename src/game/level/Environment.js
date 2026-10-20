import { TILES, TILE_SEQUENCES } from '../constants/assets.js';

const TILE_SIZE = 18;
const PIPE_DEPTH = 10;

const frameFor = (index, count, frames) =>
{
    if (count === 1 || index === 0)
    {
        return frames[0];
    }

    if (index === count - 1)
    {
        return frames[3];
    }

    return index % 2 === 0 ? frames[1] : frames[2];
};

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

    const topFrames = TILE_SEQUENCES.GRASS_GROUND.slice(0, 4);
    const bottomFrames = TILE_SEQUENCES.GRASS_GROUND.slice(4);

    for (let index = 0; index < columns; index++)
    {
        const x = from + index * TILE_SIZE + TILE_SIZE / 2;
        const top = frameFor(index, columns, topFrames);
        const bottom = frameFor(index, columns, bottomFrames);

        scene.add.image(x, topY + TILE_SIZE / 2, top.texture, top.frame).setDepth(0);
        scene.add.image(x, topY + TILE_SIZE * 1.5, bottom.texture, bottom.frame).setDepth(0);
    }

    addStaticBody(scene, solids, from + (to - from) / 2, topY + TILE_SIZE, to - from, TILE_SIZE * 2);
};

const buildPlatform = (scene, solids, { kind, left, top, tiles }) =>
{
    const isWood = kind === 'wood';
    const frames = isWood ? TILE_SEQUENCES.WOOD_PLATFORM : TILE_SEQUENCES.RED_PLATFORM;
    const topFrames = isWood ? frames.slice(0, 4) : frames;
    const bottomFrames = isWood ? frames.slice(4) : null;
    const height = TILE_SIZE * (isWood ? 2 : 1);

    for (let index = 0; index < tiles; index++)
    {
        const x = left + index * TILE_SIZE + TILE_SIZE / 2;
        const topTile = frameFor(index, tiles, topFrames);

        scene.add.image(x, top + TILE_SIZE / 2, topTile.texture, topTile.frame).setDepth(0);

        if (bottomFrames)
        {
            const bottomTile = frameFor(index, tiles, bottomFrames);

            scene.add.image(x, top + TILE_SIZE * 1.5, bottomTile.texture, bottomTile.frame).setDepth(0);
        }
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

const buildPipe = (scene, solids, { x, baseY, tiles }) =>
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
    data.pipes.forEach((pipe) => buildPipe(scene, solids, pipe));

    return solids;
};
