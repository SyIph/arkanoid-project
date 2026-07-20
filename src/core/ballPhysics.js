import { Container } from "pixi.js";
import { Ball } from "../levelObjects/ball";

export class BallPhysics extends Container {
    constructor(plate, brickGrid) {
        super();
        this.plate = plate;
        this.brickGrid = brickGrid;
        this.balls = [];
        this.bricks = [];
        this.ballToRemove = [];
    }

    checkWalls(ball) {
        const innerWidth = this.width;
        const innerHeight = this.height;

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
            this.ballToRemove.push(ball);
        }
    }

    checkPlate(ball) {
        const plateBounds = this.getBounds(this.plate);

        if (ball.velocity.y <= 0) {
            return;
        }

        const ballBounds = this.getBounds(ball);

        if (ballBounds.bottom < plateBounds.top) {
            return;
        }

        if (ballBounds.right < plateBounds.left || ballBounds.left > plateBounds.right) {
            return;
        }

        ball.y = plateBounds.top - ball.height / 2;

        ball.velocity.y = -Math.abs(ball.velocity.y);

        if (ball.x < this.plate.x) {
            ball.velocity.x = -Math.abs(ball.velocity.x);
        } else {
            ball.velocity.x = Math.abs(ball.velocity.x);
        }
    }

    checkBricks(ball) {
        for (const brick of this.brickGrid.bricks) {
            const brickBounds = this.getBounds(brick);
            const ballBounds = this.getBounds(ball);

            if (ballBounds.right < brickBounds.left || ballBounds.left > brickBounds.right ||
                ballBounds.top > brickBounds.bottom || ballBounds.bottom < brickBounds.top) {
                continue;
            }

            const collisionLeft = ballBounds.right - brickBounds.left;
            const collisionRight = brickBounds.right - ballBounds.left;
            const collisionHorizontal = Math.min(collisionLeft, collisionRight);// Какая меньше, к той стороне ближе

            const collisionTop = ballBounds.bottom - brickBounds.top;
            const collisionBottom = brickBounds.bottom - ballBounds.top;
            const collisionVertical = Math.min(collisionTop, collisionBottom);// Какая меньше, к той стороне ближе

            if (collisionHorizontal < collisionVertical) {// Столкновение произошло по горизонтали
                if (ball.velocity.x > 0) {
                    ball.x -= collisionHorizontal;
                } else {
                    ball.x += collisionHorizontal;
                }
                ball.velocity.x *= -1;
            } else { // Столкновение произошло по вертикали
                if (ball.velocity.y > 0) {
                    ball.y -= collisionVertical;
                } else {
                    ball.y += collisionVertical;
                }
                ball.velocity.y *= -1;
            }

            this.brickGrid.hitBrick(brick);
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

    createBrick(brick) {
        this.bricks = [];
    }

    getBounds(elem) {
        const anchorX = elem.anchor?.x ?? 0;
        const anchorY = elem.anchor?.y ?? 0;

        const left = elem.x - elem.width * anchorX;
        const top = elem.y - elem.height * anchorY;

        return { left, right: left + elem.width, top, bottom: top + elem.height }
    }

    initTicker(ticker) {
        ticker.add(() => {
            for (const ball of this.balls) {
                this.checkWalls(ball);
                this.checkPlate(ball);
                this.checkBricks(ball);
            }
            for (const ball of this.ballToRemove) {
                this.removeBall(ball);
            }
            this.ballToRemove.length = 0;
            console.log(this.ballToRemove.length);
        });
    }
}