import {crop, Sprite, SpriteCrop} from "../sprite";
import {TILE_SIZE, TileData} from "../tile";

import sprites from "../../assets/sprites/sheet.png";
import water from "../../assets/sprites/water.png";

export class Resource {
    private toTileData(solid: boolean, name: string, crop: SpriteCrop, image = sprites) {
        return {
            id: 0,
            solid,
            name,
            sprite: new Sprite({
                x: 0,
                y: 0,
                src: image,
                crop
            })
        }
    }

    tiles(): TileData[] {
        return [
            this.toTileData(false, 'TILE.SKY', crop(0, 0, TILE_SIZE, TILE_SIZE)),
            this.toTileData(true, 'TILE.GRASS', crop(TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)),
            this.toTileData(true, 'TILE.DIRT', crop(TILE_SIZE * 2, 0, TILE_SIZE, TILE_SIZE)),
            this.toTileData(true, 'TILE.STONE', crop(TILE_SIZE * 3, 0, TILE_SIZE, TILE_SIZE)),
            this.toTileData(true, 'TILE.MAHOGANY', crop(0, TILE_SIZE, TILE_SIZE, TILE_SIZE)),
            this.toTileData(true, 'TILE.MAHOGANY_LEAVES', crop(TILE_SIZE, TILE_SIZE, TILE_SIZE, TILE_SIZE)),
            this.toTileData(true, 'TILE.SAND', crop(TILE_SIZE * 2, TILE_SIZE, TILE_SIZE, TILE_SIZE)),
            this.toTileData(true, 'TILE.SANDSTONE', crop(TILE_SIZE * 3, TILE_SIZE, TILE_SIZE, TILE_SIZE)),
            this.toTileData(true, 'TILE.PALM', crop(0, TILE_SIZE * 2, TILE_SIZE, TILE_SIZE)),
            this.toTileData(true, 'TILE.PALM_LEAVES', crop(0, TILE_SIZE * 2, TILE_SIZE, TILE_SIZE)),
            this.toTileData(false, 'TILE.UNKNOWN', crop(TILE_SIZE, TILE_SIZE * 2, TILE_SIZE, TILE_SIZE)),
            this.toTileData(false, 'TILE.WATER', crop(TILE_SIZE, 0, TILE_SIZE, TILE_SIZE), water),
        ];
    }
}
