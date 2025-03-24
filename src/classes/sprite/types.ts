import type { Coords } from '@global-types';

export type SpriteInstance = {
    src: string;
    x: number;
    y: number;
    crop?: SpriteCrop;
    w?: number;
    h?: number;
};

export type SpriteCrop = {
    offset: Coords;
    size: SpriteBorders;
};

export type SpriteBorders = {
    width: number;
    height: number;
};
