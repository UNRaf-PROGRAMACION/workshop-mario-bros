import { Scene } from 'phaser';
import { TILE_SEQUENCES } from '../constants/assets.js';
import { GAME_STATE_KEY, STATE_CHANGED_EVENT } from '../state/GameState.js';

const DIGIT_Y = 8;
const LABEL_Y = 12;
const DIGIT_SIZE = 18;

const DIGITS = TILE_SEQUENCES.HUD_DIGITS_SMALL;

/**
 * HUD fijo en una escena propia, con cámara sin zoom. Observa los cambios de
 * GameState y redibuja los dígitos con los tiles 160–169.
 */
export class Hud extends Scene
{
    #scoreDigits = [];
    #coinDigits = [];
    #lifeDigits = [];

    constructor ()
    {
        super('Hud');
    }

    create ()
    {
        this.#createLabel('MARIO', 16);
        this.#scoreDigits = this.#createDigits(84, 6);

        this.#createLabel('|', 204);
        this.#createLabel('COINS', 220);
        this.#coinDigits = this.#createDigits(288, 2);

        this.#createLabel('|', 336);
        this.#createLabel('LIVES', 352);
        this.#lifeDigits = this.#createDigits(420, 2);

        this.#createLabel('|', 468);
        this.#createLabel('WORLD 1-1', 484);

        this.#render();

        this.registry.events.on(STATE_CHANGED_EVENT, this.#onStateChanged);
        this.events.once('shutdown', () =>
        {
            this.registry.events.off(STATE_CHANGED_EVENT, this.#onStateChanged);
        });
    }

    #onStateChanged = () =>
    {
        this.#render();
    };

    #render ()
    {
        const state = this.registry.get(GAME_STATE_KEY);

        if (!state)
        {
            return;
        }

        this.#renderValue(this.#scoreDigits, state.score, 6);
        this.#renderValue(this.#coinDigits, state.coins, 2);
        this.#renderValue(this.#lifeDigits, state.lives, 2);
    }

    #createLabel (text, x)
    {
        this.add.text(x, LABEL_Y, text, {
            fontFamily: 'monospace',
            fontSize: 16,
            color: '#ffffff'
        }).setOrigin(0, 0);
    }

    #createDigits (x, count)
    {
        const images = [];

        for (let index = 0; index < count; index++)
        {
            const tile = DIGITS[0];

            images.push(
                this.add.image(x + index * DIGIT_SIZE, DIGIT_Y, tile.texture, tile.frame)
                    .setOrigin(0, 0)
            );
        }

        return images;
    }

    #renderValue (images, value, padding)
    {
        const text = String(Math.max(0, value)).padStart(padding, '0').slice(-padding);

        images.forEach((image, index) =>
        {
            image.setFrame(DIGITS[Number(text[index])].frame);
        });
    }
}
