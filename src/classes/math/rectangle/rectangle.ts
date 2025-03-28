export class Rectangle {
    public top: number;
    public right: number;
    public down: number;
    public left: number;

    constructor(x: number, y: number, w: number, h: number, projection = 1) {
        this.top = Math.max(0, Math.floor(y / projection));
        this.left = Math.max(0, Math.floor(x / projection));
        this.down = Math.max(0, Math.floor((y + h) / projection));
        this.right = Math.max(0, Math.floor((x + w) / projection));
    }

    collision(rectangle: Rectangle) {
        return (
            this.left >= rectangle.left &&
            this.right <= rectangle.right &&
            this.top >= rectangle.top &&
            this.down <= rectangle.down
        );
    }

    pointInRectangle(x: number, y: number) {
        return x >= this.left && x < this.right && y >= this.top && y < this.down;
    }
}
