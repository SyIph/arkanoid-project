import { Container, Graphics, Texture, Rectangle, Sprite, TilingSprite, Assets } from "pixi.js";
import { LevelContainer } from "./level/levelContainer";

export class GameWindow extends Container {
    constructor(app, innerSize) {
        super();

        this.app = app;
        this.innerSize = innerSize;
        this.marginPercent = 1.0;

        this.app.renderer.on('resize', () => this.resize());
        this.resize();

        this.background = new Graphics().rect(0, 0, this.innerSize, this.innerSize).fill('#000000');
        this.addChild(this.background);

        const size = Math.round(this.innerSize * 0.825);

        this.levelContainer = new LevelContainer(size, this.innerSize);
        this.levelContainer.x = 2;
        this.addChild(this.levelContainer);

        this.initTicker(this.app.ticker);
    }

    initTicker(ticker) {
        this.levelContainer.initTicker(ticker);
    }

    setMarginPercent(value) {
        this.marginPercent = value;
        this.resize();
        return this;
    }

    resize() {
        const size = Math.min(window.innerWidth, window.innerHeight) * this.marginPercent;

        this.x = (window.innerWidth - size) / 2;
        this.y = (window.innerHeight - size) / 2;

        //this.scale.set(size / this.innerSize);
    }
}