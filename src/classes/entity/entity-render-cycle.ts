import {Camera} from "../camera";

export interface EntityRenderCycle {
    update(): void;
    draw(ctx: CanvasRenderingContext2D, camera: Camera): void;
}
