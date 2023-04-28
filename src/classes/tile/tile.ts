import { Resource } from '../resource';
import { Liquid, LIQUID_MAX_MASS } from '../liquid';
import { TileData } from './types';

export const TILE_SIZE = 16;

export class Tile {
    private readonly resources: TileData[] = [];

    private resource: Resource;

    constructor() {
        this.resource = new Resource();
        this.resources = this.resource.tiles();
    }

    data() {
        return this.resources;
    }

    get(id: number, key: keyof TileData) {
        return this.resources[id][key];
    }

    draw(titleId: number, ctx: CanvasRenderingContext2D, id: number, liquid: Liquid) {
        switch (titleId) {
            case 11:
                const frame = Math.floor(Math.min(LIQUID_MAX_MASS / liquid.masses[id], LIQUID_MAX_MASS));
                this.resources[titleId].sprite.draw(ctx, frame + 1);
                break;
            default:
                this.resources[titleId].sprite.draw(ctx);
                break;
        }
    }
}
