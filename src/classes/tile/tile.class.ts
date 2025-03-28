import type { TileData } from './types';
import { Resource } from '../resource';
import { type Liquid, LIQUID_MAX_MASS } from '../liquid';
import { TileEnum } from '@resources/tile.enum';

export const TILE_SIZE = 16;

export class Tile {
    private static _instance?: Tile;

    private readonly _resource = new Resource();
    private readonly _tiles = this._resource.tiles;

    constructor() {
        if (Tile._instance) {
            return Tile._instance;
        }

        Tile._instance = this;
    }

    data() {
        return this._tiles;
    }

    get(id: number, key: keyof TileData) {
        return this._tiles?.[id]?.[key];
    }

    draw(
        tileId: number,
        backgroundTileId: number,
        upperTileId: number,
        ctx: CanvasRenderingContext2D,
        id: number,
        liquid: Liquid,
        opacity: number
    ) {
        const rawTileId = backgroundTileId || tileId;
        const args = {
            opacity,
            isBackground: Boolean(!tileId && backgroundTileId),
            isWater: tileId === TileEnum.WATER,
        };

        switch (tileId) {
            case TileEnum.WATER:
                const frame = Math.floor(Math.min(LIQUID_MAX_MASS / liquid.masses[id], LIQUID_MAX_MASS));
                this._tiles[TileEnum.SKY].sprite.draw(ctx, 1);
                this._tiles[tileId].sprite.draw(ctx, frame + 1, {
                    ...args,
                    heightOffset: upperTileId === TileEnum.SKY ? 16 : 0,
                });
                break;
            case TileEnum.SKY:
                this._tiles[rawTileId].sprite.draw(ctx, 1, args);
                break;
            default:
                this._tiles[tileId].sprite.draw(ctx, 1, args);
                break;
        }
    }
}
