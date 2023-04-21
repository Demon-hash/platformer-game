import {Tile, TILE_SIZE} from "../tile";
import {Camera} from "../camera";

export const WORLD_WIDTH = 1024;
export const WORLD_HEIGHT = 512;

export class World {
    private readonly _width: number;
    private readonly _height: number;
    private readonly tiles: Uint16Array;

    public readonly tile: Tile;
    public readonly width: number;
    public readonly height: number;

    constructor() {
        this.tile = new Tile();

        this.width = WORLD_WIDTH * TILE_SIZE;
        this.height = WORLD_HEIGHT * TILE_SIZE;

        this._width = Math.floor(this.width / TILE_SIZE);
        this._height = Math.floor(this.height / TILE_SIZE);

        this.tiles = new Uint16Array((this.width * this.height) / TILE_SIZE);

        let level = (40 + Math.round(Math.random() * 10));

        for (let i = 0; i < 64; i++) {
            this.tiles[(WORLD_WIDTH * (level + Math.floor(Math.random() * 2)) + i)] = 1;
        }
    }

    setTileId(x: number, y: number, id: number) {
        this.tiles[Math.floor((Math.floor(y / TILE_SIZE) * this._width) + Math.floor(x / TILE_SIZE))] = id;
    }

    getTitleId(x: number, y: number): number {
        return this.tiles[Math.floor((y * this._width) + x)];
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        const viewXBegin = Math.max(0, Math.floor((camera.x - TILE_SIZE) / TILE_SIZE));
        const viewYBegin = Math.max(0, Math.floor((camera.y - TILE_SIZE) / TILE_SIZE));
        const viewXEnd = Math.min(Math.floor((camera.x + camera.w + TILE_SIZE) / TILE_SIZE), this.width - 1);
        const viewYEnd = Math.min(Math.floor((camera.y + camera.h + TILE_SIZE) / TILE_SIZE), this.height - 1);

        for (let x, y = viewYBegin; y < viewYEnd; y++) {
            for (x = viewXBegin; x < viewXEnd; x++) {
                ctx.save();
                ctx.translate(Math.floor((x * TILE_SIZE) - camera.x), Math.floor((y * TILE_SIZE) - camera.y));
                this.tile.draw(this.getTitleId(x, y), ctx);
                ctx.restore();
            }
        }
    }
}
