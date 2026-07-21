import { Container, Graphics, Texture, Rectangle, Sprite, TilingSprite, Assets, TextStyle, Text } from "pixi.js";
import { LevelBackground } from "../levelBg/levelBackground";
import { PlayerPlate } from "../levelObjects/playerPlate";
import { BallPhysics } from "../core/ballPhysics";
import { Brick } from "../levelObjects/brick";
import { BrickGrid } from "./brickGrid";
import { ScoreBoard } from "./scoreBoard";
import { LifeBoard } from "./lifeBoard";
import { AssetsIds } from "../core/gameAssets";
import { SaveManager } from "../core/saveManger";
import Input from "../core/input.js";
import { GameState } from "../level/gameState.js";

export class LevelContainer extends Container {
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
        this.scoreBoard.highScore = SaveManager.loadHighScore();
        this.addChild(this.scoreBoard);

        this.brickGrid = new BrickGrid(space.width, space.height, 28, 11);
        this.brickGrid.setScoreCallback((score) => {
            this.scoreBoard.score += score;
            if (this.scoreBoard.score > this.scoreBoard.highScore) {
                this.scoreBoard.highScore = this.scoreBoard.score;
                SaveManager.saveHighScore(this.scoreBoard.score);
            }
        });

        this.innerSpace = new BallPhysics(space.width, space.height, this.playerPlate, this.brickGrid);
        this.innerSpace.x = space.x;
        this.innerSpace.y = space.y;

        this.innerSpace.addChild(this.playerPlate);
        this.innerSpace.addChild(this.brickGrid);
        this.addChild(this.innerSpace);

        const textStyle = new TextStyle({
            fill: '#ffffff',
            fontFamily: "Arial",
            fontSize: 16,
            fontWeight: "bold"
        });

        this.infoTitle = new Text({
            text: "",
            style: textStyle
        });
        this.infoTitle.anchor.set(0.5);
        this.infoTitle.x = space.x + space.width / 2;
        this.infoTitle.y = space.height * 0.84;
        this.addChild(this.infoTitle);

        this.lifeBoard = new LifeBoard(4, 4);
        this.lifeBoard.x = this.levelBackground.width + 1;
        this.lifeBoard.y = (this.height - this.lifeBoard.height) / 2;
        this.lifeBoard.lifeCount = 3;
        this.addChild(this.lifeBoard);

        this.playerPlate.setBreakCallback(() => {
            if (this.lifeBoard.lifeCount > 0) {
                this.lifeBoard.lifeCount--;
                this.startWaiting();
            } else if (this.brickGrid.bricks.length == 0) {
                if (this.initLevel(this.currentLevel + 1)) {
                    this.setInfoTitle('YOU WIN');
                }
            } else {
                this.setInfoTitle('GAME OVER');
            }
        });

        this.initLevel(1);
    }

    initLevel(levelNum) {
        this.removeAllBricks();
        this.currentLevel = levelNum;
        this.playerPlate.visible = false;
        if (levelNum == 1) {
            this.setBackground(AssetsIds.Level1BgTexture);
            this.addBrickRow(Brick.GrayBrick, 4, true, this.levelNum);
            this.addBrickRow(Brick.RedBrick, 5, false, this.levelNum);
            this.addBrickRow(Brick.BlueBrick, 6, false, this.levelNum);
            this.addBrickRow(Brick.OrangeBrick, 7, false, this.levelNum);
            this.addBrickRow(Brick.PinkBrick, 8, false, this.levelNum);
            this.addBrickRow(Brick.GreenBrick, 9, false, this.levelNum);
        } else {
            return true;
        }
        this.startWaiting();
        return false;
    }

    removeAllBricks() {
        this.brickGrid.removeAllBricks();
    }

    setBackground(texture) {
        this.levelBackground.setBackgroundTexture(texture);
    }

    resetPlateAndBall() {
        this.playerPlate.reset();
        this.playerPlate.visible = true;
        this.innerSpace.removeAllBalls();
        this.addBall();
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

    addBall(sticked = false) {
        const ballStart = this.playerPlate.topCenter;
        this.innerSpace.createBall(ballStart, sticked);
    }

    startWaiting() {
        this.setInfoTitle('PLAYER 1\n  READY');
        this.gameInfo.state = GameState.WAITING_PLAYER;
    }

    startPlay() {
        this.setInfoTitle('');
        this.gameInfo.state = GameState.PLAYING;
        this.resetPlateAndBall();
    }

    initTicker(ticker) {
        ticker.add(() => {
            if (this.gameInfo.state == GameState.WAITING_PLAYER && Input.startLevel) {
                this.startPlay();
            }
        });
        this.playerPlate.initTicker(ticker);
        this.innerSpace.initTicker(ticker);
    }

    setInfoTitle(text) {
        this.infoTitle.text = text;
    }

}