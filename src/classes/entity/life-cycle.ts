import {Camera} from "../camera";

export interface LifeCycle {
    update(): void;
    collision(): Promise<void>;
    draw(ctx: CanvasRenderingContext2D, camera: Camera): void;
}
