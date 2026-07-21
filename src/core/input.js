class Input {
    #keys = {};
    #pressed = {};
    #released = {};

    constructor() {
        window.addEventListener('keydown', this.#onKeyDown);
        window.addEventListener('keyup', this.#onKeyUp);
    }

    #onKeyDown = (event) => {

        if (!this.#keys[event.code]) {
            this.#pressed[event.code] = true;
        }

        this.#keys[event.code] = true;
    }

    #onKeyUp = (event) => {

        this.#keys[event.code] = false;
        this.#released[event.code] = true;

    }

    tick(deltaTime) {
        this.#pressed = {};
        this.#released = {};
    }

    get startLevel() {
        return this.#keys['ArrowLeft'] || this.#keys['ArrowRight'] || this.#keys['Space'] || this.#keys['Enter']
    }

    get left() {
        return this.#keys['ArrowLeft'] && !this.#keys['ArrowRight']
    }

    get right() {
        return this.#keys['ArrowRight'] && !this.#keys['ArrowLeft']
    }

    get upPressed() {
        return this.#pressed['ArrowUp']
    }

    get downPressed() {
        return this.#pressed['ArrowDown']
    }

    get escapePressed() {
        return this.#pressed['Escape']
    }

    consumeEscape() {
        const pressed = this.escapePressed;
        this.#pressed["Escape"] = false;
        return pressed;
    }

    get enterPressed() {
        return this.#pressed['Enter']
    }
}

export default new Input();