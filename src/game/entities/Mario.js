import { Physics } from 'phaser';
import { CHARACTERS } from '../constants/assets.js';
import { MARIO_DAMAGE } from '../constants/damage.js';
import { MARIO_MOVEMENT } from '../constants/movement.js';

const WALK_ANIMATION_KEY = 'mario_walk';
const WALK_ANIMATION_THRESHOLD = 5;

export const MARIO_DAMAGED_EVENT = 'mario:damaged';

const STATES = Object.freeze({
    SMALL: 'small',
    SUPER: 'super'
});

const STATE_ASSETS = Object.freeze({
    [STATES.SMALL]: CHARACTERS.SMALL_MARIO,
    [STATES.SUPER]: CHARACTERS.SUPER_MARIO
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Mario con máquina de estados Small/Super. Concentra cuerpo físico, movimiento,
 * salto, animación, daño e invulnerabilidad. La escena solo le pasa el input y
 * reacciona al evento de daño.
 */
export class Mario extends Physics.Arcade.Sprite
{
    #bufferMs = 0;
    #coyoteMs = 0;
    #state = STATES.SMALL;
    #invulnerableMs = 0;

    constructor (scene, x, y)
    {
        const data = CHARACTERS.SMALL_MARIO;

        super(scene, x, y, data.texture, data.frames[0]);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(data.origin.x, data.origin.y);
        this.setCollideWorldBounds(true);
        this.body.setMaxVelocity(MARIO_MOVEMENT.MAX_SPEED, MARIO_MOVEMENT.TERMINAL_VELOCITY);
        this.body.setGravityY(MARIO_MOVEMENT.GRAVITY_FALLING);

        this.#applyState(STATES.SMALL);
    }

    get form ()
    {
        return this.#state;
    }

    get isSuper ()
    {
        return this.#state === STATES.SUPER;
    }

    /** Small → Super. Mantiene los pies en la misma posición. */
    grow ()
    {
        if (this.#state === STATES.SUPER)
        {
            return false;
        }

        this.#applyState(STATES.SUPER);

        return true;
    }

    /**
     * Daño de enemigo. Super vuelve a Small con invulnerabilidad; Small emite
     * daño fatal para que la escena descuente la vida.
     * @returns {boolean} si el golpe fue aplicado.
     */
    takeDamage ()
    {
        if (this.#invulnerableMs > 0)
        {
            return false;
        }

        if (this.#state === STATES.SUPER)
        {
            this.#applyState(STATES.SMALL);
            this.#invulnerableMs = MARIO_DAMAGE.INVULNERABILITY_MS;
            this.emit(MARIO_DAMAGED_EVENT, { fatal: false });

            return true;
        }

        this.emit(MARIO_DAMAGED_EVENT, { fatal: true });

        return true;
    }

    /** Muerte directa (pozo): no otorga invulnerabilidad ni respeta la ventana. */
    die ()
    {
        this.emit(MARIO_DAMAGED_EVENT, { fatal: true });
    }

    /** Impulso vertical externo, por ejemplo al aplastar un enemigo. */
    bounce (velocityY)
    {
        this.body.setVelocityY(velocityY);
        this.#bufferMs = 0;
        this.#coyoteMs = 0;
    }

    update (input, delta)
    {
        const seconds = delta / 1000;
        const body = this.body;
        const onGround = body.blocked.down || body.touching.down;

        this.#updateJump(onGround, input.jumpPressed, delta);

        if (input.left !== input.right)
        {
            const direction = input.left ? -1 : 1;
            const acceleration = onGround
                ? MARIO_MOVEMENT.GROUND_ACCELERATION
                : MARIO_MOVEMENT.AIR_ACCELERATION;

            body.velocity.x = clamp(
                body.velocity.x + direction * acceleration * seconds,
                -MARIO_MOVEMENT.MAX_SPEED,
                MARIO_MOVEMENT.MAX_SPEED
            );
            this.setFlipX(direction < 0);
        }
        else if (onGround)
        {
            const braking = MARIO_MOVEMENT.GROUND_DECELERATION * seconds;

            body.velocity.x = Math.abs(body.velocity.x) <= braking
                ? 0
                : body.velocity.x - Math.sign(body.velocity.x) * braking;
        }

        body.setGravityY(
            body.velocity.y < 0
                ? MARIO_MOVEMENT.GRAVITY_RISING
                : MARIO_MOVEMENT.GRAVITY_FALLING
        );

        this.#updateAnimation(onGround);
        this.#updateInvulnerability(delta);
    }

    #applyState (state)
    {
        const data = STATE_ASSETS[state];
        const scale = data.scale;
        const sourceWidth = data.hitbox.width / scale;
        const sourceHeight = data.hitbox.height / scale;
        const frame = data.rects[0];

        this.#state = state;
        this.setScale(scale);
        this.body.setSize(sourceWidth, sourceHeight, false);
        this.body.setOffset(
            (frame.width - sourceWidth) / 2,
            frame.height - sourceHeight
        );
        this.body.updateFromGameObject();

        console.info(`[mario] state ${state} · hitbox ${Math.round(this.body.width)}×${Math.round(this.body.height)} · escala ${scale}`);
    }

    #updateJump (onGround, jumpPressed, delta)
    {
        this.#coyoteMs = onGround
            ? MARIO_MOVEMENT.COYOTE_TIME_MS
            : Math.max(0, this.#coyoteMs - delta);

        this.#bufferMs = jumpPressed
            ? MARIO_MOVEMENT.JUMP_BUFFER_MS
            : Math.max(0, this.#bufferMs - delta);

        if (this.#bufferMs > 0 && (onGround || this.#coyoteMs > 0))
        {
            this.#jump();
        }
    }

    #jump ()
    {
        this.body.setVelocityY(MARIO_MOVEMENT.JUMP_VELOCITY);
        this.#bufferMs = 0;
        this.#coyoteMs = 0;
    }

    #updateInvulnerability (delta)
    {
        if (this.#invulnerableMs <= 0)
        {
            this.setAlpha(1);
            return;
        }

        this.#invulnerableMs = Math.max(0, this.#invulnerableMs - delta);

        const visible = Math.floor(this.#invulnerableMs / MARIO_DAMAGE.BLINK_PERIOD_MS) % 2 === 0;

        this.setAlpha(visible ? 1 : MARIO_DAMAGE.BLINK_ALPHA);

        if (this.#invulnerableMs === 0)
        {
            this.setAlpha(1);
        }
    }

    #updateAnimation (onGround)
    {
        if (!onGround)
        {
            this.anims.stop();
            this.setFrame(CHARACTERS.SMALL_MARIO.frames[1]);
            return;
        }

        const body = this.body;
        const blockedAhead = (body.velocity.x > 0 && body.blocked.right)
            || (body.velocity.x < 0 && body.blocked.left);
        const walking = Math.abs(body.velocity.x) > WALK_ANIMATION_THRESHOLD && !blockedAhead;

        if (walking)
        {
            this.play(WALK_ANIMATION_KEY, true);
            return;
        }

        this.anims.stop();
        this.setFrame(CHARACTERS.SMALL_MARIO.frames[0]);
    }
}
