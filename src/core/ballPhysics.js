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

    checkWalls(ball, newBallX, newBallY) {
        const innerWidth = this.width;
        const innerHeight = this.height;

        const halfWidth = ball.width / 2;
        const halfHeight = ball.height / 2;

        const ballBounds = this.getBoundsAt(ball, newBallX, newBallY);

        if (ballBounds.left <= 0 && ball.velocity.x < 0) {
            newBallX = halfWidth;
            ball.velocity.x *= -1;
        }

        if (ballBounds.right >= innerWidth && ball.velocity.x > 0) {
            newBallX = innerWidth - halfWidth;
            ball.velocity.x *= -1;
        }

        if (ballBounds.top <= 0 && ball.velocity.y < 0) {
            newBallY = halfHeight;
            ball.velocity.y *= -1;
        }

        if (ballBounds.bottom >= innerHeight && ball.velocity.y > 0) {
            this.ballToRemove.push(ball);
        }
    }

    checkPlate(ball, newBallX, newBallY) {
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

    checkBricks(ball, newBallX, newBallY) {
        const ballBounds = this.getBounds(ball);

        const bricks = this.brickGrid.getBricksNear(ballBounds);

        for (const brick of this.brickGrid.bricks) {
            const brickBounds = this.getBounds(brick);

            if (ballBounds.right < brickBounds.left || ballBounds.left > brickBounds.right ||
                ballBounds.top > brickBounds.bottom || ballBounds.bottom < brickBounds.top) {
                continue;
            }

            const NO_COLLISION = Infinity;

            const ballFromLeft = ball.velocity.x > 0;
            const ballFromRight = ball.velocity.x < 0;
            const collisionLeft = ballFromLeft ? ballBounds.right - brickBounds.left : NO_COLLISION;
            const collisionRight = ballFromRight ? brickBounds.right - ballBounds.left : NO_COLLISION;
            const collisionHorizontal = Math.min(collisionLeft, collisionRight);// Какая меньше, к той стороне ближе

            const ballFromTop = ball.velocity.y > 0;
            const ballFromBottom = ball.velocity.y < 0;
            const collisionTop = ballFromTop ? ballBounds.bottom - brickBounds.top : NO_COLLISION;
            const collisionBottom = ballFromBottom ? brickBounds.bottom - ballBounds.top : NO_COLLISION;
            const collisionVertical = Math.min(collisionTop, collisionBottom);// Какая меньше, к той стороне ближе

            if (collisionHorizontal < collisionVertical) {// Столкновение произошло по горизонтали
                if (ball.velocity.x > 0) {
                    newBallX = ball.x - collisionHorizontal;
                } else {
                    newBallX = ball.x + collisionHorizontal;
                }
                ball.velocity.x *= -1;
            } else { // Столкновение произошло по вертикали
                if (ball.velocity.y > 0) {
                    newBallY = ball.y - collisionVertical;
                } else {
                    newBallY = ball.y + collisionVertical;
                }
                ball.velocity.y *= -1;
            }

            this.brickGrid.hitBrick(brick);

            return true;
        }

        return false;
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
        return this.getBoundsAt(elem, elem.x, elem.y);
    }

    getBoundsAt(elem, x, y) {
        const anchorX = elem.anchor?.x ?? 0;
        const anchorY = elem.anchor?.y ?? 0;

        const left = x - elem.width * anchorX;
        const top = y - elem.height * anchorY;

        return { left, right: left + elem.width, top, bottom: top + elem.height }
    }

    initTicker(ticker) {
        ticker.add(() => {
            for (const ball of this.balls) {
                const newBallX = ball.x + ball.velocity.x;
                const newBallY = ball.y + ball.velocity.y;

                this.checkWalls(ball, newBallX, newBallY);
                this.checkPlate(ball, newBallX, newBallY);
                if (this.checkBricks(ball, newBallX, newBallY)) {
                    break;
                }

                ball.setPosition(newBallX, newBallY);
            }
            for (const ball of this.ballToRemove) {
                this.removeBall(ball);
            }
            this.ballToRemove.length = 0;
        });
    }
}