import { TILES, TEXTURES } from '../constants/assets.js';

const TILE_SIZE = TEXTURES.TILES_SHEET.frameWidth;
const GOAL_DEPTH = 1;

/** Poste y bandera con overlaps por celda; emite la llegada una sola vez. */
export class GoalPole
{
    #reached = false;

    constructor (scene, { x, baseY, height }, mario, onReached)
    {
        const parts = scene.physics.add.staticGroup();

        const addPart = (partX, partY, tile) =>
        {
            parts.create(partX, partY, tile.texture, tile.frame).setDepth(GOAL_DEPTH);
        };

        for (let index = 0; index < height; index++)
        {
            const tile = index === 0
                ? TILES.GOAL_POLE_BASE
                : index === 1
                    ? TILES.GOAL_POLE_MIDDLE
                    : TILES.GOAL_POLE_SEGMENT;

            addPart(x, baseY - TILE_SIZE / 2 - index * TILE_SIZE, tile);
        }

        const topY = baseY - height * TILE_SIZE;

        addPart(x + TILE_SIZE, topY + TILE_SIZE / 2, TILES.FLAG);

        scene.physics.add.overlap(mario, parts, () =>
        {
            if (this.#reached)
            {
                return;
            }

            this.#reached = true;
            onReached();
        });
    }
}
