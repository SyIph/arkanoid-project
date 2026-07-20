import { AnimatedSprite, Point, Assets } from "pixi.js";
import Input from "./Input.js";

export class PlayerPlate extends AnimatedSprite {

    constructor(windowSizeX, windowSizeY) {
        const baseTexture = Assets.get("/assets/Plate1.png");
        super([baseTexture]);
        this.allStates = {
            'base': [
                baseTexture
            ],
            'break': [
                Assets.get("/assets/PlateBreak1.png"),
                Assets.get("/assets/PlateBreak1.png"),
                Assets.get("/assets/PlateBreak2.png"),
                Assets.get("/assets/PlateBreak3.png"),
                Assets.get("/assets/PlateBreak3.png")
            ]
        }

        this.setState('base');

        this.animationSpeed = 0.0;
        this.loop = false;
        this.anchor.set(0.5, 0);

        this.windowSizeX = windowSizeX;
        this.windowSizeY = windowSizeY;
        this.speed = 2.0;

        this.x = this.windowSizeX / 2;
        this.y = this.windowSizeY - 16;
    }

    playBreak(callback) {
        this.setState('break');
        this.animationSpeed = 0.1;
        this.anchor.set(0.5);
        this.play();
        this.onComplete = () => {
            callback();
        };
    }

    setState(state) {
        this.state = state;
        this.textures = this.allStates[state];
        this.textures.forEach(texture => {
            texture.source.scaleMode = "nearest";
        });
    }

    initTicker(ticker) {
        ticker.add(() => this.updateInput());
    }

    updateInput() {
        if (Input.left) {
            this.move(-1);
        }
        if (Input.right) {
            this.move(1);
        }
    }

    get topCenter() {
        return new Point(this.x, this.y);
    }

    get left() {
        return this.x - this.width / 2;
    }

    get right() {
        return this.x + this.width / 2;
    }

    get top() {
        return this.y - this.height / 2;
    }

    get bottom() {
        return this.y + this.height / 2;
    }

    move(dir) {
        if (this.state == 'break')
            return;
        this.x += dir * this.speed;
        this.x = Math.min(Math.max(this.width / 2, this.x), this.windowSizeX - this.width / 2);
    }
}