import { COIN } from '../constants/coins.js';

export const GAME_STATE_KEY = 'gameState';
export const GAME_OVER_EVENT = 'game-over';
export const STATE_CHANGED_EVENT = 'game-state:changed';

export const INITIAL_STATE = Object.freeze({
    lives: 3,
    coins: 0,
    score: 0,
    world: '1-1'
});

/**
 * Estado de la partida. Vive en el registry de Phaser y se comparte entre
 * escenas sin variables globales. En la spec 002 solo se lee; las specs de
 * puntaje, vidas y reinicio le agregan mutaciones.
 */
export class GameState
{
    #lives;
    #coins;
    #score;
    #world;

    constructor (initial = INITIAL_STATE)
    {
        this.#lives = initial.lives;
        this.#coins = initial.coins;
        this.#score = initial.score;
        this.#world = initial.world;
    }

    get lives ()
    {
        return this.#lives;
    }

    get coins ()
    {
        return this.#coins;
    }

    get score ()
    {
        return this.#score;
    }

    get world ()
    {
        return this.#world;
    }

    /**
     * Descuenta una vida sin tocar puntaje ni monedas (§8.2 y §11.4).
     * @returns {number} vidas restantes, nunca menor que cero.
     */
    loseLife ()
    {
        this.#lives = Math.max(0, this.#lives - 1);

        return this.#lives;
    }

    /**
     * Suma una moneda y sus puntos (§5.1 y §8.1).
     */
    addCoin ()
    {
        this.#coins += COIN.VALUE;
        this.#score += COIN.SCORE;
    }

    /** Reinicia contadores para una partida nueva (§11.4). */
    reset ()
    {
        this.#lives = INITIAL_STATE.lives;
        this.#coins = INITIAL_STATE.coins;
        this.#score = INITIAL_STATE.score;
        this.#world = INITIAL_STATE.world;
    }
}
