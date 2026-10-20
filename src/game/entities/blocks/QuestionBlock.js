import { TILES } from '../../constants/assets.js';
import { Block } from './Block.js';

export class QuestionBlock extends Block
{
    #used = false;
    #onRelease;

    constructor (scene, x, y, onRelease)
    {
        super(scene, x, y, TILES.QUESTION_BLOCK);

        this.#onRelease = onRelease;
    }

    hit ()
    {
        if (this.#used)
        {
            console.info('[block] question empty');
            this.bounce();
            return;
        }

        this.#used = true;
        console.info('[block] question used');

        this.setTexture(TILES.EMPTY_BLOCK.texture, TILES.EMPTY_BLOCK.frame);
        this.bounce();
        this.#onRelease?.(this.x, this.y);
    }
}
