import { GameObject } from '../../common/types';
import { InputComponent } from '../input/input';
import { BaseGameObjectComponent } from '../game-object/base-game-object-componet';

export class ControlsComponent extends BaseGameObjectComponent {
    #inputComponent: InputComponent;

    constructor(gameObject: GameObject, inputComponent: InputComponent) {
        super(gameObject);
        this.#inputComponent = inputComponent;
    }

    get controls(): InputComponent {
        return this.#inputComponent;
    }
}