import { Container, Graphics, Texture, Rectangle, Sprite, TilingSprite, Assets } from "pixi.js";
import { LevelBackground } from "../levelBg/levelBackground";
import { PlayerPlate } from "../levelObjects/playerPlate";
import { BallPhysics } from "../core/ballPhysics";
import { Brick } from "../levelObjects/brick";
import { BrickGrid } from "./brickGrid";
import { ScoreBoard } from "./scoreBoard";

export class LevelContainer extends Container {
    constructor(width, height, backgroundTexture, levelNum = 1) {
        super();

        this._width = width;
        this._height = height;

        this.backgroundTexture = backgroundTexture;
        this.levelNum = levelNum;

        this.levelBackground = new LevelBackground(width, height - 2, this.backgroundTexture);
        this.levelBackground.y = 2;
        this.addChild(this.levelBackground);
        const space = this.levelBackground.getInnerSpace();

        this.playerPlate = new PlayerPlate(space.width, space.height);
        this.brickGrid = new BrickGrid(space.width, space.height, 28, 11);

        this.innerSpace = new BallPhysics(this.playerPlate, this.brickGrid);
        this.innerSpace.x = space.x;
        this.innerSpace.y = space.y;

        const gameField = new TilingSprite({
            texture: Assets.get(this.backgroundTexture),
            width: space.width,
            height: space.height
        });
        this.innerSpace.addChild(gameField);

        this.innerSpace.addChild(this.playerPlate);
        this.innerSpace.addChild(this.brickGrid);
        this.addChild(this.innerSpace);

        this.scoreBoard = new ScoreBoard();
        this.scoreBoard.x = this.levelBackground.width;
        this.scoreBoard.y = 16;
        this.scoreBoard.updatePos();
        this.addChild(this.scoreBoard);

        this.addBall();

        this.testLevelData();
    }

    testLevelData() {
        this.addBrickRow(Brick.GrayBrick, 4, true, this.levelNum);
        this.addBrickRow(Brick.RedBrick, 5, false, this.levelNum);
        this.addBrickRow(Brick.BlueBrick, 6, false, this.levelNum);
        this.addBrickRow(Brick.OrangeBrick, 7, false, this.levelNum);
        this.addBrickRow(Brick.PinkBrick, 8, false, this.levelNum);
        this.addBrickRow(Brick.GreenBrick, 9, false, this.levelNum);
    }

    addBrick(brickFunc, x, y, armored = false, levelNum = 1) {
        this.brickGrid.addBrick(brickFunc, x, y, armored, levelNum);
    }

    addBrickRow(brickFunc, y, armored = false, levelNum = 1) {
        this.brickGrid.addBrickRow(brickFunc, y, armored, levelNum);
    }

    addBrickColumn(brickFunc, x, armored = false, levelNum = 1) {
        this.brickGrid.addBrickColumn(brickFunc, x, armored, levelNum);
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