export const CAMERA_WIDTH = 1024;
export const CAMERA_HEIGHT = 768;

export class Camera {
    private static _instance?: Camera;

    public readonly w = CAMERA_WIDTH;
    public readonly h = CAMERA_HEIGHT;

    private bw: number;
    private bh: number;
    private id: number;

    public x = 0;
    public y = 0;

    constructor() {
        if (Camera._instance) {
            return Camera._instance;
        }

        Camera._instance = this;

        this.bw = this.x + Math.floor(this.w / 2);
        this.bh = this.y + Math.floor(this.h / 2);
    }

    update(x: number, y: number, ww: number, wh: number): void {
        this.x = Math.min(Math.max(0, x - Math.floor(this.w / 2)), ww - this.w);
        this.y = Math.min(Math.max(0, y - Math.floor(this.h / 2)), wh - this.h);
        this.bw = Math.min(this.x + Math.floor(this.w / 2), ww - this.w);
        this.bh = Math.min(this.y + Math.floor(this.h / 2), wh - this.h);
    }

    attachTo(id: number) {
        this.id = id;
    }

    getAttachedId(): number | undefined {
        return this.id;
    }

    hasFocusAt(x: number, y: number, w: number, h: number): boolean {
        return this.x <= w && x <= this.bw && this.y <= h && y <= this.bh;
    }
}
