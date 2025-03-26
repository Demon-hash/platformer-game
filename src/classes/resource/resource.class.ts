import type { TileData } from '@tile/types';
import type { SpriteCrop } from '@sprite/types';
import { TILE_SIZE } from '@tile/tile.class';
import { crop } from '@sprite/crop';
import { Sprite } from '@sprite/sprite.class';
import { TileEnum } from '@resources/tile.enum';

import sprites from '@sprites/sheet.png';
import water from '@sprites/water.png';

export class Resource {
    static _instance: null | Resource;

    private readonly _tiles: TileData[] = [
        this._tile(TileEnum.SKY, false, false, 'sky', crop(0, 0, TILE_SIZE, TILE_SIZE)),
        this._tile(TileEnum.COVER, true, false, 'cover', crop(TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)),
        this._tile(TileEnum.DIRT, true, false, 'dirt', crop(TILE_SIZE * 2, 0, TILE_SIZE, TILE_SIZE)),
        this._tile(TileEnum.STONE, true, false, 'stone', crop(TILE_SIZE * 3, 0, TILE_SIZE, TILE_SIZE)),
        this._tile(TileEnum.MAHOGANY_LOG, false, true, 'mahogany', crop(0, TILE_SIZE, TILE_SIZE, TILE_SIZE)),
        this._tile(
            TileEnum.MAHOGANY_LEAVES,
            false,
            true,
            'mahogany_leaves',
            crop(TILE_SIZE, TILE_SIZE, TILE_SIZE, TILE_SIZE)
        ),
        this._tile(TileEnum.SAND, true, false, 'sand', crop(TILE_SIZE * 2, TILE_SIZE, TILE_SIZE, TILE_SIZE)),
        this._tile(TileEnum.SANDSTONE, true, false, 'sandstone', crop(TILE_SIZE * 3, TILE_SIZE, TILE_SIZE, TILE_SIZE)),
        this._tile(TileEnum.PALM_LOG, false, true, 'palm', crop(0, TILE_SIZE * 2, TILE_SIZE, TILE_SIZE)),
        this._tile(
            TileEnum.PALM_LEAVES,
            false,
            true,
            'palm_leaves',
            crop(TILE_SIZE, TILE_SIZE * 2, TILE_SIZE, TILE_SIZE)
        ),
        this._tile(TileEnum.UNKNOWN, false, false, 'unknown', crop(TILE_SIZE * 2, TILE_SIZE * 2, TILE_SIZE, TILE_SIZE)),
        this._tile(TileEnum.WATER, false, false, 'water', crop(TILE_SIZE, 0, TILE_SIZE, TILE_SIZE), water),
    ];

    constructor() {
        if (Resource._instance) {
            return Resource._instance;
        }

        Resource._instance = this;
    }

    get tiles() {
        return this._tiles;
    }

    private _tile(
        id: TileEnum,
        solid: boolean,
        vegetation: boolean,
        name: string,
        crop: SpriteCrop,
        image = sprites
    ): TileData {
        return {
            id,
            solid,
            name,
            vegetation,
            sprite: new Sprite({
                x: 0,
                y: 0,
                src: image,
                crop,
            }),
        };
    }
}
