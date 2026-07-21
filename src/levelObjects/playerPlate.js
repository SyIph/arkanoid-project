import { AnimatedSprite, Point, Assets, Texture } from "pixi.js";
import Input from "../core/input.js";
import { AssetsIds } from "../core/gameAssets.js";

export class PlayerPlate extends AnimatedSprite {

    constructor(windowSizeX, windowSizeY) {
        const baseTexture = Assets.get(AssetsIds.PlateTexture);
        super([baseTexture]);
        this.allStates = {
            'base': [
                baseTexture
            ],
            'break': [
                Assets.get(AssetsIds.PlateTexture),
                Assets.get(AssetsIds.PlateBreak1Texture),
                Assets.get(AssetsIds.PlateBreak2Texture),
                Assets.get(AssetsIds.PlateBreak3Texture),
                Texture.EMPTY
            ]
        }

        this.animationSpeed = 0.0;
        this.anchor.set(0.5, 0);
        this.loop = false;

        this.windowSizeX = windowSizeX;
        this.windowSizeY = windowSizeY;
        this.speed = 4.0;

        this.reset();
        this.y = this.windowSizeY - 16;
    }

    reset() {
        this.visible = true;
        this.setState('base');
        this.animationSpeed = 0.0;
        this.anchor.set(0.5, 0);
        this.x = this.windowSizeX / 2;
    }

    playBreak() {
        this.visible = true;
        this.setState('break');
        this.animationSpeed = 0.1;
        this.anchor.set(0.5);
        this.play();
        this.onComplete = () => {
            if (this.breakCallback)
                this.breakCallback();
        };
    }

    setState(state) {
        this.state = state;
        this.textures = this.allStates[state];
    }

    get topCenter() {
        return new Point(this.x, this.y);
    }

    move(dir, deltaTime) {
        if (this.state == 'break')
            return;
        this.x += dir * this.speed * deltaTime;
        this.x = Math.min(Math.max(this.width / 2, this.x), this.windowSizeX - this.width / 2);
    }

    setBreakCallback(breakCallback) {
        this.breakCallback = breakCallback;
    }
}