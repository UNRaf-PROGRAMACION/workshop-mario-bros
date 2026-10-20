import { Scene } from 'phaser';
import { GAME_STATE_KEY } from '../state/GameState.js';

const TITLE = 'SUPER MARIO BROS';
const SUBTITLE = 'Versión simplificada';
const START_LABEL = 'Jugar';
const HINT = 'ENTER / ESPACIO / CLIC';

const COLORS = Object.freeze({
    BACKGROUND: 0x0b1d3a,
    BUTTON: 0xe52521,
    BUTTON_HOVER: 0xff6b57,
    TITLE: '#ffffff',
    SUBTITLE: '#f7d51d',
    HINT: '#9db4d0'
});

export class MainMenu extends Scene
{
    #starting = false;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.#starting = false;
        this.cameras.main.setBackgroundColor(COLORS.BACKGROUND);

        this.add.text(512, 230, TITLE, {
            fontFamily: 'monospace',
            fontSize: 64,
            fontStyle: 'bold',
            color: COLORS.TITLE,
            stroke: '#000000',
            strokeThickness: 10
        }).setOrigin(0.5);

        this.add.text(512, 300, SUBTITLE, {
            fontFamily: 'monospace',
            fontSize: 24,
            color: COLORS.SUBTITLE
        }).setOrigin(0.5);

        const button = this.add.rectangle(512, 500, 260, 76, COLORS.BUTTON)
            .setStrokeStyle(4, 0xffffff)
            .setInteractive({ useHandCursor: true });

        this.add.text(512, 500, START_LABEL, {
            fontFamily: 'monospace',
            fontSize: 36,
            color: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerover', () => button.setFillStyle(COLORS.BUTTON_HOVER));
        button.on('pointerout', () => button.setFillStyle(COLORS.BUTTON));
        button.on('pointerdown', () => this.#startGame());

        this.add.text(512, 620, HINT, {
            fontFamily: 'monospace',
            fontSize: 16,
            color: COLORS.HINT
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-ENTER', () => this.#startGame());
        this.input.keyboard.once('keydown-SPACE', () => this.#startGame());
    }

    #startGame ()
    {
        if (this.#starting)
        {
            return;
        }

        this.#starting = true;

        const state = this.registry.get(GAME_STATE_KEY);

        state?.reset();

        this.scene.start('WorldScreen');
    }
}
