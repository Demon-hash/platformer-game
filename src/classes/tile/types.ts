import type { Sprite } from '../sprite';

export type TileData = {
    id: number;
    name: string;
    sprite: Sprite;
    solid: boolean;
    vegetation: boolean;
};
