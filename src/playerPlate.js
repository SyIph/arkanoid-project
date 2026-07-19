import { Sprite, Point, Assets } from "pixi.js";
import Input from "./Input.js";

export class PlayerPlate extends Sprite {
    constructor(windowSizeX, windowSizeY) {
        super();

        this.texture = Assets.get("/assets/Plate1.png");
        this.texture.source.scaleMode = 'nearest';
        this.anchor.set(0.5, 0);

        this.windowSizeX = windowSizeX;
        this.windowSizeY = windowSizeY;
        this.speed = 2.0;

        this.x = this.windowSizeX / 2;
        this.y = this.windowSizeY - 16;
    }

    initTicker(ticker) {
        ticker.add(() => this.updateInput());
    }

    updateInput() {
        if (Input.left) {
            this.move(-1);
        }
        if (Input.right) {
            this.move(1);
        }
    }

    get topCenter() {
        return new Point(this.x, this.y);
    }

    move(dir) {
        this.x += dir * this.speed;
        this.x = Math.min(Math.max(this.width / 2, this.x), this.windowSizeX - this.width / 2);
    }
}