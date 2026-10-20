import { Physics } from 'phaser';
import { ANIMATIONS, CHARACTERS } from '../constants/assets.js';
import { GOOMBA } from '../constants/goombas.js';
import { MARIO_MOVEMENT } from '../constants/movement.js';

/**
 * Goomba con patrulla automática. Invierte la dirección al chocar
 * lateralmente, cae con gravedad y puede aplastarse una sola vez.
 */
export class Goomba extends Physics.Arcade.Sprite
{
    #direction = 0;
    #squashed = false;

    constructor (scene, x, y)
    {
        const data = CHARACTERS.GOOMBA;

        super(scene, x, y, data.texture, data.frames[0]);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(data.origin.x, data.origin.y);
        this.body.setSize(data.hitbox.width, data.hitbox.height, false);
        this.body.setOffset(
            (data.rects[0].width - data.hitbox.width) / 2,
            data.rects[0].height - data.hitbox.height
        );
        this.setCollideWorldBounds(true);
        this.body.setMaxVelocity(GOOMBA.SPEED, MARIO_MOVEMENT.TERMINAL_VELOCITY);
        this.body.setGravityY(MARIO_MOVEMENT.GRAVITY_FALLING);

        this.#setDirection(-1);
        this.play(ANIMATIONS.GOOMBA_WALK.key, true);
    }

    get isSquashed ()
    {
        return this.#squashed;
    }

    update ()
    {
        if (!this.active || this.#squashed)
        {
            return;
        }

        if (this.body.blocked.left)
        {
            this.#setDirection(1);
        }
        else if (this.body.blocked.right)
        {
            this.#setDirection(-1);
        }

        if (this.y > GOOMBA.PIT_Y)
        {
            this.destroy();
        }
    }

    squash ()
    {
        if (this.#squashed)
        {
            return false;
        }

        this.#squashed = true;
        this.body.enable = false;
        this.anims.stop();
        this.setFrame(CHARACTERS.GOOMBA.frames[0]);
        this.setScale(1, GOOMBA.SQUASH_SCALE_Y);

        console.info('[goomba] squashed');

        this.scene.time.delayedCall(GOOMBA.SQUASH_MS, () => this.destroy());

        return true;
    }

    #setDirection (direction)
    {
        if (this.#direction === direction)
        {
            return;
        }

        this.#direction = direction;
        this.body.setVelocityX(direction * GOOMBA.SPEED);
        this.setFlipX(direction > 0);

        console.info(`[goomba] direction ${direction > 0 ? 'right' : 'left'}`);
    }
}
