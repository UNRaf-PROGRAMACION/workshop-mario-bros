import { ResultScreen } from './ResultScreen.js';

/** Overlay de victoria sobre el nivel pausado. */
export class LevelComplete extends ResultScreen
{
    constructor ()
    {
        super({ key: 'LevelComplete', title: '¡Nivel completado!', backgroundAlpha: 0.75 });
    }
}
