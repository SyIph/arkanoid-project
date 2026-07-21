import { Container, Graphics, Assets, AnimatedSprite, Texture } from "pixi.js";
import { AssetsIds } from "../core/gameAssets";

export class Brick extends Container {

    constructor(width, height, color, score, armored = false, indestructable = false) {
        super();
        this.color = color;
        this.score = score;
        this.armored = armored;
        this.indestructable = indestructable;

        this._width = width;
        this._height = height;
        
        this.health = this.armored ? 2 : 1;

        this.background = new Graphics();
        this.background.rect(0, 0, this._width, this._height).fill(this.color);
        this.background.rect(0, this._height - 1, this._width, 1).fill("#000000");
        this.background.rect(this._width - 1, 0, 1, this._height).fill("#000000");
        this.addChild(this.background);

        this.armor = new AnimatedSprite(this.armored ? [
            Assets.get(AssetsIds.ArmorBrick1Texture),
            Assets.get(AssetsIds.ArmorBrick2Texture),
            Assets.get(AssetsIds.ArmorBrick3Texture),
            Assets.get(AssetsIds.ArmorBrick4Texture),
            Assets.get(AssetsIds.ArmorBrick5Texture),
            Assets.get(AssetsIds.ArmorBrick6Texture),
            Assets.get(AssetsIds.ArmorBrick1Texture)
        ] : [ Texture.EMPTY ]);
        this.armor.animationSpeed = 0.15;
        this.armor.loop = false;
        this.addChild(this.armor);
    }

    hit() {
        this.health--;
        if (this.health <= 0) {
            return true;
        }
        this.armor.gotoAndPlay(0);
        return false;
    }

    static GrayBrick(width, height, armored, levelNum) {
        return new Brick(width, height, '#b1b1b3', 50 * levelNum, armored);
    }

    static RedBrick(width, height, armored, levelNum) {
        return new Brick(width, height, '#710000', 90, armored);
    }

    static BlueBrick(width, height, armored, levelNum) {
        return new Brick(width, height, '#002eb7', 100, armored);
    }

    static OrangeBrick(width, height, armored, levelNum) {
        return new Brick(width, height, '#d09a35', 60, armored);
    }

    static PinkBrick(width, height, armored, levelNum) {
        return new Brick(width, height, '#d236c1', 110, armored);
    }

    static GreenBrick(width, height, armored, levelNum) {
        return new Brick(width, height, '#aaff52', 80, armored);
    }

}