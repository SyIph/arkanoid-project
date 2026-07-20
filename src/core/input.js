class Input {
    #keys = {};

    constructor() {
        window.addEventListener('keydown', this.#onKeyDown);
        window.addEventListener('keyup', this.#onKeyUp);
    }

    #onKeyDown = (event) => {
        this.#keys[event.code] = true;
    }

    #onKeyUp = (event) => {
        this.#keys[event.code] = false;
    }

    get left() {
        return this.#keys['ArrowLeft'] && !this.#keys['ArrowRight']
    }

    get right() {
        return this.#keys['ArrowRight'] && !this.#keys['ArrowLeft']
    }
}

export default new Input();