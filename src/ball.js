import { Sprite, Assets } from "pixi.js";

export class Ball extends Sprite {
    constructor(x, y) {
        super();

        this.texture = Assets.get("/assets/Ball.png");
        this.texture.source.scaleMode = 'nearest';
        this.anchor.set(0.5);

        this.velocity = {x: 1, y: -1};

        this.setPosition(x, y);
    }

    initTicker(ticker) {
        ticker.add(() => this.update());
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}