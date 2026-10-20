import { Physics } from 'phaser';
import { PIRANHA } from '../constants/piranha.js';
import { PIRANHA_TEXTURES } from '../textures/piranha.js';

/**
 * Piranha Plant generada por geometría. Vive oculta dentro de una tubería y
 * repite el ciclo subir → esperar → bajar → esperar. Nunca se destruye.
 */
export class PiranhaPlant extends Physics.Arcade.Image
{
    #hiddenY;
    #outY;
    #open = true;

    constructor (scene, x, pipeTopY)
    {
        const hiddenY = pipeTopY + PIRANHA.CANVAS_HEIGHT;

        super(scene, x, hiddenY, PIRANHA_TEXTURES.OPEN);

        scene.add.existing(this);
        this.setOrigin(0.5, 1);
        this.setDepth(PIRANHA.DEPTH);

        scene.physics.add.existing(this, true);

        this.body.setSize(PIRANHA.HITBOX.width, PIRANHA.HITBOX.height, false);
        this.body.setOffset(PIRANHA.BODY_OFFSET.x, PIRANHA.BODY_OFFSET.y);
        this.body.updateFromGameObject();
        this.body.enable = false;

        this.#hiddenY = hiddenY;
        this.#outY = hiddenY - PIRANHA.TRAVEL;

        scene.time.addEvent({
            delay: PIRANHA.FRAME_MS,
            loop: true,
            callback: () => this.#toggleFrame()
        });

        this.#scheduleRise();

        console.info('[piranha] hidden');
    }

    #scheduleRise ()
    {
        this.scene.time.delayedCall(PIRANHA.HIDDEN_MS, () => this.#rise());
    }

    #rise ()
    {
        console.info('[piranha] rise');

        this.body.enable = true;
        this.body.updateFromGameObject();

        this.scene.tweens.add({
            targets: this,
            y: this.#outY,
            duration: PIRANHA.RISE_MS,
            ease: 'Sine.easeOut',
            onUpdate: () => this.#syncBody(),
            onComplete: () =>
            {
                console.info('[piranha] out');
                this.scene.time.delayedCall(PIRANHA.OUT_MS, () => this.#fall());
            }
        });
    }

    #fall ()
    {
        console.info('[piranha] hide');

        this.scene.tweens.add({
            targets: this,
            y: this.#hiddenY,
            duration: PIRANHA.FALL_MS,
            ease: 'Sine.easeIn',
            onUpdate: () => this.#syncBody(),
            onComplete: () =>
            {
                this.#syncBody();
                this.body.enable = false;

                console.info('[piranha] hidden');
                this.#scheduleRise();
            }
        });
    }

    #syncBody ()
    {
        if (this.body)
        {
            this.body.updateFromGameObject();
        }
    }

    #toggleFrame ()
    {
        if (!this.active)
        {
            return;
        }

        this.#open = !this.#open;
        this.setTexture(this.#open ? PIRANHA_TEXTURES.OPEN : PIRANHA_TEXTURES.CLOSED);
    }
}
