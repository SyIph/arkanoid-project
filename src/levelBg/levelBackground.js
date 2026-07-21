import { Container, Graphics, Texture, Rectangle, Sprite, TilingSprite, Assets } from "pixi.js";
import { BorderElement } from "./borderElement";
import { AssetsIds } from "../core/gameAssets";

export class LevelBackground extends Container {
    constructor(width, height, backgroundTexture) {
        super();

        this._width = width;
        this._height = height;

        this.backgroundTexture = backgroundTexture;

        const atlas = Assets.get(AssetsIds.BorderTexture);

        const borderTopLeftTexture = new Texture({
            source: atlas.source,
            frame: new Rectangle(1, 1, 8, 8)
        });
        const borderTopRightTexture = new Texture({
            source: atlas.source,
            frame: new Rectangle(19, 1, 8, 8)
        });
        const borderTopTexture = new Texture({
            source: atlas.source,
            frame: new Rectangle(10, 1, 8, 8)
        });
        const borderRightTexture = new Texture({
            source: atlas.source,
            frame: new Rectangle(1, 10, 8, 8)
        });

        this.topLeftBorder = new Sprite(borderTopLeftTexture);
        this.topLeftBorder.x = 1;
        this.topLeftBorder.y = 1;

        this.topRightBorder = new Sprite(borderTopRightTexture);
        this.topRightBorder.x = this._width - this.topRightBorder.width - 1;
        this.topRightBorder.y = 1;

        this.horizontalBorder = new TilingSprite({
            texture: borderTopTexture,
            width: this._width - this.topLeftBorder.width - this.topRightBorder.width - 1,
            height: this.topLeftBorder.height
        });
        this.horizontalBorder.x = this.topLeftBorder.width + 1;
        this.horizontalBorder.y = 1;

        this.verticalLeftBorder = new TilingSprite({
            texture: borderRightTexture,
            width: this.topLeftBorder.width,
            height: this._height - this.topLeftBorder.height - 1
        });
        this.verticalLeftBorder.x = 1;
        this.verticalLeftBorder.y = this.topLeftBorder.height + 1;

        this.verticalRightBorder = new TilingSprite({
            texture: borderRightTexture,
            width: this.topLeftBorder.width,
            height: this._height - this.topLeftBorder.height - 1
        });
        this.verticalRightBorder.x = this._width - this.verticalRightBorder.width - 1;
        this.verticalRightBorder.y = this.topLeftBorder.height + 1;

        const borderElementTexture = Assets.get("/assets/BorderElementTex.png");

        this.borderHorizontalElement1 = new BorderElement();
        this.borderHorizontalElement1.x = this._width / 4 - this.borderHorizontalElement1.width / 2;

        this.borderHorizontalElement2 = new BorderElement();
        this.borderHorizontalElement2.x = this._width / 4 * 3 - this.borderHorizontalElement2.width / 2;

        const space = this.getInnerSpace();
        const background = new TilingSprite({
            texture: Assets.get(this.backgroundTexture),
            width: space.width,
            height: space.height
        });
        background.x = space.x;
        background.y = space.y - 1;
        this.addChild(background);

        this.addChild(this.topLeftBorder);
        this.addChild(this.topRightBorder);
        this.addChild(this.horizontalBorder);
        this.addChild(this.verticalLeftBorder);
        this.addChild(this.verticalRightBorder);
        this.addChild(this.borderHorizontalElement1);
        this.addChild(this.borderHorizontalElement2);

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < 4; i++) {
                const borderVerticalElement = new BorderElement();
                borderVerticalElement.setVertical();

                borderVerticalElement.x = j * (this._width - borderVerticalElement.width);
                borderVerticalElement.y = (this._height + 120) / 6 * (i + 1) - 36;

                this.addChild(borderVerticalElement);
            }
        }
    }

    getInnerSpace() {
        const offsetX = 2 + this.verticalLeftBorder.width;
        const offsetY = 4 + this.horizontalBorder.height;
        return new Rectangle(offsetX, offsetY, this._width - offsetX * 2, this._height - offsetY)
    }
}