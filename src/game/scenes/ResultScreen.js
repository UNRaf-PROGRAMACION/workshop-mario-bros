import { Scene } from 'phaser';

const COLORS = Object.freeze({
    BACKDROP: 0x0b1d3a,
    BUTTON: 0xe52521,
    BUTTON_HOVER: 0xff6b57
});

/** Ciclo compartido de pantallas finales, con cámara propia y retorno explícito. */
export class ResultScreen extends Scene
{
    #returning = false;
    #title;
    #backgroundAlpha;

    constructor ({ key, title, backgroundAlpha = 1 })
    {
        super(key);
        this.#title = title;
        this.#backgroundAlpha = backgroundAlpha;
    }

    create ()
    {
        this.#returning = false;

        const { width, height } = this.scale;
        const centerX = width / 2;
        const centerY = height / 2;

        this.add.rectangle(centerX, centerY, width, height, COLORS.BACKDROP, this.#backgroundAlpha);
        this.add.text(centerX, centerY - 80, this.#title, {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        const button = this.add.rectangle(centerX, centerY + 70, 380, 76, COLORS.BUTTON)
            .setStrokeStyle(4, 0xffffff)
            .setInteractive({ useHandCursor: true });

        this.add.text(centerX, centerY + 70, 'Volver al menú', {
            fontFamily: 'monospace',
            fontSize: 32,
            color: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerover', () => button.setFillStyle(COLORS.BUTTON_HOVER));
        button.on('pointerout', () => button.setFillStyle(COLORS.BUTTON));
        button.on('pointerdown', () => this.#returnToMenu());

        this.add.text(centerX, centerY + 160, 'ENTER / ESPACIO / CLIC', {
            fontFamily: 'monospace',
            fontSize: 16,
            color: '#ffffff'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-ENTER', this.#onReturnKey);
        this.input.keyboard.on('keydown-SPACE', this.#onReturnKey);
        this.events.once('shutdown', () =>
        {
            this.input.keyboard.off('keydown-ENTER', this.#onReturnKey);
            this.input.keyboard.off('keydown-SPACE', this.#onReturnKey);
        });
        this.scene.bringToTop();
    }

    #onReturnKey = (event) =>
    {
        // Mantener salto pulsado al llegar no debe cerrar el overlay.
        if (!event.repeat)
        {
            this.#returnToMenu();
        }
    };

    #returnToMenu ()
    {
        if (this.#returning)
        {
            return;
        }

        this.#returning = true;
        this.scene.stop('Game');
        this.scene.start('MainMenu');
    }
}
