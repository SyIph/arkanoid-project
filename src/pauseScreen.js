import { Container, Graphics, Text, Sprite, Assets } from "pixi.js";
import { ScoreBoard } from "./level/scoreBoard";
import { AssetsIds, TextStyles } from "./core/gameAssets";
import { GameState } from "./level/gameState";
import Input from "./core/input.js";

export class PauseScreen extends Container {
    constructor(size, gameInfo, round = 1) {
        super();
        this.gameInfo = gameInfo;
        this._width = size;
        this._height = size;

        this.background = new Graphics().rect(0, 0, this._width, this._height).fill('#000000');
        this.addChild(this.background);

        this.scoreBoard = new ScoreBoard(true);
        this.scoreBoard.init(this._width, this._height);
        this.addChild(this.scoreBoard);

        this.logo = new Sprite(Assets.get(AssetsIds.ArkanoidLogo));
        this.logo.anchor.set(0.5);
        this.logo.x = this._width / 2;
        this.logo.y = this._height / 2 - this.logo.height;
        this.addChild(this.logo);

        this.selected = 0;

        this.visible = false;

        this.newGame = new Text({
            text: "",
            style: TextStyles.LargeInfo
        });

        const offsetX = 44;
        const offsetY = 35;

        this.newGame.anchor.set(1, 0);
        this.newGame.x = this._width / 2 + offsetX;
        this.newGame.y = this._height / 2 + offsetY;
        this.addChild(this.newGame);

        this.continueGame = new Text({
            text: "",
            style: TextStyles.LargeInfo
        });
        this.continueGame.anchor.set(1, 0);
        this.continueGame.x = this._width / 2 + offsetX - 8;
        this.continueGame.y = this._height / 2 + offsetY + 20;
        this.addChild(this.continueGame);

        this.selectButton(0);
    }

    selectButton(value) {
        this.selected = value;
        if (this.gameInfo.isNewGame) {
            this.selected = 0;
        }
        if (this.selected < 0) {
            this.selected = 1;
        } else if (this.selected > 1) {
            this.selected = 0;
        }
        this.newGame.text = (this.selected == 0 ? '> ' : '') + "New Game";
        this.continueGame.text = (this.selected == 1 ? '> ' : '') + "Continue";
    }

    prevButton() {
        this.selectButton(this.selected - 1);
    }

    nextButton() {
        this.selectButton(this.selected + 1);
    }

    show() {
        this.visible = true;
        this.scoreBoard.highScore = this.gameInfo.highScore;
        this.scoreBoard.score = this.gameInfo.score;
    }

    hide() {
        this.visible = false;
    }

    tick(deltaTime) {
        if (this.gameInfo.state == GameState.PAUSED) {
            if (this.gameInfo.isNewGame) {
                this.continueGame.visible = false;
            } else {
                this.continueGame.visible = true;
            }
            if (Input.upPressed) {
                this.prevButton();
            } else if (Input.downPressed) {
                this.nextButton();
            } else if (Input.escapePressed && !this.gameInfo.isNewGame) {
                console.log("pause1 -> loading");
                this.gameInfo.state = GameState.LOADING_ROUND;
            } else if (Input.enterPressed) {
                this.gameInfo.state = GameState.LOADING_ROUND;
                if (this.selected == 0) {
                    this.gameInfo.isNewGame = true;
                    this.gameInfo.score = 0;
                }
            }
        }
    }
}