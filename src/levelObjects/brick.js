import { Graphics } from "pixi.js";

export class Brick extends Graphics {

    constructor(width, height, color, score, armored = false, indestructable = false) {
        super();
        this.color = color;
        this.score = score;
        this.armored = armored;
        this.indestructable = indestructable;

        this._width = width;
        this._height = height;
        this.rect(0, 0, this._width, this._height).fill(this.color);
        this.rect(0, this._height - 1, this._width, 1).fill("#000000");
        this.rect(this._width - 1, 0, 1, this._height).fill("#000000");
        if (this.armored) {
            this.rect(1, this._height - 2, this._width - 1, 1).fill("#000000");
            this.rect(this._width - 2, 1, 1, this._height - 1).fill("#000000");
        }
    }

    hit(callback) {

    }

    static GrayBrick(width, height, levelNum) {
        return new Brick(width, height, '#b1b1b3', 50 * levelNum);
    }

    static RedBrick(width, height, levelNum) {
        return new Brick(width, height, '#710000', 90);
    }

    static BlueBrick(width, height, levelNum) {
        return new Brick(width, height, '#002eb7', 100);
    }

    static OrangeBrick(width, height, levelNum) {
        return new Brick(width, height, '#d09a35', 60);
    }

    static PinkBrick(width, height, levelNum) {
        return new Brick(width, height, '#d236c1', 110);
    }

    static GreenBrick(width, height, levelNum) {
        return new Brick(width, height, '#aaff52', 80);
    }

}