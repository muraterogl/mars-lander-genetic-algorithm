import { Point } from "./point.js";

export class Surface {
    constructor(points) {
        this.points = points.map((p) => new Point(p[0], p[1]));
        for (let i = 1; i < this.points.length; i++) {
            const x = this.points[i - 1].x;
            const y = this.points[i - 1].y;
            const X = this.points[i].x;
            const Y = this.points[i].y;
            if (y == Y) {
                this.landingSurface = [x, X];
            }
        }
    }

    isLanded = (lander, debug) => {
        const xT = lander.position.x;
        const yT = lander.position.y;
        const xvT = lander.velocity.x;
        const yvT = lander.velocity.y;
        const aT = lander.angle;
        for (let i = 1; i < this.points.length; i++) {
            const x = this.points[i - 1].x;
            const y = this.points[i - 1].y;
            const X = this.points[i].x;
            const Y = this.points[i].y;
            if (x <= xT && xT <= X) {
                const slope = (Y - y) / (X - x);
                const constant = y - slope * x; // y=mx+c => c=y-mx
                if (
                    aT == 0 &&
                    Math.abs(yvT) < 39 &&
                    Math.abs(xvT) < 19 &&
                    y == Y &&
                    yT <= y
                ) {
                    //Landed
                    lander.landed = true;
                    lander.stopLander();
                } else if (yT <= slope * xT + constant) {
                    //Crashed
                    if (debug) {
                        console.log("hello world");
                    }
                    lander.crashed = true;
                    lander.stopLander();
                }
            }
        }
    };
}
