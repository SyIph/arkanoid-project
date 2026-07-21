import { Container, Text, TextStyle } from "pixi.js";
import { TextStyles } from "../core/gameAssets.js";

export class ScoreBoard extends Container {
    constructor(horizontal = false) {
        super();
        this.horizontal = horizontal;

        this.highTitle = new Text({
            text: horizontal ? "HIGH SCORE" : "HIGH\n   SCORE",
            style: TextStyles.ScoreTitle
        });
        this.addChild(this.highTitle);
        if (horizontal) {
            this.highTitle.anchor.set(0.5, 0);
        }

        this.highValue = new Text({
            text: "",
            style: TextStyles.ScoreValue
        });
        this.highValue.anchor.set(0.5, 0);
        this.addChild(this.highValue);

        this.playerTitle = new Text({
            text: "1UP",
            style: TextStyles.ScoreTitle
        });
        if (horizontal) {
            this.playerTitle.anchor.set(0.5, 0);
        }
        this.addChild(this.playerTitle);

        this.playerValue = new Text({
            text: "",
            style: TextStyles.ScoreValue
        });
        this.playerValue.anchor.set(0.5, 0);
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
    }

    get highScore() {
        return this._highScore;
    }

    set highScore(value) {
        this._highScore = value;
        this.highValue.text = value.toString();
    }

    init(width = 0, height = 0) {
        if (!this.horizontal) {
            this.highValue.x = this.width / 2;
            this.playerValue.x = this.width / 2;
            this.highValue.y = this.highTitle.y + this.highTitle.height - 4;
            this.playerTitle.y = this.highValue.y + this.highValue.height + 4;
        } else {
            this.highTitle.x = width / 2;
            this.highValue.x = height / 2;
            this.playerTitle.x = width / 4;
            this.playerValue.x = height / 4;
            this.playerTitle.y = 8;
            this.highTitle.y = this.playerTitle.y;
            this.highValue.y = this.highTitle.y + this.highTitle.height - 4;
        }
        this.playerValue.y = this.playerTitle.y + this.playerTitle.height - 4;
    }
}