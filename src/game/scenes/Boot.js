import { Scene } from 'phaser';
import { ANIMATIONS, TEXTURES } from '../constants/assets.js';
import { GAME_STATE_KEY, GameState } from '../state/GameState.js';
import { createPiranhaTextures } from '../textures/piranha.js';

/**
 * Primera escena: carga las hojas una sola vez, inicializa la partida y cede
 * el control al menú. No tiene contenido visible.
 */
export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.setPath('assets');

        Object.values(TEXTURES).forEach((sheet) =>
        {
            this.load.spritesheet(sheet.key, sheet.file, {
                frameWidth: sheet.frameWidth,
                frameHeight: sheet.frameHeight
            });
        });
    }

    create ()
    {
        createPiranhaTextures(this);
        this.#createAnimations();
        this.registry.set(GAME_STATE_KEY, new GameState());
        this.scene.start('MainMenu');
    }

    #createAnimations ()
    {
        Object.values(ANIMATIONS).forEach((animation) =>
        {
            if (this.anims.exists(animation.key))
            {
                return;
            }

            this.anims.create({
                key: animation.key,
                frames: this.anims.generateFrameNumbers(animation.texture, { frames: animation.frames }),
                frameRate: animation.frameRate,
                repeat: animation.repeat
            });
        });
    }
}
