export class InputComponent {
    #up : boolean;
    #down : boolean;
    #left : boolean;
    #right : boolean;
    #speed : boolean;

    constructor() {
        this.#up = false;
        this.#down = false;
        this.#left = false;
        this.#right = false;
        this.#speed = false;
    }

    get isUpDown() : boolean {
        return this.#up;
    }
    set isUpDown(value: boolean) {
        this.#up = value;
    }
    get isDownDown() : boolean {
        return this.#down;
    }
    set isDownDown(value: boolean) {
        this.#down = value;
    }
    get isLeftDown() : boolean {
        return this.#left;
    }
    set isLeftDown(value: boolean) {
        this.#left = value;
    }
    get isRightDown() : boolean {
        return this.#right;
    }
    set isRightDown(value: boolean) {
        this.#right = value;
    }
    get isSpeedDown() : boolean {
        return this.#speed;
    }
    set isSpeedDown(value: boolean) {
        this.#speed = value;
    }

    public reset() : void {
        this.#up = false;
        this.#down = false;
        this.#left = false;
        this.#right = false;
        this.#speed = false;
    }   
}