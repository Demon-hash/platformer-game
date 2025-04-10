import type { Camera } from '@camera/camera.class';
import { Chunk } from '@chunk/chunk.class';
import { Tile, TILE_SIZE } from '@tile/tile.class';
import { Liquid, LIQUID_MAX_MASS } from '@liquid/liquid.class';
import { Light } from '@light/light.class';
import { LiquidKind } from '@liquid/types';

export const WORLD_WIDTH = 8400;
export const WORLD_HEIGHT = 2400;

export class World {
    private static _instance?: World;

    private readonly _chunk: Chunk;

    readonly tile: Tile;
    readonly liquid: Liquid;
    readonly light: Light;

    readonly width: number;
    readonly height: number;
    readonly widthInBlocks: number;
    readonly heightInBlocks: number;

    private readonly _tiles: Uint8Array;
    private readonly _backgrounds: Uint8Array;

    constructor() {
        if (World._instance) {
            return World._instance;
        }

        World._instance = this;

        this.tile = new Tile();

        this.width = WORLD_WIDTH * TILE_SIZE;
        this.height = WORLD_HEIGHT * TILE_SIZE;

        this.widthInBlocks = Math.floor(this.width / TILE_SIZE);
        this.heightInBlocks = Math.floor(this.height / TILE_SIZE);

        this._tiles = new Uint8Array(new SharedArrayBuffer(this.widthInBlocks * this.heightInBlocks));
        this._backgrounds = new Uint8Array(new SharedArrayBuffer(this.widthInBlocks * this.heightInBlocks));

        this.liquid = new Liquid(this);
        this.light = new Light(this);

        this._chunk = new Chunk(this, this.liquid);
    }

    getId(x: number, y: number) {
        return Math.floor(y * this.widthInBlocks + x);
    }

    setTileId(x: number, y: number, id: number, projection = TILE_SIZE) {
        this._tiles[Math.floor(Math.floor(y / projection) * this.widthInBlocks + Math.floor(x / projection))] = id;
    }

    setBackgroundTileId(x: number, y: number, id: number, projection = TILE_SIZE) {
        this._backgrounds[Math.floor(Math.floor(y / projection) * this.widthInBlocks + Math.floor(x / projection))] =
            id;
    }

    getBackgroundTileId(x: number, y: number): number {
        return this._backgrounds[this.getId(x, y)];
    }

    getTileId(x: number, y: number): number {
        return this._tiles[this.getId(x, y)];
    }

    addLiquid(x: number, y: number, kind: LiquidKind, mass = LIQUID_MAX_MASS, projection = TILE_SIZE) {
        this.liquid.addMass(Math.floor(x / projection), Math.floor(y / projection), mass, kind);
    }

    createLightSource(x: number, y: number, range = 25, projection = TILE_SIZE) {
        this.light.addSource(Math.floor(x / projection), Math.floor(y / projection), range);
    }

    data() {
        return this._tiles;
    }

    backgrounds() {
        return this._backgrounds;
    }

    update(camera: Camera) {
        void this._chunk.generate(camera);
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
                this.tile.draw(
                    this.getTileId(x, y),
                    this.getBackgroundTileId(x, y),
                    this.getTileId(x, y - 1),
                    ctx,
                    this.getId(x, y),
                    this.liquid,
                    this.light.getLightSource(x, y)
                );
                ctx.restore();
            }
        }

        this.update(camera);
    }
}
