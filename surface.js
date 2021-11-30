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

    isCrashed = (lander, debug) => {
        const xT = lander.position.x;
        const yT = lander.position.y;
        for (let i = 1; i < this.points.length; i++) {
            const x = this.points[i - 1].x;
            const y = this.points[i - 1].y;
            const X = this.points[i].x;
            const Y = this.points[i].y;
            if (x <= xT && xT <= X) {
                const slope = (Y - y) / (X - x);
                const constant = y - slope * x; // y=mx+c => c=y-mx
                if (yT <= slope * xT + constant) {
                    if (debug) {
                        console.log("hello world");
                    }
                    return true;
                }
            }
        }
        return false;
    };

    isLanded = (lander) => {
        const xT = lander.position.x;
        const yT = lander.position.y;
        const xvT = lander.velocity.x;
        const yvT = lander.velocity.y;
        const aT = lander.angle;
        if (aT == 0 && Math.abs(yvT) < 39 && Math.abs(xvT) < 19) {
            for (let i = 1; i < this.points.length; i++) {
                const x = this.points[i - 1].x;
                const y = this.points[i - 1].y;
                const X = this.points[i].x;
                const Y = this.points[i].y;
                if (x <= xT && xT <= X && y == Y && yT <= y) {
                    return true;
                }
            }
        }
        return false;
    };
}
