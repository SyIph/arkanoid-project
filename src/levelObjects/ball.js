import { Sprite, Assets } from "pixi.js";
import { AssetsIds } from "../core/gameAssets";

export class Ball extends Sprite {
    constructor(x, y) {
        super();

        this.texture = Assets.get(AssetsIds.BallTexture);
        this.texture.source.scaleMode = 'nearest';
        this.anchor.set(0.5);

        this.speed = 3.0;
        this.angle = Math.PI / 4;

        this.sticked = false;
        this.offsetX = 0;
        this.offsetY = 0;

        this.setPosition(x, y);
    }

    get velocityX() {
        return this.speed * Math.sin(this.angle);
    }

    get velocityY() {
        return -this.speed * Math.cos(this.angle);
    }

    reflectVertical() {
        this.angle *= -1;
    }

    reflectHorizontal() {
        this.angle = Math.PI - this.angle;
    }

    stickToPlate(plate) {
        this.sticked = true;
        this.offsetX = this.x - plate.x;
        this.offsetY = this.y - plate.y;
    }

    setPosition(x, y) {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x = x;
        this.y = y;
    }

}