import {crop, Sprite} from "../sprite";
import {TILE_SIZE, TileData} from "../tile";
import {Languages} from "./types";

import en from '../../assets/i18n/en.json';
import ru from '../../assets/i18n/ru.json';

import sprites from "../../assets/sprites/sheet.png";

export class Resource {
    languages(): Record<Languages, object> {
        return {
            en, ru
        }
    }

    tiles(): TileData[] {
        const crops = [
            crop(0, 0, TILE_SIZE, TILE_SIZE),
            crop(TILE_SIZE, 0, TILE_SIZE, TILE_SIZE),
            crop(TILE_SIZE * 2, 0, TILE_SIZE, TILE_SIZE),
            crop(TILE_SIZE * 3, 0, TILE_SIZE, TILE_SIZE),
        ];

        return crops.map((crop, index) => ({
            solid: index > 0,
            name: 'TITLE',
            sprite: new Sprite({
                x: 0,
                y: 0,
                src: sprites,
                crop,
            })
        }));
    }
}
