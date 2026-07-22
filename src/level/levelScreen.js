import { Container, Graphics, Texture, Rectangle, Sprite, TilingSprite, Assets, TextStyle, Text } from "pixi.js";
import { LevelBackground } from "../levelBg/levelBackground.js";
import { PlayerPlate } from "../levelObjects/playerPlate.js";
import { BallPhysics } from "../core/ballPhysics.js";
import { Brick } from "../levelObjects/brick.js";
import { BrickGrid } from "./brickGrid.js";
import { ScoreBoard } from "./scoreBoard.js";
import { LifeBoard } from "./lifeBoard.js";
import { AssetsIds, TextStyles } from "../core/gameAssets.js";
import { SaveManager } from "../core/saveManger.js";
import Input from "../core/input.js";
import { GameState } from "./gameState.js";

export class LevelScreen extends Container {
    constructor(width, height, gameInfo) {
        super();

        this._width = width;
        this._height = height;
        this.gameInfo = gameInfo;

        this.levelBackground = new LevelBackground(width, height - 2, this.backgroundTexture);
        this.levelBackground.y = 2;
        this.addChild(this.levelBackground);
        const space = this.levelBackground.getInnerSpace();

        this.playerPlate = new PlayerPlate(space.width, space.height);

        this.scoreBoard = new ScoreBoard();
        this.scoreBoard.x = this.levelBackground.width;
        this.scoreBoard.y = 16;
        this.scoreBoard.init();
        this.scoreBoard.highScore = this.gameInfo.highScore;
        this.scoreBoard.score = this.gameInfo.score;
        this.addChild(this.scoreBoard);

        this.brickGrid = new BrickGrid(space.width, space.height, 28, 11);
        this.brickGrid.setScoreCallback((score) => {
            this.gameInfo.score += score;
            this.scoreBoard.score = this.gameInfo.score;
            if (this.scoreBoard.score > this.scoreBoard.highScore) {
                this.gameInfo.highScore = this.scoreBoard.highScore = this.scoreBoard.score;
                SaveManager.saveHighScore(this.scoreBoard.score);
            }
        });

        this.innerSpace = new BallPhysics(space.width, space.height, this.playerPlate, this.brickGrid, this.gameInfo);
        this.innerSpace.x = space.x;
        this.innerSpace.y = space.y;

        this.innerSpace.addChild(this.playerPlate);
        this.innerSpace.addChild(this.brickGrid);
        this.addChild(this.innerSpace);

        this.infoTitle = new Text({
            text: "",
            style: TextStyles.LargeInfo
        });
        this.infoTitle.anchor.set(0.5);
        this.infoTitle.x = space.x + space.width / 2;
        this.infoTitle.y = space.height * 0.84;
        this.addChild(this.infoTitle);

        this.lifeBoard = new LifeBoard(4, 4);
        this.lifeBoard.x = this.levelBackground.width + 1;
        this.lifeBoard.y = (this.height - this.lifeBoard.height) / 2;
        this.resetLife();
        this.addChild(this.lifeBoard);

        this.playerPlate.setBreakCallback(() => {
            if (this.gameInfo.state != GameState.PLAYING) {
                return;
            }
            if (this.lifeBoard.lifeCount > 0) {
                this.lifeBoard.lifeCount--;
                this.gameInfo.state = GameState.LOADING_ROUND;
            } else {
                this.setInfoTitle('GAME OVER');
            }
        });

        this.hide();

    }

    initLevel(levelNum) {
        this.removeAllBricks();
        this.currentLevel = levelNum;
        this.playerPlate.visible = false;
        this.levelBackground.setBackgroundByLevel(this.currentLevel);
        if (this.currentLevel == 1) {
            this.addBrickRow(Brick.GrayBrick, 4, true);
            this.addBrickRow(Brick.RedBrick, 5, false);
            this.addBrickRow(Brick.BlueBrick, 6, false);
            this.addBrickRow(Brick.YellowBrick, 7, false);
            this.addBrickRow(Brick.PinkBrick, 8, false);
            this.addBrickRow(Brick.GreenBrick, 9, false);
        } else if (this.currentLevel == 2) {
            this.addBrickColumn(Brick.YellowBrick, 0, false, 2, 10);
            this.addBrickColumn(Brick.LightBlueBrick, 1, false, 3, 9);
            this.addBrickColumn(Brick.GreenBrick, 2, false, 4, 8);
            this.addBrickColumn(Brick.BlueBrick, 3, false, 5, 7);
            this.addBrickColumn(Brick.RedBrick, 4, false, 6, 6);
            this.addBrickColumn(Brick.YellowBrick, 5, false, 7, 5);
            this.addBrickColumn(Brick.LightBlueBrick, 6, false, 8, 4);
            this.addBrickColumn(Brick.GreenBrick, 7, false, 9, 3);
            this.addBrickColumn(Brick.BlueBrick, 8, false, 10, 2);
            this.addBrickColumn(Brick.RedBrick, 9, false, 11, 1);
            this.addBrickRow(Brick.GrayBrick, 12, true, 0, 10);
            this.addBrick(Brick.YellowBrick, 10, 12, false);
        } else if (this.currentLevel == 3) {
            this.addBrickRow(Brick.GreenBrick, 3, false);
            this.addBrickRow(Brick.WhiteBrick, 5, false, 0, 3);
            this.addBrickRow(Brick.GoldBrick, 5, false, 3, 8);
            this.addBrickRow(Brick.RedBrick, 7, false);
            this.addBrickRow(Brick.GoldBrick, 9, false, 0, 8);
            this.addBrickRow(Brick.WhiteBrick, 9, false, 8, 3);
            this.addBrickRow(Brick.PinkBrick, 11, false);
            this.addBrickRow(Brick.BlueBrick, 13, false, 0, 3);
            this.addBrickRow(Brick.GoldBrick, 13, false, 3, 8);
            this.addBrickRow(Brick.BlueBrick, 15, false);
            this.addBrickRow(Brick.GoldBrick, 17, false, 0, 8);
            this.addBrickRow(Brick.BlueBrick, 17, false, 8, 3);
        } else {
            return true;
        }
        return false;
    }

    resetLife() {
        this.lifeBoard.lifeCount = 3;
    }

    removeAllBricks() {
        this.brickGrid.removeAllBricks();
    }

    resetPlateAndBall() {
        this.playerPlate.reset();
        this.playerPlate.visible = true;
        this.innerSpace.removeAllBalls();
        this.addBall();
    }

    addBrick(brickFunc, x, y, armored) {
        this.brickGrid.addBrick(brickFunc, x, y, armored, this.levelNum);
    }

    addBrickRow(brickFunc, y, armored, start = -1, length = Infinity) {
        this.brickGrid.addBrickRow(brickFunc, y, armored, this.levelNum, start, length);
    }

    addBrickColumn(brickFunc, x, armored, start = -1, length = Infinity) {
        this.brickGrid.addBrickColumn(brickFunc, x, armored, this.levelNum, start, length);
    }

    addBall(sticked = false) {
        const ballStart = this.playerPlate.topCenter;
        this.innerSpace.createBall(ballStart, sticked);
    }

    startPlay() {
        this.setInfoTitle('');
        this.gameInfo.state = GameState.PLAYING;
        this.resetPlateAndBall();
    }

    show() {
        this.visible = true;
        this.setInfoTitle('PLAYER 1\n  READY');
        this.innerSpace.removeAllBalls();
        this.playerPlate.visible = false;
        if (this.gameInfo.isNewGame) {
            this.initLevel(1);
            this.gameInfo.isNewGame = false;
            this.resetLife();
        } else if (this.isLevelComplete()) {
            this.initLevel(this.gameInfo.round);
        }
        this.scoreBoard.score = this.gameInfo.score;
        this.scoreBoard.highScore = this.gameInfo.highScore;
    }

    hide() {
        this.visible = false;
    }

    tick(deltaTime) {
        if (Input.consumeEscape() && (this.gameInfo.state == GameState.WAITING_PLAYER || this.gameInfo.state == GameState.PLAYING)) {
            this.gameInfo.state = GameState.PAUSED;
        } else if (this.gameInfo.state == GameState.WAITING_PLAYER && Input.startLevel) {
            this.startPlay();
        }
        if (this.gameInfo.state == GameState.PLAYING) {
            this.innerSpace.tick(deltaTime);
            if (this.isLevelComplete()) {
                if (this.currentLevel < 3) {
                    this.gameInfo.round = this.currentLevel + 1;
                    this.gameInfo.state = GameState.LOADING_ROUND;
                } else {
                    this.setInfoTitle('YOU WIN');
                }
            }
        }
    }

    setInfoTitle(text) {
        this.infoTitle.text = text;
    }

    isLevelComplete() {
        return this.brickGrid.bricks.every(brick => brick.indestructible);
    }

}