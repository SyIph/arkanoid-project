import { Container, Graphics, Sprite, Assets } from "pixi.js";
import { AssetsIds } from "./gameAssets";

export class BorderElement extends Container {
    constructor() {
        super();

        const texture = Assets.get(AssetsIds.BorderElementTexture);

        this.elementSprite = new Sprite(texture);
        this.elementSprite.x = 1 + this.elementSprite.width / 2;
        this.elementSprite.y = this.elementSprite.height / 2;
        this.elementSprite.anchor.set(0.5);

        this.background = new Graphics().rect(0, 0, this.elementSprite.width + 2, this.elementSprite.height).fill('#000000');

        this.addChild(this.background);
        this.addChild(this.elementSprite);
    }

    setVertical() {
        this.elementSprite.x = this.elementSprite.height / 2;
        this.elementSprite.y = 1 + this.elementSprite.width / 2;

        const degrees = -90;
        this.elementSprite.rotation = degrees * Math.PI / 180;

        this.background.width = this.elementSprite.height;
        this.background.height = this.elementSprite.width + 2;
    }
}