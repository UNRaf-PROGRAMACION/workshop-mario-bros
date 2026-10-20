import { Input, Scene } from 'phaser';
import { Coin, COIN_COLLECTED_EVENT } from '../entities/Coin.js';
import { Mushroom, MUSHROOM_COLLECTED_EVENT } from '../entities/Mushroom.js';
import { BLOCK_TYPES, createBlock } from '../entities/blocks/createBlock.js';
import { Mario, MARIO_DAMAGED_EVENT } from '../entities/Mario.js';
import { GAME_OVER_EVENT, GAME_STATE_KEY } from '../state/GameState.js';

const SKY_COLOR = 0x5c94fc;
const GROUND_COLOR = 0x8b5a2b;
const GROUND_TOP = 700;
const GROUND_HEIGHT = 18;
const BLOCK_Y = 660;
const SIDE_BLOCK = Object.freeze({ x: 720, y: 690 });
const COIN_SPOTS = Object.freeze([
    Object.freeze({ x: 350, y: 680 }),
    Object.freeze({ x: 420, y: 680 }),
    Object.freeze({ x: 490, y: 680 })
]);
const MARIO_START = Object.freeze({ x: 100, y: 640 });
const WORLD_WIDTH = 1024;
const WORLD_HEIGHT = 768;
const HUD_MARGIN = 24;

/**
 * Escenario esqueleto de la spec 006: un bloque de cada tipo, un hongo de
 * prueba y un bloque lateral. El layout real corresponde a la spec 012.
 */
export class Game extends Scene
{
    #solids;
    #blocks;
    #mario;
    #cursors;
    #keys;
    #hudText;
    #mushrooms = [];
    #handlingDeath = false;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const state = this.registry.get(GAME_STATE_KEY);

        this.#handlingDeath = false;
        this.#mushrooms = [];
        this.cameras.main.setBackgroundColor(SKY_COLOR);
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        this.#createGround();
        this.#createBlocks();

        this.#mario = new Mario(this, MARIO_START.x, MARIO_START.y);
        this.#mario.on(MARIO_DAMAGED_EVENT, (payload) => this.#handleMarioDamaged(payload));

        this.physics.add.collider(this.#mario, this.#solids);
        this.physics.add.collider(this.#mario, this.#blocks, (mario, block) =>
        {
            if (mario.body.touching.up)
            {
                block.hit(mario);
            }
        });

        this.#createCoins();

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

        const jumpPressed = Input.Keyboard.JustDown(this.#cursors.space)
            || Input.Keyboard.JustDown(this.#cursors.up)
            || Input.Keyboard.JustDown(this.#keys.jump);

        this.#mario.update({
            left: this.#cursors.left.isDown || this.#keys.left.isDown,
            right: this.#cursors.right.isDown || this.#keys.right.isDown,
            jumpPressed
        }, delta);

        this.#mushrooms = this.#mushrooms.filter((mushroom) => mushroom.active);
        this.#mushrooms.forEach((mushroom) => mushroom.update());
    }

    #createGround ()
    {
        this.#solids = this.physics.add.staticGroup();
        this.#solids.add(this.add.rectangle(
            WORLD_WIDTH / 2,
            GROUND_TOP + GROUND_HEIGHT / 2,
            WORLD_WIDTH,
            GROUND_HEIGHT,
            GROUND_COLOR
        ));
    }

    #createBlocks ()
    {
        this.#blocks = this.physics.add.staticGroup();

        this.#addBlock(BLOCK_TYPES.HARD, 300, BLOCK_Y);
        this.#addBlock(BLOCK_TYPES.BRICK, 380, BLOCK_Y);
        this.#addBlock(BLOCK_TYPES.QUESTION, 460, BLOCK_Y);
        this.#addBlock(BLOCK_TYPES.EMPTY, 540, BLOCK_Y);
        this.#addBlock(BLOCK_TYPES.QUESTION, 620, BLOCK_Y);
        this.#addBlock(BLOCK_TYPES.HARD, SIDE_BLOCK.x, SIDE_BLOCK.y);
    }

    #addBlock (type, x, y)
    {
        const block = createBlock(this, type, x, y, {
            onRelease: (releaseX, releaseY) => this.#createMushroom(releaseX, releaseY)
        });

        this.#blocks.add(block);
    }

    #createMushroom (x, y)
    {
        const mushroom = new Mushroom(this, x, y);

        this.#mushrooms.push(mushroom);

        this.physics.add.collider(mushroom, this.#solids);
        this.physics.add.collider(mushroom, this.#blocks);
        mushroom.on(MUSHROOM_COLLECTED_EVENT, () =>
        {
            this.#mario.grow();
            console.info('[mushroom] collected');
        });
        this.physics.add.overlap(this.#mario, mushroom, () => mushroom.collect());
    }

    #createCoins ()
    {
        COIN_SPOTS.forEach(({ x, y }) =>
        {
            const coin = new Coin(this, x, y);

            coin.on(COIN_COLLECTED_EVENT, () => this.#collectCoin());
            this.physics.add.overlap(this.#mario, coin, () => coin.collect());
        });
    }

    #collectCoin ()
    {
        const state = this.registry.get(GAME_STATE_KEY);

        state.addCoin();
        this.#updateHud(state);

        console.info(`[coin] collected · coins ${state.coins} · score ${state.score}`);
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
