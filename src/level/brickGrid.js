import { Container} from "pixi.js";
import { Brick } from "../levelObjects/brick";

export class BrickGrid extends Container {

    constructor(width, height, rows, columns) {
        super();
        this.bricks = [];
        
        this._width = width;
        this._height = height;

        this.rows = rows;
        this.columns = columns;

        this.cellWidth = this._width / this.columns;
        this.cellHeight = this._height / this.rows;
    }

    hitBrick(brick) {
        if (brick.hit()) {
            this.removeBrick(brick);
        }
    }

    removeBrick(brick) {
        const index = this.bricks.indexOf(brick);
        if (index !== -1) {
            this.bricks.splice(index, 1);
        }
        this.removeChild(brick);
        brick.destroy();
    }

    addBrick(brickFunc, x, y, armored = false, levelNum = 1) {
        const brick = brickFunc(this.cellWidth, this.cellHeight, armored, levelNum);

        brick.x = x * this.cellWidth;
        brick.y = y * this.cellHeight;

        this.addChild(brick);
        this.bricks.push(brick);
    }

    addBrickRow(brickFunc, y, armored = false, levelNum = 1) {
        for (let x = 0; x < this.columns; x++) {
            this.addBrick(brickFunc, x, y, armored, levelNum);
        }
    }

    addBrickColumn(brickFunc, x, armored = false, levelNum = 1) {
        for (let y = 0; y < this.rows; y++) {
            this.addBrick(brickFunc, x, y, armored, levelNum);
        }
    }

}