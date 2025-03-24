import type { SpriteCrop } from '@sprite/types';

export const crop = (x: number, y: number, width: number, height: number): SpriteCrop => {
    return {
        offset: {
            x,
            y,
        },
        size: {
            width,
            height,
        },
    };
};
