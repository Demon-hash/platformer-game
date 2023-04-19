import {Resource} from "../resource";
import {TileData} from "./types";

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

    draw(id: number, ctx: CanvasRenderingContext2D) {
        this.resources[id].sprite.draw(ctx);
    }
}
