import { Point } from "./point.js";

export class Vector extends Point {
    constructor(x, y) {
        super(x, y);
    }
    add = (v) => {
        return new Vector(this.x + v.x, this.y + v.y);
    };
    scale = (c) => {
        return new Vector(this.x * c, this.y * c);
    };
}
