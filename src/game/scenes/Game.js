import { Input, Scene } from 'phaser';
import { Mario, MARIO_DAMAGED_EVENT } from '../entities/Mario.js';
import { buildEnvironment } from '../level/Environment.js';
import { TEST_ENVIRONMENT } from '../level/testEnvironment.js';
import { GAME_OVER_EVENT, GAME_STATE_KEY } from '../state/GameState.js';

const SKY_COLOR = 0x5c94fc;
const MARIO_START = Object.freeze({ x: 100, y: 640 });
const WORLD_WIDTH = 1024;
const WORLD_HEIGHT = 768;
const HUD_MARGIN = 24;

/**
 * Nivel esqueleto de la spec 011: entorno declarativo (suelo, plataformas,
 * tuberías y pozos), Mario y HUD. Las entidades de otras specs se integran
 * en el layout de la spec 012.
 */
export class Game extends Scene
{
    #mario;
    #cursors;
    #keys;
    #hudText;
    #handlingDeath = false;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const state = this.registry.get(GAME_STATE_KEY);

        this.#handlingDeath = false;
        this.cameras.main.setBackgroundColor(SKY_COLOR);
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        const solids = buildEnvironment(this, TEST_ENVIRONMENT);

        this.#mario = new Mario(this, MARIO_START.x, MARIO_START.y);
        this.#mario.on(MARIO_DAMAGED_EVENT, (payload) => this.#handleMarioDamaged(payload));

        this.physics.add.collider(this.#mario, solids);

        this.#cursors = this.input.keyboard.createCursorKeys();
        this.#keys = this.input.keyboard.addKeys({ left: 'A', right: 'D', jump: 'W' });

        this.#createHud(state);
    }

    update (time, delta)
    {
        if (this.#handlingDeath)
        {
            return;
        }

        if (this.#mario.y > TEST_ENVIRONMENT.deathY)
        {
            this.#mario.die();
            return;
        }

        const jumpPressed = Input.Keyboard.JustDown(this.#cursors.space)
            || Input.Keyboard.JustDown(this.#cursors.up)
            || Input.Keyboard.JustDown(this.#keys.jump);

        this.#mario.update({
            left: this.#cursors.left.isDown || this.#keys.left.isDown,
            right: this.#cursors.right.isDown || this.#keys.right.isDown,
            jumpPressed
        }, delta);
    }

    #handleMarioDamaged ({ fatal })
    {
        if (!fatal || this.#handlingDeath)
        {
            return;
        }

        this.#handlingDeath = true;

        const state = this.registry.get(GAME_STATE_KEY);
        const lives = state.loseLife();

        this.#updateHud(state);
        console.info(`[game] vida perdida · vidas restantes: ${lives}`);

        if (lives <= 0)
        {
            console.info('[game] game over');
            this.game.events.emit(GAME_OVER_EVENT);
            this.scene.pause();
            return;
        }

        this.scene.restart();
    }

    #createHud (state)
    {
        this.#hudText = this.add.text(HUD_MARGIN, HUD_MARGIN, this.#formatHud(state), {
            fontFamily: 'monospace',
            fontSize: 20,
            color: '#ffffff'
        }).setScrollFactor(0);
    }

    #updateHud (state)
    {
        this.#hudText.setText(this.#formatHud(state));
    }

    #formatHud (state)
    {
        return [
            `MARIO ${String(state.score).padStart(6, '0')}`,
            `COINS ${String(state.coins).padStart(2, '0')}`,
            `LIVES ${String(state.lives).padStart(2, '0')}`,
            `WORLD ${state.world}`
        ].join('   ');
    }
}
