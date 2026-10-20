import { Physics } from 'phaser';
import { TILES } from '../constants/assets.js';
import { MARIO_MOVEMENT } from '../constants/movement.js';
import { MUSHROOM } from '../constants/mushrooms.js';

export const MUSHROOM_COLLECTED_EVENT = 'mushroom:collected';

/**
 * Super Mushroom. Emerge desde el centro del bloque hasta quedar apoyado
 * encima, con el cuerpo deshabilitado, y después camina y cae con gravedad.
 */
export class Mushroom extends Physics.Arcade.Sprite
{
    #direction = 1;
    #collected = false;

    constructor (scene, x, blockY)
    {
        const tile = TILES.SUPER_MUSHROOM;

        super(scene, x, blockY + 9, tile.texture, tile.frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);
        this.body.setSize(MUSHROOM.HITBOX, MUSHROOM.HITBOX, true);
        this.body.setAllowGravity(false);
        this.body.enable = false;
        this.setDepth(-1);

        scene.tweens.add({
            targets: this,
            y: blockY + 9 - MUSHROOM.EMERGE_DISTANCE,
            duration: MUSHROOM.EMERGE_MS,
            ease: 'Linear',
            onComplete: () =>
            {
                this.setDepth(5);
                this.body.enable = true;
                this.body.reset(this.x, this.y);
                this.setCollideWorldBounds(true);
                this.body.setAllowGravity(true);
                this.body.setGravityY(MARIO_MOVEMENT.GRAVITY_FALLING);
                this.#setDirection(1);

                console.info('[mushroom] emerged');
            }
        });
    }

    update ()
    {
        if (!this.active || !this.body.enable)
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

        if (this.y > MUSHROOM.PIT_Y)
        {
            this.destroy();
        }
    }

    collect ()
    {
        if (this.#collected)
        {
            return false;
        }

        this.#collected = true;
        this.emit(MUSHROOM_COLLECTED_EVENT);
        this.destroy();

        return true;
    }

    #setDirection (direction)
    {
        const velocityX = direction * MUSHROOM.SPEED;

        if (this.#direction === direction && this.body.velocity.x === velocityX)
        {
            return;
        }

        this.#direction = direction;
        this.body.setVelocityX(velocityX);
        this.setFlipX(direction < 0);

        console.info(`[mushroom] direction ${direction > 0 ? 'right' : 'left'}`);
    }
}
