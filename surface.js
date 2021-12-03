import { FPS } from "./consts.js";
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

    ccw = (a, b, c) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);

    //Return true if line segments AB and CD intersect
    intersect = (a, b, c, d) =>
        this.ccw(a, c, d) != this.ccw(b, c, d) &&
        this.ccw(a, b, c) != this.ccw(a, b, d);

    isLanded = (lander, debug) => {
        const xT = lander.position.x;
        const yT = lander.position.y;
        const xvT = lander.velocity.x;
        const yvT = lander.velocity.y;
        const aT = lander.angle;
        const apT = lander.prevAngle;

        if (lander.prevPosition == null) lander.prevPosition = lander.position;
        for (let i = 1; i < this.points.length; i++) {
            const x = this.points[i - 1].x;
            const y = this.points[i - 1].y;
            const X = this.points[i].x;
            const Y = this.points[i].y;
            const slope = (Y - y) / (X - x);
            const c = Y - slope * X; //y=mx+c => c=y-mx
            const yAtxT = slope * xT + c;
            const yAtxPT = slope * lander.prevPosition.x + c;
            //if (x <= xT && xT <= X) {
            if (
                this.intersect(
                    lander.prevPosition,
                    lander.position,
                    this.points[i - 1],
                    this.points[i]
                )
            ) {
                if (
                    (aT == 0 &&
                        apT == 0 &&
                        //lander.power == 0 &&
                        Math.abs(yvT) < 39.5 &&
                        Math.abs(xvT) < 19.5 &&
                        y == Y) ||
                    debug
                ) {
                    //Landed
                    lander.landed = true;
                    lander.stopLander();
                } else {
                    //Crashed
                    if (debug) {
                        console.log("hello world");
                    }
                    lander.crashed = true;
                    lander.stopLander();
                }
            }
            //}
        }
    };
}
