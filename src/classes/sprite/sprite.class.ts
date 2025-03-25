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

    getColorStr(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, pct: number) {
        const rn = Math.round((1 - pct) * r1 + pct * r2),
            gn = Math.round((1 - pct) * g1 + pct * g2),
            bn = Math.round((1 - pct) * b1 + pct * b2);
        return 'rgb(' + rn + ',' + gn + ',' + bn + ')';
    }

    draw(ctx: CanvasRenderingContext2D, frame = 1, x?: number, y?: number, w?: number, h?: number, opacity?: number) {
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (!this.image || !this.cropBox) return;

        ctx.globalAlpha = opacity ?? 1;
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
