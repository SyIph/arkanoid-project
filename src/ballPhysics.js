import { Container } from "pixi.js";
import { Ball } from "./ball";

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

            if (ball.left <= 0 && ball.velocity.x < 0) {
                ball.x = halfWidth;
                ball.velocity.x *= -1;
            }

            if (ball.right >= innerWidth && ball.velocity.x > 0) {
                ball.x = innerWidth - halfWidth;
                ball.velocity.x *= -1;
            }

            if (ball.top <= 0 && ball.velocity.y < 0) {
                ball.y = halfHeight;
                ball.velocity.y *= -1;
            }

            if (ball.bottom >= innerHeight && ball.velocity.y > 0) {
                ballToRemove.push(ball);
            }
        }

        for (const ball of ballToRemove) {
            this.removeBall(ball);
        }
    }

    checkPlate() {
        for (const ball of this.balls) {
            if (ball.velocity.y <= 0) {
                continue;
            }

            if (ball.bottom < this.plate.top) {
                continue;
            }

            if (ball.right < this.plate.left || ball.left > this.plate.right) {
                continue;
            }

            ball.y = this.plate.top - ball.height / 2;

            ball.velocity.y = -Math.abs(ball.velocity.y)

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

    initTicker(ticker) {
        ticker.add(() => {
            this.checkWalls();
            this.checkPlate();
        });
    }
}