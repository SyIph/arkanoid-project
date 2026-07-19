import { Graphics } from "pixi.js";

export class Ball extends Graphics {
    constructor(x, y, ticker) {
        super();
        this.radius = 10;
        this.velocity = {x: 5, y: -5};
        this.circle(0, 0, this.radius).fill('#ffffff');

        this.setPosition(x, y);

        ticker.add(() => this.updateInput());
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    updateInput() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}