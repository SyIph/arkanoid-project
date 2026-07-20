import { Container } from "pixi.js";
import { Ball } from "../levelObjects/ball";

export class BallPhysics extends Container {
    constructor(plate) {
        super();
        this.plate = plate;
        this.balls = [];
        this.bricks = [];
    }

    checkWalls() {
        const ballToRemove = [];
        const innerWidth = this.width;
        const innerHeight = this.height;
        for (const ball of this.balls) {

            ball.x += ball.velocity.x;
            ball.y += ball.velocity.y;

            const halfWidth = ball.width / 2;
            const halfHeight = ball.height / 2;

            const ballBounds = this.getBounds(ball);

            if (ballBounds.left <= 0 && ball.velocity.x < 0) {
                ball.x = halfWidth;
                ball.velocity.x *= -1;
            }

            if (ballBounds.right >= innerWidth && ball.velocity.x > 0) {
                ball.x = innerWidth - halfWidth;
                ball.velocity.x *= -1;
            }

            if (ballBounds.top <= 0 && ball.velocity.y < 0) {
                ball.y = halfHeight;
                ball.velocity.y *= -1;
            }

            if (ballBounds.bottom >= innerHeight && ball.velocity.y > 0) {
                ballToRemove.push(ball);
            }
        }

        for (const ball of ballToRemove) {
            this.removeBall(ball);
        }
    }

    checkPlate() {

        const plateBounds = this.getBounds(this.plate);

        for (const ball of this.balls) {
            if (ball.velocity.y <= 0) {
                continue;
            }

            const ballBounds = this.getBounds(ball);

            if (ballBounds.bottom < plateBounds.top) {
                continue;
            }

            if (ballBounds.right < plateBounds.left || ballBounds.left > plateBounds.right) {
                continue;
            }

            ball.y = plateBounds.top - ball.height / 2;

            ball.velocity.y = -Math.abs(ball.velocity.y);

            if (ball.x < this.plate.x) {
                ball.velocity.x = -Math.abs(ball.velocity.x);
            } else {
                ball.velocity.x = Math.abs(ball.velocity.x);
            }
        }
    }

    removeBall(ball) {
        const index = this.balls.indexOf(ball);
        if (index !== -1) {
            this.balls.splice(index, 1);
        }
        this.removeChild(ball);
        ball.destroy();
        if (this.balls.length == 0) {
            this.plate.playBreak(function () {
                console.log("Game over!");
            })
        }
    }

    createBall(ballStart) {
        const ball = new Ball(ballStart.x + 4, ballStart.y - 2);
        this.addChild(ball);
        this.balls.push(ball);
    }

    addBrickToCheck(brick) {

    }

    getBounds(elem) {
        // У Graphics нет anchor, потому выкручиваюсь...
        const anchorX = elem.anchor?.x ?? 0;
        const anchorY = elem.anchor?.y ?? 0;

        const left = elem.x - elem.width * anchorX;
        const top = elem.y - elem.height * anchorY;

        return { left, right: left + elem.width, top, bottom: top + elem.height }
    }

    initTicker(ticker) {
        ticker.add(() => {
            this.checkWalls();
            this.checkPlate();
        });
    }
}