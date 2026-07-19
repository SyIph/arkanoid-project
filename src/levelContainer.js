import { Container, Graphics, Texture, Rectangle, Sprite, TilingSprite, Assets } from "pixi.js";
import { LevelBackground } from "./levelBackground";
import { PlayerPlate } from "./playerPlate";
import { BallPhysics } from "./ballPhysics";

export class LevelContainer extends Container {
    constructor(width, height) {
        super();

        this._width = width;
        this._height = height;

        this.levelBackground = new LevelBackground(width, height - 2);
        this.levelBackground.y = 2;
        this.addChild(this.levelBackground);
        const space = this.levelBackground.getInnerSpace();

        this.playerPlate = new PlayerPlate(space.width, space.height);

        this.innerSpace = new BallPhysics(this.playerPlate);
        this.innerSpace.x = space.x;
        this.innerSpace.y = space.y;
        const background = new Graphics().rect(0, 0, space.width, space.height).fill('#000000');

        this.innerSpace.addChild(background);
        this.innerSpace.addChild(this.playerPlate);
        this.addChild(this.innerSpace);

        this.addBall();
    }

    addBall() {
        const ballStart = this.playerPlate.topCenter;
        this.innerSpace.createBall(ballStart);
    }

    initTicker(ticker) {
        this.playerPlate.initTicker(ticker);
        this.innerSpace.initTicker(ticker);
    }
}