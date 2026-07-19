import { Graphics } from "pixi.js";

export class PlayerPlate extends Graphics {
    constructor(width, height, windowSize) {
        super();
        this.windowSize = windowSize;
        this.widthPixels = width;
        this.heightPixels = height;

        this.rect(0, 0, this.widthPixels, this.heightPixels).fill('#ffffff');

        this.x = (this.windowSize - this.widthPixels) / 2;
        this.y = this.windowSize - this.heightPixels;
    }
}