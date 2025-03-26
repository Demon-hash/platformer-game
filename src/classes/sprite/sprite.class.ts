import type { SpriteCrop, SpriteInstance } from '@sprite/types';

type DrawArgs = {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    opacity?: number;
    isBackground?: boolean;
};

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

    draw(ctx: CanvasRenderingContext2D, frame = 1, args?: DrawArgs) {
        if (!this.image || !this.cropBox) {
            return;
        }

        ctx.globalAlpha = args?.opacity ?? 1;

        ctx.drawImage(
            this.image,
            this.cropBox.offset.x * frame,
            this.cropBox.offset.y,
            this.cropBox.size.width,
            this.cropBox.size.height,
            args?.x ?? this.x,
            args?.y ?? this.y,
            args?.w ?? this.cropBox.size.width,
            args?.h ?? this.cropBox.size.height
        );

        if (args?.isBackground) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
