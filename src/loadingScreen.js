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
        this.subContainer = new Container();
        this.background = new Graphics().rect(0, 0, this._width, this._height).fill('#000000');
        this.addChild(this.background);
        this.scoreBoard = new ScoreBoard(true);
        this.scoreBoard.init(this._width, this._height);
        this.subContainer.addChild(this.scoreBoard);
        this.infoTitle = new Text({
            text: "",
            style: TextStyles.LargeInfo
        });
        this.infoTitle.anchor.set(0.5);
        this.infoTitle.x = this._width / 2;
        this.infoTitle.y = this._height / 2;
        this.subContainer.addChild(this.infoTitle);
        this.addChild(this.subContainer);
        this.round = round;
        this.hide();
    }

    show() {
        this.visible = true;
        this.scoreBoard.highScore = this.gameInfo.highScore;
        this.scoreBoard.score = this.gameInfo.score;
        let time = 3;
        if (this.gameInfo.isNewGame) {
            this.infoTitle.style = TextStyles.LargeInfo2;
            this.infoTitle.text = 'THE ERA AND TIME OF\nTHIS STORY IS UNKNOWN.\n\n'+
            'AFTER THE MOTHER SHIP\n\"ARKANOID\" WAS DESTROYED,\nA SPACECRAFT \"VAUS\"\n'+
            'SCRAMBLED AWAY FROM IT.\n\nBUT ONLY TO BE\nTRAPPED IN SPACE WAR\nBY SOMEONE......';
            time = 6;
            this.subContainer.y = this._height;
        } else {
            this.infoTitle.style = TextStyles.LargeInfo;
            this.round = this.gameInfo.round;
        }
        return new Promise(resolve => {
            setTimeout(() => {
                this.hide();
                this.gameInfo.state = GameState.WAITING_PLAYER;
                this.round = this.gameInfo.round;
            }, time * 1000);
        });
    }

    hide() {
        this.visible = false;
    }

    tick(deltaTime) {
        if (this.visible && this.gameInfo.isNewGame) {
            if (this.subContainer.y > 0) {
                this.subContainer.y -= 1 * deltaTime;
            } else {
                this.subContainer.y = 0;
            }
        }
    }

    get round() {
        return this._round;
    }

    set round(value) {
        this._round = value;
        this.infoTitle.text = 'ROUND   ' +value.toString();
    }
}