export interface Scene {
    draw(ctx: CanvasRenderingContext2D, delta: DOMHighResTimeStamp): void;
}
