import { Container} from "pixi.js";
import { Brick } from "../levelObjects/brick";

export class BrickGrid extends Container {

    constructor(width, height, rows, columns) {
        super();
        this.bricks = [];
        this.grid = Array.from({length: rows}, () => Array(columns).fill(null));
        
        this._width = width;
        this._height = height;

        this.rows = rows;
        this.columns = columns;

        this.cellWidth = this._width / this.columns;
        this.cellHeight = this._height / this.rows;
    }

    setScoreCallback(scoreCallback) {
        this.scoreCallback = scoreCallback;
    }

    hitBrick(brick) {
        if (brick.hit()) {
            this.removeBrick(brick);
            if (this.scoreCallback) 
                this.scoreCallback(brick.score);
        }
    }

    removeBrick(brick) {
        const index = this.bricks.indexOf(brick);
        if (index !== -1) {
            this.bricks.splice(index, 1);
        }
        this.removeChild(brick);
        this.grid[brick.gridY][brick.gridX] = null;
        brick.destroy();
    }

    getBrickAt(columnNum, rowNum) {
        if (rowNum < 0 || rowNum >= this.rows || columnNum < 0 || columnNum >= this.columns) {
            return null;
        }
        
        return this.grid[rowNum][columnNum];
    }

    getBricksNear(ballBounds) {
        const offset = 1;// Запас в 1 клетку
        const left = Math.floor(ballBounds.left / this.cellWidth) - offset;
        const right = Math.floor(ballBounds.right / this.cellWidth) + offset;
        const top = Math.floor(ballBounds.top / this.cellHeight) - offset;
        const bottom = Math.floor(ballBounds.bottom / this.cellHeight) + offset;

        const bricks = [];

        for (let rowNum = top; rowNum <= bottom; rowNum++) {
            for (let columnNum = left; columnNum <= right; columnNum++) {
                const brick = this.getBrickAt(columnNum, rowNum);
                if (brick) {
                    bricks.push(brick);
                }
            }
        }

        return bricks;
    }

    addBrick(brickFunc, x, y, armored = false, levelNum = 1) {
        const brick = brickFunc(this.cellWidth, this.cellHeight, armored, levelNum);

        brick.x = x * this.cellWidth;
        brick.y = y * this.cellHeight;

        this.addChild(brick);

        brick.gridX = x;
        brick.gridY = y;
        this.grid[y][x] = brick;

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