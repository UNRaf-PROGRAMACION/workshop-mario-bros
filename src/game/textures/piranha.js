import { PIRANHA, PIRANHA_COLORS } from '../constants/piranha.js';

export const PIRANHA_TEXTURES = Object.freeze({
    OPEN: 'piranha_open',
    CLOSED: 'piranha_closed'
});

/** Anchos de las 14 filas de la cabeza, de arriba hacia abajo (GDD §2.6). */
const HEAD_ROWS = Object.freeze([6, 10, 12, 14, 14, 16, 16, 16, 16, 14, 14, 12, 10, 6]);

const drawTexture = (scene, key, mouthHeight) =>
{
    if (scene.textures.exists(key))
    {
        return;
    }

    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    const centerX = PIRANHA.CANVAS_WIDTH / 2;

    HEAD_ROWS.forEach((width, y) =>
    {
        const x = centerX - width / 2;

        graphics.fillStyle(PIRANHA_COLORS.OUTLINE, 1);
        graphics.fillRect(x, y, width, 1);
        graphics.fillStyle(PIRANHA_COLORS.HEAD, 1);
        graphics.fillRect(x + 1, y, width - 2, 1);
    });

    graphics.fillStyle(PIRANHA_COLORS.WHITE, 1);
    graphics.fillRect(4, 4, 2, 2);
    graphics.fillRect(14, 4, 2, 2);

    // Boca: banda blanca y dientes del color de la cabeza.
    graphics.fillStyle(PIRANHA_COLORS.WHITE, 1);
    graphics.fillRect(5, 8, 10, mouthHeight);

    graphics.fillStyle(PIRANHA_COLORS.HEAD, 1);
    [6, 10, 14].forEach((x) => graphics.fillRect(x, 8, 2, 2));

    if (mouthHeight === 4)
    {
        [8, 12].forEach((x) => graphics.fillRect(x, 10, 2, 2));
    }

    graphics.fillStyle(PIRANHA_COLORS.STEM, 1);
    graphics.fillRect(8, 14, 4, 20);

    graphics.fillStyle(PIRANHA_COLORS.SHADOW, 1);
    graphics.fillRect(8, 14, 1, 20);

    graphics.fillStyle(PIRANHA_COLORS.LEAF, 1);
    [20, 26].forEach((y) =>
    {
        graphics.fillRect(0, y, 6, 3);
        graphics.fillRect(14, y, 6, 3);
    });

    graphics.fillStyle(PIRANHA_COLORS.SHADOW, 1);
    [22, 28].forEach((y) =>
    {
        graphics.fillRect(0, y, 6, 1);
        graphics.fillRect(14, y, 6, 1);
    });

    graphics.generateTexture(key, PIRANHA.CANVAS_WIDTH, PIRANHA.CANVAS_HEIGHT);
    graphics.destroy();

    console.info(`[piranha] texture ${key} ${PIRANHA.CANVAS_WIDTH}×${PIRANHA.CANVAS_HEIGHT}`);
};

export const createPiranhaTextures = (scene) =>
{
    drawTexture(scene, PIRANHA_TEXTURES.OPEN, 4);
    drawTexture(scene, PIRANHA_TEXTURES.CLOSED, 2);
};
