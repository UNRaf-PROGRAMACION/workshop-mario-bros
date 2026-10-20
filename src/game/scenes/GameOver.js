import { ResultScreen } from './ResultScreen.js';

/** Pantalla de derrota sin nivel jugable ni puntaje final. */
export class GameOver extends ResultScreen
{
    constructor ()
    {
        super({ key: 'GameOver', title: 'GAME OVER' });
    }
}
