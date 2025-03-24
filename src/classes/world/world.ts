import type { Camera } from '@camera/camera';
import { Chunk } from '@chunk/chunk';
import { Tile, TILE_SIZE } from '@tile/tile';
import { Liquid, LIQUID_MAX_MASS } from '@liquid/liquid';

export const WORLD_WIDTH = 2048;
export const WORLD_HEIGHT = 2048;

export class World {
    private readonly _chunk: Chunk;

    readonly tile: Tile;
    readonly liquid: Liquid;
    readonly width: number;
    readonly height: number;
    readonly widthInBlocks: number;
    readonly heightInBlocks: number;

    private _tiles: Uint8Array;

    constructor() {
        this.tile = new Tile();

        this.width = WORLD_WIDTH * TILE_SIZE;
        this.height = WORLD_HEIGHT * TILE_SIZE;

        this.widthInBlocks = Math.floor(this.width / TILE_SIZE);
        this.heightInBlocks = Math.floor(this.height / TILE_SIZE);

        this._tiles = new Uint8Array(new SharedArrayBuffer(this.widthInBlocks * this.heightInBlocks));
        this._chunk = new Chunk(this);

        this.liquid = new Liquid(this);
    }

    getId(x: number, y: number) {
        return Math.floor(y * this.widthInBlocks + x);
    }

    setTileId(x: number, y: number, id: number, projection = TILE_SIZE) {
        this._tiles[Math.floor(Math.floor(y / projection) * this.widthInBlocks + Math.floor(x / projection))] = id;
    }

    getTileId(x: number, y: number): number {
        return this._tiles[this.getId(x, y)];
    }

    addLiquid(x: number, y: number, mass = LIQUID_MAX_MASS, projection = TILE_SIZE) {
        this.liquid.addMass(Math.floor(x / projection), Math.floor(y / projection), mass);
    }

    data() {
        return this._tiles;
    }

    update(camera: Camera) {
        this._chunk.generate(camera);
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        const viewXBegin = Math.max(0, Math.floor((camera.x - TILE_SIZE) / TILE_SIZE));
        const viewYBegin = Math.max(0, Math.floor((camera.y - TILE_SIZE) / TILE_SIZE));
        const viewXEnd = Math.min(Math.floor((camera.x + camera.w + TILE_SIZE) / TILE_SIZE), this.width - 1);
        const viewYEnd = Math.min(Math.floor((camera.y + camera.h + TILE_SIZE) / TILE_SIZE), this.height - 1);

        for (let x, y = viewYBegin; y < viewYEnd; y++) {
            for (x = viewXBegin; x < viewXEnd; x++) {
                ctx.save();
                ctx.translate(Math.floor(x * TILE_SIZE - camera.x), Math.floor(y * TILE_SIZE - camera.y));
                this.tile.draw(this.getTileId(x, y), ctx, this.getId(x, y), this.liquid);
                ctx.restore();
            }
        }

        this.update(camera);
    }
}
