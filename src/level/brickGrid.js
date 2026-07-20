import { Container} from "pixi.js";
import { Brick } from "../levelObjects/brick";

export class BrickGrid extends Container {

    constructor(width, height, rows, columns) {
        super();
        
        this._width = width;
        this._height = height;

        this.rows = rows;
        this.columns = columns;

        this.cellWidth = this._width / this.columns;
        this.cellHeight = this._height / this.rows;

        console.log(this.cellWidth, this.cellHeight);
    }

    addBrick(brickFunc, x, y, levelNum = 1) {
        const brick = brickFunc(this.cellWidth, this.cellHeight, levelNum);

        brick.x = x * this.cellWidth;
        brick.y = y * this.cellHeight;

        this.addChild(brick);
    }

    addBrickRow(brickFunc, y, levelNum = 1) {
        for (let x = 0; x < this.columns; x++) {
            this.addBrick(brickFunc, x, y);
        }
    }

    addBrickColumn(brickFunc, x, levelNum = 1) {
        for (let y = 0; y < this.rows; y++) {
            this.addBrick(brickFunc, x, y);
        }
    }

}