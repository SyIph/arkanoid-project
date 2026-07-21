import { Container, Graphics, Text } from "pixi.js";
import { ScoreBoard } from "./level/scoreBoard";
import { TextStyles } from "./core/gameAssets";
import { GameState } from "./level/gameState";

export class LoadingScreen extends Container {
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

        this.infoTitle = new Text({
            text: "",
            style: TextStyles.LargeInfo
        });
        this.infoTitle.anchor.set(0.5);
        this.infoTitle.x = this._width / 2;
        this.infoTitle.y = this._height / 2;
        this.addChild(this.infoTitle);
        this.round = round;
        this.visible = false;
    }

    show(seconds) {
        this.visible = true;
        this.scoreBoard.highScore = this.gameInfo.highScore;
        this.scoreBoard.score = this.gameInfo.score;
        return new Promise(resolve => {
            setTimeout(() => {
                this.hide();
                this.gameInfo.state = GameState.WAITING_PLAYER;
            }, seconds * 1000);
        });
    }

    hide() {
        this.visible = false;
    }

    get round() {
        return this._round;
    }

    set round(value) {
        this._round = value;
        this.infoTitle.text = 'ROUND   ' +value.toString();
    }
}