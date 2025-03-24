import type { SpriteCrop, SpriteInstance } from '@sprite/types';

export class Sprite {
    private readonly image: HTMLImageElement;
    private readonly x: number;
    private readonly y: number;

    private width: number;
    private height: number;
    private cropBox: SpriteCrop;

    constructor({ src, x, y, crop }: SpriteInstance) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = src;

        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;

            this.cropBox = {
                offset: {
                    x: crop?.offset?.x ?? 0,
                    y: crop?.offset?.y ?? 0,
                },
                size: {
                    width: crop?.size?.width ?? this.width,
                    height: crop?.size?.height ?? this.height,
                },
            };
        };
    }

    draw(ctx: CanvasRenderingContext2D, frame = 1, x?: number, y?: number, w?: number, h?: number) {
        if (!this.image || !this.cropBox) return;

        ctx.drawImage(
            this.image,
            this.cropBox.offset.x * frame,
            this.cropBox.offset.y,
            this.cropBox.size.width,
            this.cropBox.size.height,
            x ?? this.x,
            y ?? this.y,
            w ?? this.cropBox.size.width,
            h ?? this.cropBox.size.height
        );
    }
}
