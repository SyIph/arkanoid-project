import { Container, Graphics } from "pixi.js";
import { Ball}  from "../levelObjects/ball";
import Input from "../core/input.js";
import { GameState } from "../level/gameState.js";

export class BallPhysics extends Container {
    constructor(width, height, plate, brickGrid, gameInfo) {
        super();
        this.gameInfo = gameInfo;
        this.plate = plate;
        this.brickGrid = brickGrid;
        this.balls = [];
        this.bricks = [];
        this.ballToRemove = [];
        const bounds = new Graphics().rect(0, 0, width, height).fill({ color: "#ffffff", alpha: 0 });
        this.addChild(bounds);
    }

    checkWalls(ball, nextPosition) {
        const innerWidth = this.width;
        const innerHeight = this.height;

        const halfWidth = ball.width / 2;
        const halfHeight = ball.height / 2;

        const ballBounds = this.getBoundsAt(ball, nextPosition.x, nextPosition.y);

        if (ballBounds.left <= 0 && ball.velocity.x < 0) {
            nextPosition.x = halfWidth;
            ball.velocity.x *= -1;
        }

        if (ballBounds.right >= innerWidth && ball.velocity.x > 0) {
            nextPosition.x = innerWidth - halfWidth;
            ball.velocity.x *= -1;
        }

        if (ballBounds.top <= 0 && ball.velocity.y < 0) {
            nextPosition.y = halfHeight;
            ball.velocity.y *= -1;
        }

        if (ballBounds.bottom >= innerHeight && ball.velocity.y > 0) {
            this.ballToRemove.push(ball);
        }
    }

    checkPlate(ball, nextPosition) {
        const plateBounds = this.getBounds(this.plate);

        if (ball.velocity.y <= 0) {
            return;
        }

        const ballBounds = this.getBoundsAt(ball, nextPosition.x, nextPosition.y);

        if (ballBounds.bottom < plateBounds.top) {
            return;
        }

        if (ballBounds.right < plateBounds.left || ballBounds.left > plateBounds.right) {
            return;
        }

        nextPosition.y = plateBounds.top - ball.height / 2;

        ball.velocity.y = -Math.abs(ball.velocity.y);

        if (nextPosition.x < this.plate.x) {
            ball.velocity.x = -Math.abs(ball.velocity.x);
        } else {
            ball.velocity.x = Math.abs(ball.velocity.x);
        }
    }

    checkBricks(ball, nextPosition) {
        const ballBounds = this.getBoundsAt(ball, nextPosition.x, nextPosition.y);

        const bricks = this.brickGrid.getBricksNear(ballBounds);

        for (const brick of bricks) {
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
                    nextPosition.x -= collisionHorizontal;
                } else {
                    nextPosition.x += collisionHorizontal;
                }
                ball.velocity.x *= -1;
            } else { // Столкновение произошло по вертикали
                if (ball.velocity.y > 0) {
                    nextPosition.y -= collisionVertical;
                } else {
                    nextPosition.y += collisionVertical;
                }
                ball.velocity.y *= -1;
            }

            this.brickGrid.hitBrick(brick);

            return;
        }
    }

    removeAllBalls() {
        for (const ball of this.balls) {
            this.removeBall(ball);
        }
        this.balls.length = 0;
    }

    removeBall(ball) {
        const index = this.balls.indexOf(ball);
        if (index !== -1) {
            this.balls.splice(index, 1);
        }
        this.removeChild(ball);
        ball.destroy();
        if (this.balls.length == 0) {
            this.plate.playBreak();
        }
    }

    createBall(ballStart, sticked = false) {
        const ball = new Ball(Math.round(ballStart.x) + 5, Math.round(ballStart.y) - 2);
        if (sticked) {
            ball.stickToPlate(this.plate);
        }
        this.addChild(ball);
        this.balls.push(ball);
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

    tick(deltaTime) {
        if (Input.left) {
            this.plate.move(-1, deltaTime);
        }
        if (Input.right) {
            this.plate.move(1, deltaTime);
        }

        for (const ball of this.balls) {
            if (ball.sticked) {
                ball.x = this.plate.x + ball.offsetX;
                ball.y = this.plate.y + ball.offsetY;
                continue;
            }

            const nextPosition = {
                x: ball.x + ball.velocity.x * deltaTime,
                y: ball.y + ball.velocity.y * deltaTime
            };

            this.checkWalls(ball, nextPosition);
            this.checkPlate(ball, nextPosition);
            this.checkBricks(ball, nextPosition);

            ball.setPosition(nextPosition.x, nextPosition.y);
        }
        for (const ball of this.ballToRemove) {
            this.removeBall(ball);
        }
        this.ballToRemove.length = 0;
    }

}