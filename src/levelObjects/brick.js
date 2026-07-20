import { Graphics } from "pixi.js";

export class Brick extends Graphics {
    constructor(color, score, durability = 1, useBoldShadow = false) {
        super();
        this.color = color;
        this.durability = durability;
        this.score = score;
        this.useBoldShadow = useBoldShadow;
    }
}