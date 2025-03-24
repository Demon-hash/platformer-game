import Alea from 'alea';
import { createNoise2D } from 'simplex-noise';
import { TILE_SIZE } from '@tile/tile';
import { type ChunkData, ChunkType } from '@chunk/types';
import { Biom } from '@biom/biom';
import type { World } from '@world/world';
import type { Camera } from '@camera/camera';
import { TileEnum } from '@resources/tile.enum';

const ChunkTypes = [ChunkType.MEADOW, ChunkType.BEACH];

export const MIN_CHUNK_LENGTH = 256;

export class Chunk {
    private static _instance?: Chunk;

    private readonly _width: number;
    private readonly _height: number;
    private readonly _size: number;
    private readonly _world: World;
    private readonly _data: ChunkData[];
    private readonly _frequency: number;
    private readonly _seed = new Date().valueOf();
    private readonly _biom: Biom;

    private _gradation: number;
    private _lastTreeCoords: number;

    constructor(world: World, size = MIN_CHUNK_LENGTH) {
        if (Chunk._instance) {
            return Chunk._instance;
        }

        Chunk._instance = this;

        this._biom = new Biom();

        this._world = world;
        this._size = size;
        this._width = Math.ceil(this._world.widthInBlocks / this._size);
        this._height = Math.ceil(this._world.heightInBlocks / this._size);
        this._frequency = Math.floor(this._width / 2);
        this._gradation = this._size;
        this._lastTreeCoords = 0;

        this._data = new Array(this._width * this._height).fill(null).map(() => ({
            type: ChunkType.UNINITIALIZED,
            generated: false,
        }));
    }

    generate(camera: Camera) {
        const centerX = (camera.x + camera.w) / 2;
        const centerY = (camera.y + camera.h) / 2;
        const chunkSize = this._size * TILE_SIZE;

        const chunkXId = Math.floor(centerX / (chunkSize / 2));
        const chunkYId = Math.floor(centerY / (chunkSize / 2));

        for (let x, y = chunkYId - 1; y <= chunkYId + 1; y++) {
            for (x = chunkXId - 1; x <= chunkXId + 1; x++) {
                if (x < 0 || y < 0 || x >= this._width || y >= this._height || this._getChunkData(x, y, 'generated'))
                    continue;

                this._coverLevel(x * this._size, y * this._size, y);
                this._setChunkData(x, y, 'generated', true);
            }
        }
    }

    private _coverLevel(x: number, y: number, level: number) {
        if (level === 0) {
            return;
        }

        if (level > 1) {
            return this._fillDeep(x, y, TileEnum.STONE, TileEnum.STONE, y);
        }

        const { cover, dirt, stone, trees } = this._biom.data(this._getType());
        const randomTreeIndex = Math.floor(Math.random() * trees.length);

        for (let w = 0; w < this._size; w++) {
            this._gradation += Math.floor(this._smooth(x + w, this._gradation)) * this._amplitude(-1, 1);

            this._lastTreeCoords = trees[randomTreeIndex](this._world, x + w, this._gradation, this._lastTreeCoords);

            this._world.setTileId(x + w, this._gradation, cover, 1);
            this._fillDeep(x + w, this._gradation + 1, dirt, stone, level);
        }
    }

    private _getType() {
        return ChunkTypes[Math.floor(Math.random() * ChunkTypes.length)];
    }

    private _amplitude(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }

    private _smooth(x: number, y: number): number {
        const noise2D = createNoise2D(Alea(this._seed));
        return (noise2D(x - 1, y) + noise2D(x, y) + noise2D(x + 1, y)) / this._frequency;
    }

    private _fillDeep(x: number, y: number, dirt: number, stone: number, level = 0) {
        if (level === 1) {
            for (let z = 16, i = 0; i < this._size; i++) {
                this._world.setTileId(x, y + i, i >= z ? stone : dirt, 1);
            }
        } else {
            for (let i = 0; i < this._size; i++) {
                this._world.setTileId(x, y + i, stone, 1);
            }
        }
    }

    private _getChunkId(x: number, y: number) {
        return Math.floor(y * this._width + x);
    }

    private _setChunkData<K extends keyof ChunkData, V extends ChunkData[K]>(x: number, y: number, key: K, value: V) {
        this._data[this._getChunkId(x, y)][key] = value;
    }

    private _getChunkData(x: number, y: number, key: keyof ChunkData) {
        return this._data[this._getChunkId(x, y)][key];
    }
}
