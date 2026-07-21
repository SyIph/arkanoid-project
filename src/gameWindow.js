import { Container, Graphics, Texture, Rectangle, Sprite, TilingSprite, Assets } from "pixi.js";
import { LevelScreen } from "./level/levelScreen";
import { LoadingScreen } from "./loadingScreen";
import { PauseScreen } from "./pauseScreen";
import { GameState } from "./level/gameState";
import { SaveManager } from "./core/saveManger";
import Input from "./core/input.js";

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

        const sizeWidth = Math.round(this.innerSize * 0.825);

        this.gameInfo = { 
            state: GameState.PAUSED,
            round: 1,
            score: 0,
            highScore: SaveManager.loadHighScore(),
            isNewGame: true
        };

        this.levelScreen = new LevelScreen(sizeWidth, this.innerSize, this.gameInfo);
        this.levelScreen.x = 2;
        this.addChild(this.levelScreen);

        this.loadingScreen = new LoadingScreen(this.innerSize, this.gameInfo);
        this.addChild(this.loadingScreen);

        this.pauseScreen = new PauseScreen(this.innerSize, this.gameInfo);
        this.addChild(this.pauseScreen);

        this.initTicker(this.app.ticker);

        this.maskRect = new Graphics().rect(0, 0, this.innerSize, this.innerSize).fill('#000000');
        this.mask = this.maskRect;
        this.addChild(this.maskRect);
    }

    initTicker(ticker) {
        ticker.add(async (ticker) => {
            const deltaTime = ticker.deltaTime;
            if (this.gameInfo.state == GameState.PAUSED && !this.pauseScreen.visible) {
                this.levelScreen.hide();
                this.pauseScreen.show();
            } else if (this.gameInfo.state == GameState.LOADING_ROUND && !this.loadingScreen.visible) {
                this.levelScreen.hide();
                this.pauseScreen.hide();
                await this.loadingScreen.show(3);
            } else if (this.gameInfo.state == GameState.WAITING_PLAYER && !this.levelScreen.visible) {
                this.pauseScreen.hide();
                this.levelScreen.show();
            }
            this.levelScreen.tick(deltaTime);
            this.loadingScreen.tick(deltaTime);
            this.pauseScreen.tick(deltaTime);
            Input.tick();
        });
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