import { Graphics } from "pixi.js";
import Input from "./Input.js";

export class PlayerPlate extends Graphics {
    constructor(width, height, windowSize, ticker) {
        super();
        this.windowSize = windowSize;
        this.widthPixels = width;
        this.heightPixels = height;
        this.speed = 2.0;

        this.rect(-this.widthPixels / 2, this.heightPixels, this.widthPixels, this.heightPixels).fill('#ffffff');

        this.x = (this.windowSize - this.widthPixels) / 2;
        this.y = this.windowSize - this.heightPixels * 2;

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

    move(dir) {
        this.x += dir * this.speed;
        this.x = Math.min(Math.max(this.widthPixels / 2, this.x), this.windowSize - this.widthPixels / 2);
    }
}