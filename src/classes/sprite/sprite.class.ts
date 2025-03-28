import type { SpriteCrop, SpriteInstance } from '@sprite/types';

type DrawArgs = {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    opacity?: number;
    heightOffset?: number;
    isBackground?: boolean;
    isWater?: boolean;
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

        if (args?.isWater) {
            const acceptableValues = (val: number, values: number[]) =>
                values.reduce((prev, cur) => (val >= cur ? cur : prev), values[0]);

            const natural = acceptableValues(
                Math.abs(100 - Math.min(1, args?.opacity ?? 1) * 100) / 10,
                [0, 1, 2, 3, 4, 8, 6, 7, 8, 9]
            );

            ctx.drawImage(
                this.image,
                natural === 0 ? this.cropBox.offset.x * frame : 0,
                this.cropBox.offset.y + natural * 16 + (args?.heightOffset ?? 0),
                this.cropBox.size.width,
                this.cropBox.size.height,
                args?.x ?? this.x,
                args?.y ?? this.y,
                args?.w ?? this.cropBox.size.width,
                args?.h ?? this.cropBox.size.height
            );
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
            ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
