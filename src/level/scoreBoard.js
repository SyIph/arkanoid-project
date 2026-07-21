import { Container, Text, TextStyle } from "pixi.js";

export class ScoreBoard extends Container {
    constructor() {
        super();

        const titleStyle = new TextStyle({
            fill: '#990000',
            fontFamily: "Arial",
            fontSize: 8,
            fontWeight: "bold"
        });

        const valueStyle = new TextStyle({
            fill: '#ffffff',
            fontFamily: "Arial",
            fontSize: 10,
            fontWeight: "bold"
        });

        this.highTitle = new Text({
            text: "HIGH\n   SCORE",
            style: titleStyle
        });
        this.addChild(this.highTitle);

        this.highValue = new Text({
            text: "",
            style: valueStyle
        });
        this.highValue.anchor.set(0.5, 0);
        this.highValue.y = this.highTitle.y + this.highTitle.height - 4;
        this.addChild(this.highValue);

        this.playerTitle = new Text({
            text: "1UP",
            style: titleStyle
        });
        this.playerTitle.y = this.highValue.y + this.highValue.height + 4;
        this.addChild(this.playerTitle);

        this.playerValue = new Text({
            text: "",
            style: valueStyle
        });
        this.playerValue.anchor.set(0.5, 0);
        this.playerValue.y = this.playerTitle.y + this.playerTitle.height - 4;
        this.addChild(this.playerValue);

        this.score = 0;
        this.highScore = 0;

    }

    get score() {
        return this._score;
    }

    set score(value) {
        this._score = value;
        this.playerValue.text = value.toString();
        if (value > this.highScore) {
            this.highScore = value;
        }
    }

    get highScore() {
        return this._highScore;
    }

    set highScore(value) {
        this._highScore = value;
        this.highValue.text = value.toString();
    }

    init() {
        this.highValue.x = this.width / 2;
        this.playerValue.x = this.width / 2;
    }
}