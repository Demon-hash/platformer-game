import type { TileData } from '@tile/types';
import type { SpriteCrop } from '@sprite/types';
import { TILE_SIZE } from '@tile/tile.class';
import { crop } from '@sprite/crop';
import { Sprite } from '@sprite/sprite.class';
import { TileEnum } from '@resources/tile.enum';

import sheet from '@sprites/sheet.png';
import water from '@sprites/water.png';

const ts = 16;

export class Resource {
    static _instance: null | Resource;

    private readonly _tiles: TileData[] = [
        this._tile(TileEnum.SKY, false, false, 'sky', crop(0, 0, ts, ts)),

        this._tile(TileEnum.COVER, true, false, 'cover', crop(ts, 0, ts, ts)),
        this._tile(TileEnum.DIRT, true, false, 'dirt', crop(ts, ts, ts, ts)),
        this._tile(TileEnum.STONE, true, false, 'stone', crop(ts * 3, ts * 3, ts, ts)),

        this._tile(TileEnum.MAHOGANY_LOG, false, true, 'mahogany', crop(ts * 4, ts * 2, ts, ts)),
        this._tile(TileEnum.MAHOGANY_LEAVES, false, true, 'mahogany_leaves', crop(ts * 5, ts * 2, ts, ts)),

        this._tile(TileEnum.SAND_COVER, true, false, 'sand', crop(ts * 3, 0, ts, ts)),
        this._tile(TileEnum.SAND, true, false, 'sand', crop(ts * 3, ts, ts, ts)),
        this._tile(TileEnum.SANDSTONE, true, false, 'sandstone', crop(ts * 3, ts * 2, ts, ts)),

        this._tile(TileEnum.PALM_LOG, false, true, 'palm', crop(ts * 4, ts * 3, ts, ts)),
        this._tile(TileEnum.PALM_LEAVES, false, true, 'palm_leaves', crop(ts * 5, ts * 3, ts, ts)),

        this._tile(TileEnum.UNKNOWN, false, false, 'unknown', crop(0, 0, ts, ts)),
        this._tile(TileEnum.WATER, false, false, 'water', crop(ts, 0, ts, ts), water),
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
        image = sheet
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
