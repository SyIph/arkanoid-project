import { Sprite, Assets } from "pixi.js";
import { AssetsIds } from "../core/gameAssets";

export class Ball extends Sprite {
    constructor(x, y) {
        super();

        this.texture = Assets.get(AssetsIds.BallTexture);
        this.texture.source.scaleMode = 'nearest';
        this.anchor.set(0.5);

        this.velocity = {x: 1, y: -1};

        this.setPosition(x, y);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

}