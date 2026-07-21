import { Container, Sprite, Assets, Graphics } from "pixi.js";
import { AssetsIds } from "../core/gameAssets";

export class LifeBoard extends Container {

    constructor(rows, columns) {
        super();

        this._lifeCount = 0;

        const spacing = 1;
        this.texture = Assets.get(AssetsIds.LifeTexture);
        this.texture.source.scaleMode = 'nearest';

        this.cellWidth = this.texture.width;
        this.cellHeight = this.texture.height;

        this.rows = rows;
        this.columns = columns;

        this._width = columns * (this.cellWidth + spacing) - 1;
        this._height = rows * (this.cellHeight + spacing) - 1;

        const bounds = new Graphics().rect(0, 0, this._width, this._height).fill({ color: "#ffffff", alpha: 0 });
        this.addChild(bounds);

    }

    get lifeCount() {
        return this._lifeCount;
    }

    set lifeCount(value) {
        this.removeChildren().forEach(child => child.destroy());
        this._lifeCount = value;
        if (this._lifeCount < 0) {
            this._lifeCount = 0;
        }
        if (this._lifeCount > this.rows * this.columns) {
            this._lifeCount = this.rows * this.columns;
        }
        let counter = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const sprite = new Sprite(this.texture);
                sprite.x = j * (this.cellWidth + 1);
                sprite.y = i * (this.cellHeight + 1);
                this.addChild(sprite);
                counter++;
                if (counter >= this._lifeCount) {
                    return;
                }
            }
        }
    }
}