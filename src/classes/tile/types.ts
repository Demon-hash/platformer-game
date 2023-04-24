import {Sprite} from "../sprite";

export interface TileData {
    id: number;
    name: string;
    sprite: Sprite;
    solid: boolean;
}
