export const CAMERA_WIDTH = 1024;
export const CAMERA_HEIGHT = 768;

export class Camera {
    private static _instance?: Camera;

    private _bw: number;
    private _bh: number;
    private _id: number;

    readonly w = CAMERA_WIDTH;
    readonly h = CAMERA_HEIGHT;

    readonly coords = new Uint32Array(new SharedArrayBuffer(8));

    x = 0;
    y = 0;

    constructor() {
        if (Camera._instance) {
            return Camera._instance;
        }

        Camera._instance = this;

        this._bw = this.x + Math.floor(this.w / 2);
        this._bh = this.y + Math.floor(this.h / 2);

        this.coords.set([this.x, this.y]);
    }

    update(x: number, y: number, ww: number, wh: number): void {
        this.x = Math.min(Math.max(0, x - Math.floor(this.w / 2)), ww - this.w);
        this.y = Math.min(Math.max(0, y - Math.floor(this.h / 2)), wh - this.h);
        this._bw = Math.min(this.x + Math.floor(this.w / 2), ww - this.w);
        this._bh = Math.min(this.y + Math.floor(this.h / 2), wh - this.h);

        this.coords.set([this.x, this.y]);
    }

    attachTo(id: number) {
        this._id = id;
    }

    getAttachedId(): number | undefined {
        return this._id;
    }

    hasFocusAt(x: number, y: number, w: number, h: number): boolean {
        return this.x <= w && x <= this._bw && this.y <= h && y <= this._bh;
    }
}
