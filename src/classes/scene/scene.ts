export interface Scene {
    update(): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
