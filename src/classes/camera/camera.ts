import {CameraHasFocus, CameraUpdate, CameraViewBorders} from "./types";
import {TILE_SIZE} from "../tile";

export const CAMERA_WIDTH = 1024; // 1024
export const CAMERA_HEIGHT = 768; // 768

export class Camera {
    public readonly w = CAMERA_WIDTH;
    public readonly h = CAMERA_HEIGHT;

    private bw: number;
    private bh: number;

    public x = 0;
    public y = 0;

    public id = 0;

    constructor() {
        this.bw = this.x + Math.floor(this.w / 2);
        this.bh = this.y + Math.floor(this.h / 2);
    }

    update({x, y, ww, wh}: CameraUpdate) {
        this.x = Math.min(Math.max(0, x - Math.floor(this.w / 2)), ww - this.w);
        this.y = Math.min(Math.max(0, y - Math.floor(this.h / 2)), wh - this.h);
        this.bw = Math.min(this.x + Math.floor(this.w / 2), ww - this.w);
        this.bh = Math.min(this.y + Math.floor(this.h / 2), wh - this.h);
    }

    hasFocusAt({x, y, w, h}: CameraHasFocus): boolean {
        return (this.x <= w && x <= this.bw && this.y <= h && y <= this.bh)
    }
}
