import {
    ANGLE_TO_RADIAN,
    LANDER_WIDTH,
    LANDER_HEIGHT,
    gameToCanvasCoordinate,
} from "./consts.js";
import { Point } from "./point.js";

export class Painter {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.base_image = new Image();
        this.base_image.src = "assets/lander_base.png";
        this.crash_image = new Image();
        this.crash_image.src = "assets/lander_crash.png";
    }

    drawPath = (points, color) => {
        this.ctx.beginPath();
        for (let i = 1; i < points.length; i++) {
            const [prevX, prevY] = gameToCanvasCoordinate(
                points[i - 1].x,
                points[i - 1].y,
                canvas
            );
            this.ctx.moveTo(prevX, prevY);
            const [x, y] = gameToCanvasCoordinate(
                points[i].x,
                points[i].y,
                canvas
            );
            this.ctx.lineTo(x, y);
        }
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    };

    drawLanderPath = (points, color) => {
        this.drawPath(
            (points = points.map((p) => new Point(p[0], p[1]))),
            color ? color : "#0000FF"
        );
    };

    drawSurface = (points) => {
        this.drawPath(points, "#FF0000");
    };

    drawLander = (lander) => {
        const [xR, yR] = gameToCanvasCoordinate(
            lander.position.x,
            lander.position.y,
            this.canvas
        );
        this.ctx.save();
        // this.ctx.translate(xR + LANDER_WIDTH / 2, yR + LANDER_HEIGHT);
        this.ctx.translate(xR, yR);
        this.ctx.rotate(-lander.angle * ANGLE_TO_RADIAN);
        if (lander.crashed) {
            this.ctx.drawImage(
                this.crash_image,
                -LANDER_WIDTH / 2,
                -LANDER_HEIGHT,
                LANDER_WIDTH,
                LANDER_HEIGHT
            );
        } else {
            this.ctx.drawImage(
                this.base_image,
                -LANDER_WIDTH / 2,
                -LANDER_HEIGHT,
                LANDER_WIDTH,
                LANDER_HEIGHT
            );
            this.drawFlames(xR, yR, lander.power);
        }
        this.ctx.translate(-xR, -yR);
        this.ctx.restore();
    };

    drawFlames = (xR, yR, power) => {
        if (power > 0) {
            this.ctx.beginPath();
            this.ctx.lineWidth = 3;
            if (power == 1) {
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(0, LANDER_HEIGHT / 2);
            } else if (power == 2) {
                this.ctx.moveTo(-4, 0);
                this.ctx.lineTo(0, LANDER_HEIGHT / 2 + LANDER_HEIGHT / 3);
                this.ctx.moveTo(4, 0);
                this.ctx.lineTo(0, LANDER_HEIGHT / 2 + LANDER_HEIGHT / 3);
            } else if (power == 3) {
                this.ctx.moveTo(-4, 0);
                this.ctx.lineTo(0, LANDER_HEIGHT / 2 + LANDER_HEIGHT / 2);
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(0, LANDER_HEIGHT / 2 + LANDER_HEIGHT / 2);
                this.ctx.moveTo(4, 0);
                this.ctx.lineTo(0, LANDER_HEIGHT / 2 + LANDER_HEIGHT / 2);
            } else if (power == 4) {
                this.ctx.moveTo(-6, 0);
                this.ctx.lineTo(0, LANDER_HEIGHT / 2 + LANDER_HEIGHT);
                this.ctx.moveTo(-3, 0);
                this.ctx.lineTo(0, LANDER_HEIGHT / 2 + LANDER_HEIGHT);
                this.ctx.moveTo(3, 0);
                this.ctx.lineTo(0, LANDER_HEIGHT / 2 + LANDER_HEIGHT);
                this.ctx.moveTo(6, 0);
                this.ctx.lineTo(0, LANDER_HEIGHT / 2 + LANDER_HEIGHT);
            }
            this.ctx.strokeStyle = "#E25822";
            this.ctx.stroke();
            this.ctx.lineWidth = 1;
        }
    };
}
