import { AUTO, Scale, Game } from 'phaser';
import { Boot } from './scenes/Boot';
import { MainMenu } from './scenes/MainMenu';
import { WorldScreen } from './scenes/WorldScreen';
import { Game as MainGame } from './scenes/Game';
import { Hud } from './scenes/Hud';
import { LevelComplete } from './scenes/LevelComplete';
import { GameOver } from './scenes/GameOver';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        MainMenu,
        WorldScreen,
        MainGame,
        Hud,
        LevelComplete,
        GameOver
    ]
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
}

export default StartGame;
