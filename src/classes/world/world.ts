import {Tile, TILE_SIZE} from "../tile";
import {Camera} from "../camera";
import {Chunk} from "../chunk";
import {Liquid} from "../liquid";

export const WORLD_WIDTH = 8192;
export const WORLD_HEIGHT = 4096;

export class World {
    public tiles: Uint8Array;
    private readonly chunk: Chunk;

    public readonly tile: Tile;
    public readonly liquid: Liquid;
    public readonly width: number;
    public readonly height: number;
    public readonly widthInBlocks: number;
    public readonly heightInBlocks: number;

    constructor() {
        this.tile = new Tile();

        this.width = WORLD_WIDTH * TILE_SIZE;
        this.height = WORLD_HEIGHT * TILE_SIZE;

        this.widthInBlocks = Math.floor(this.width / TILE_SIZE);
        this.heightInBlocks = Math.floor(this.height / TILE_SIZE);

        this.tiles = new Uint8Array(this.widthInBlocks * this.heightInBlocks);
        this.liquid = new Liquid(this);
        this.chunk = new Chunk(this);
    }

    setTileId(x: number, y: number, id: number, projection = TILE_SIZE) {
        this.tiles[Math.floor((Math.floor(y / projection) * this.widthInBlocks) + Math.floor(x / projection))] = id;
        this.liquid.sync(Math.floor(x / projection), Math.floor(y / projection), id);
    }

    addLiquid(x: number, y: number, projection = TILE_SIZE) {
        this.liquid.addMass(Math.floor(x / projection), Math.floor(y / projection));
    }

    getTitleId(x: number, y: number): number {
        return this.tiles[Math.floor((y * this.widthInBlocks) + x)];
    }

    update() {
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

        void this.chunk.generate(camera);
    }
}
