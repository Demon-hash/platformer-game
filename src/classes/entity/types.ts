import {Coords} from "../../types";
import {SpriteBorders, SpriteCrop} from "../sprite";

export interface EntityInstance {
    coords: Coords;
    borders: SpriteBorders;
    sprite: {
        src: string;
        crop: SpriteCrop;
    },
    misc: {
        speed: number;
        gravity: number;
    }
}
