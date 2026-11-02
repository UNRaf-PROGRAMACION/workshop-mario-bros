import { Input, Scene } from 'phaser';
import { TILE_FAMILIES, TEXTURES } from '../constants/assets.js';
import { GOOMBA } from '../constants/goombas.js';
import { Coin, COIN_COLLECTED_EVENT } from '../entities/Coin.js';
import { Goomba } from '../entities/Goomba.js';
import { GoalPole } from '../entities/GoalPole.js';
import { Mushroom, MUSHROOM_COLLECTED_EVENT } from '../entities/Mushroom.js';
import { PiranhaPlant } from '../entities/PiranhaPlant.js';
import { BLOCK_TYPES, createBlock } from '../entities/blocks/createBlock.js';
import { Mario, MARIO_DAMAGED_EVENT } from '../entities/Mario.js';
import { buildEnvironment } from '../level/Environment.js';
import { WORLD_1_1 } from '../level/world11.js';
import { tileForColumn } from '../level/tileLayout.js';
import { GAME_OVER_EVENT, GAME_STATE_KEY, STATE_CHANGED_EVENT } from '../state/GameState.js';

const SKY_COLOR = 0x5c94fc;
const CAMERA_ZOOM = 3;
const CAMERA_LERP = 0.1;
const CLOUD_DEPTH = -1;
const LEVEL_STATES = Object.freeze({
    PLAYING: 'playing',
    DYING: 'dying',
    COMPLETED: 'completed'
});

/**
 * World 1-1 (spec 012): nivel completo con cámara, entorno, bloques, monedas,
 * hongos, Goombas, Piranha Plants y Goal Pole con final de nivel.
 */
export class Game extends Scene
{
    #solids;
    #blocks;
    #mario;
    #cursors;
    #keys;
    #mushrooms = [];
    #goombas = [];
    #levelState = LEVEL_STATES.PLAYING;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.#levelState = LEVEL_STATES.PLAYING;
        this.#mushrooms = [];
        this.#goombas = [];

        this.cameras.main.setBackgroundColor(SKY_COLOR);
        this.physics.world.setBounds(0, 0, WORLD_1_1.width, WORLD_1_1.height + 100);

        const environment = buildEnvironment(this, WORLD_1_1);

        this.#solids = environment.solids;
        this.#createBlocks();

        this.#mario = new Mario(this, this.#resolveStartX(), WORLD_1_1.marioStart.y);
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
        this.#createGoombas();
        this.#createPiranhas(environment.pipes);
        this.#createClouds();
        this.#createGoal();

        const camera = this.cameras.main;

        camera.setBounds(0, 0, WORLD_1_1.width, WORLD_1_1.height);
        camera.setZoom(CAMERA_ZOOM);
        camera.startFollow(this.#mario, true, CAMERA_LERP, CAMERA_LERP);

        this.#cursors = this.input.keyboard.createCursorKeys();
        this.#keys = this.input.keyboard.addKeys({ left: 'A', right: 'D', jump: 'W' });

        this.scene.launch('Hud');
        this.scene.bringToTop('Hud');
        this.events.once('shutdown', () => this.scene.stop('Hud'));
    }

    update (time, delta)
    {
        if (this.#levelState !== LEVEL_STATES.PLAYING)
        {
            return;
        }

        if (this.#mario.y > WORLD_1_1.deathY)
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

        this.#mushrooms = this.#mushrooms.filter((mushroom) => mushroom.active);
        this.#mushrooms.forEach((mushroom) => mushroom.update());

        this.#goombas = this.#goombas.filter((goomba) => goomba.active);
        this.#goombas.forEach((goomba) => goomba.update());
    }

    #resolveStartX ()
    {
        if (!import.meta.env.DEV)
        {
            return WORLD_1_1.marioStart.x;
        }

        const value = Number(new URLSearchParams(window.location.search).get('startX'));

        return Number.isFinite(value) && value > 0 ? value : WORLD_1_1.marioStart.x;
    }

    #createBlocks ()
    {        this.#blocks = this.physics.add.staticGroup();

        WORLD_1_1.blocks.forEach(({ type, x, y }) =>
        {
            const block = createBlock(this, type, x, y, {
                onRelease: (releaseX, releaseY) => this.#createMushroom(releaseX, releaseY)
            });

            this.#blocks.add(block);
        });
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
        WORLD_1_1.coins.forEach(({ x, y }) =>
        {
            const coin = new Coin(this, x, y);

            coin.on(COIN_COLLECTED_EVENT, () =>
            {
                const state = this.registry.get(GAME_STATE_KEY);

                state.addCoin();
                this.registry.events.emit(STATE_CHANGED_EVENT, state);
                console.info(`[coin] collected · coins ${state.coins} · score ${state.score}`);
            });
            this.physics.add.overlap(this.#mario, coin, () => coin.collect());
        });
    }

    #createGoombas ()
    {
        WORLD_1_1.goombas.forEach(({ x, y }) =>
        {
            const goomba = new Goomba(this, x, y);

            this.#goombas.push(goomba);
            this.physics.add.collider(goomba, this.#solids);
            this.physics.add.collider(goomba, this.#blocks);
            this.physics.add.overlap(this.#mario, goomba, () => this.#handleGoombaContact(goomba));
        });
    }

    #createPiranhas (pipes)
    {
        pipes.filter((pipe) => pipe.piranha).forEach((pipe) =>
        {
            const plant = new PiranhaPlant(this, pipe.x, pipe.rim);

            this.physics.add.overlap(this.#mario, plant, () => this.#mario.takeDamage());
        });
    }

    #createClouds ()
    {
        WORLD_1_1.clouds.forEach(({ x, y, tiles = 3 }) =>
        {
            for (let index = 0; index < tiles; index++)
            {
                const tile = tileForColumn(TILE_FAMILIES.CLOUD, index, tiles);

                this.add.image(x + index * TEXTURES.TILES_SHEET.frameWidth, y, tile.texture, tile.frame)
                    .setDepth(CLOUD_DEPTH);
            }
        });
    }

    #createGoal ()
    {
        new GoalPole(this, WORLD_1_1.goal, this.#mario, () => this.#completeLevel());
    }

    #completeLevel ()
    {
        if (this.#levelState !== LEVEL_STATES.PLAYING)
        {
            return;
        }

        this.#levelState = LEVEL_STATES.COMPLETED;
        this.#mario.freeze();
        this.physics.pause();
        console.info('[game] nivel completado');
        this.scene.launch('LevelComplete');
        this.scene.pause();
    }

    #handleGoombaContact (goomba)
    {
        if (goomba.isSquashed)
        {
            return;
        }

        const body = this.#mario.body;
        const falling = body.velocity.y > 0;
        const previousBottom = body.prev.y + body.height;
        const aboveCenter = previousBottom <= goomba.body.center.y;

        if (falling && aboveCenter)
        {
            goomba.squash();
            this.#mario.bounce(GOOMBA.STOMP_BOUNCE);
            console.info('[goomba] stomped');
            return;
        }

        this.#mario.takeDamage();
    }

    #handleMarioDamaged ({ fatal })
    {
        if (!fatal || this.#levelState !== LEVEL_STATES.PLAYING)
        {
            return;
        }

        this.#levelState = LEVEL_STATES.DYING;

        const state = this.registry.get(GAME_STATE_KEY);
        const lives = state.loseLife();

        this.registry.events.emit(STATE_CHANGED_EVENT, state);
        console.info(`[game] vida perdida · vidas restantes: ${lives}`);

        if (lives <= 0)
        {
            this.#mario.freeze();
            this.physics.pause();
            console.info('[game] game over');
            this.game.events.emit(GAME_OVER_EVENT);
            this.scene.start('GameOver');
            return;
        }

        this.scene.restart();
    }
}
