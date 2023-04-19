import {Coords} from "../../types";

export interface SpriteInstance {
    src: string;
    x: number;
    y: number;
    crop?: SpriteCrop;
    w?: number;
    h?: number;
}

export interface SpriteCrop {
    offset: Coords;
    size: SpriteBorders;
}

export interface SpriteBorders {
    width: number;
    height: number;
}
