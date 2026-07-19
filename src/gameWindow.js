import { Container, Graphics } from "pixi.js";

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

        this.scale.set(size / this.innerSize);
    }
}