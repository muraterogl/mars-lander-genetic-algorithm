export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add = (x, y) => {
        this.x += x;
        this.y += y;
    };
    print = (title) => {
        console.log(`${title ? title + "   " : ""}x: ${this.x}, y: ${this.y}`);
    };
}
