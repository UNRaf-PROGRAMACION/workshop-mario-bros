import { Input, Scene } from 'phaser';
import { TILES, TILE_SEQUENCES } from '../constants/assets.js';
import { GOOMBA } from '../constants/goombas.js';
import { Coin, COIN_COLLECTED_EVENT } from '../entities/Coin.js';
import { Goomba } from '../entities/Goomba.js';
import { Mushroom, MUSHROOM_COLLECTED_EVENT } from '../entities/Mushroom.js';
import { PiranhaPlant } from '../entities/PiranhaPlant.js';
import { BLOCK_TYPES, createBlock } from '../entities/blocks/createBlock.js';
import { Mario, MARIO_DAMAGED_EVENT } from '../entities/Mario.js';
import { buildEnvironment } from '../level/Environment.js';
import { WORLD_1_1 } from '../level/world11.js';
import { GAME_OVER_EVENT, GAME_STATE_KEY } from '../state/GameState.js';

const SKY_COLOR = 0x5c94fc;
const CAMERA_ZOOM = 3;
const CAMERA_LERP = 0.1;
const CLOUD_DEPTH = -1;
const GOAL_DEPTH = 1;

/**
 * World 1-1 (spec 012): nivel completo con cámara, entorno, bloques, monedas,
 * hongos, Goombas, Piranha Plants y Goal Pole visual.
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
    #handlingDeath = false;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.#handlingDeath = false;
        this.#mushrooms = [];
        this.#goombas = [];

        this.cameras.main.setBackgroundColor(SKY_COLOR);
        this.physics.world.setBounds(0, 0, WORLD_1_1.width, WORLD_1_1.height + 100);

        const environment = buildEnvironment(this, WORLD_1_1);

        this.#solids = environment.solids;
        this.#createBlocks();

        this.#mario = new Mario(this, WORLD_1_1.marioStart.x, WORLD_1_1.marioStart.y);
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
    }

    update (time, delta)
    {
        if (this.#handlingDeath)
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

    #createBlocks ()
    {
        this.#blocks = this.physics.add.staticGroup();

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
        WORLD_1_1.clouds.forEach(({ x, y }) =>
        {
            TILE_SEQUENCES.CLOUD.forEach((tile, index) =>
            {
                this.add.image(x + index * 18, y, tile.texture, tile.frame).setDepth(CLOUD_DEPTH);
            });
        });
    }

    #createGoal ()
    {
        const { x, baseY, height } = WORLD_1_1.goal;

        for (let index = 0; index < height; index++)
        {
            const tile = index === 0
                ? TILES.GOAL_POLE_BASE
                : index === 1
                    ? TILES.GOAL_POLE_MIDDLE
                    : TILES.GOAL_POLE_SEGMENT;

            this.add.image(x, baseY - 9 - index * 18, tile.texture, tile.frame).setDepth(GOAL_DEPTH);
        }

        const topY = baseY - height * 18;

        this.add.image(x + 18, topY + 9, TILES.FLAG.texture, TILES.FLAG.frame).setDepth(GOAL_DEPTH);
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
        if (!fatal || this.#handlingDeath)
        {
            return;
        }

        this.#handlingDeath = true;

        const state = this.registry.get(GAME_STATE_KEY);
        const lives = state.loseLife();

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
}
