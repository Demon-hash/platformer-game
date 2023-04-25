import {Resource} from "../resource";
import {TileData} from "./types";
import {Liquid} from "../liquid";

export const TILE_SIZE = 16;

export class Tile {
    private readonly resources: TileData[] = [];

    private resource: Resource;

    constructor() {
        this.resource = new Resource();
        this.resources = this.resource.tiles();
    }

    get(id: number, key: keyof TileData) {
        return this.resources[id][key];
    }

    draw(titleId: number, ctx: CanvasRenderingContext2D, id: number, liquid: Liquid) {
        switch (titleId) {
            case 11:
                const frame = Math.floor(Math.min(8 / liquid.masses[id], 8));
                this.resources[titleId].sprite.draw(ctx, frame + 1);
                break;
            default:
                this.resources[titleId].sprite.draw(ctx);
                break;
        }
    }
}
