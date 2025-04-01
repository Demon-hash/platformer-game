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
        this._tile(TileEnum.STONE, true, false, 'stone', crop(ts * 2, ts * 2, ts, ts)),

        this._tile(TileEnum.MAHOGANY_LOG, false, true, 'mahogany', crop(ts * 4, ts * 2, ts, ts)),
        this._tile(TileEnum.MAHOGANY_LEAVES, false, true, 'mahogany_leaves', crop(ts * 5, ts * 2, ts, ts)),

        this._tile(TileEnum.SAND_COVER, true, false, 'sand', crop(ts * 3, 0, ts, ts)),
        this._tile(TileEnum.SAND, true, false, 'sand', crop(ts * 3, ts, ts, ts)),
        this._tile(TileEnum.SANDSTONE, true, false, 'sandstone', crop(ts * 3, ts * 2, ts, ts)),

        this._tile(TileEnum.PALM_LOG, false, true, 'palm', crop(ts * 4, ts * 3, ts, ts)),
        this._tile(TileEnum.PALM_LEAVES, false, true, 'palm_leaves', crop(ts * 5, ts * 3, ts, ts)),

        this._tile(TileEnum.UNKNOWN, false, false, 'unknown', crop(0, 0, ts, ts)),
        this._tile(TileEnum.WATER, false, false, 'water', crop(ts, 0, ts, ts), water),

        this._tile(TileEnum.LEMON_LEAVES, false, true, 'lemon_leaves', crop(ts * 4, 0, ts, ts)),
        this._tile(TileEnum.LIME_LEAVES, false, true, 'lime_leaves', crop(ts * 5, 0, ts, ts)),
        this._tile(TileEnum.ORANGE_LEAVES, false, true, 'orange_leaves', crop(ts * 4, ts, ts, ts)),
        this._tile(TileEnum.GRAPEFRUIT_LEAVES, false, true, 'grapefruit_leaves', crop(ts * 5, ts, ts, ts)),

        this._tile(TileEnum.MUD_COVER, true, false, 'mud_cover', crop(ts * 2, 0, ts, ts)),
        this._tile(TileEnum.COCONUT, false, false, 'coconut', crop(ts * 4, ts * 5, ts, ts)),
        this._tile(TileEnum.BAMBOO_TOP, false, false, 'coconut', crop(ts * 4, ts * 4, ts, ts)),
        this._tile(TileEnum.BAMBOO, false, false, 'coconut', crop(ts * 5, ts * 4, ts, ts)),

        this._tile(TileEnum.MUD, true, false, 'mud', crop(ts * 2, ts, ts, ts)),
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
