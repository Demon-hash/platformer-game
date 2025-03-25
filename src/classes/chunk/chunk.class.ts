import Alea from 'alea';
import { createNoise2D } from 'simplex-noise';
import { TILE_SIZE } from '@tile/tile.class';
import { type ChunkData, ChunkType } from '@chunk/types';
import { Biom } from '@biom/biom.class';
import type { World } from '@world/world.class';
import type { Camera } from '@camera/camera.class';
import { TileEnum } from '@resources/tile.enum';

// ChunkType.MEADOW, ChunkType.BEACH
const ChunkTypes = [ChunkType.MEADOW];

export const MIN_CHUNK_LENGTH = 256;

export class Chunk {
    private static _instance?: Chunk;

    private readonly _width: number;
    private readonly _height: number;
    private readonly _size: number;
    private readonly _world: World;
    private readonly _data: ChunkData[];
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
        this._lastTreeCoords = 0;
        this._gradation = 312;

        this._data = new Array(this._width * this._height).fill(null).map(() => ({
            type: ChunkType.UNINITIALIZED,
            generated: false,
        }));
    }

    async generate(camera: Camera) {
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
        const { cover, dirt, stone, trees } = this._biom.data(this._getType());
        const randomTreeIndex = Math.floor(Math.random() * trees.length);

        const gradations = Array.from({ length: this._size })
            .fill(0)
            .map((_, index) => {
                if (index === 0) {
                    return this._gradation;
                }

                this._gradation += Math.floor(this._smooth(x + index, this._gradation)) * this._amplitude(-1, 1);
                return this._gradation;
            });

        for (let l, w = 0; w < this._size; w += 12) {
            this._circle(x + w, gradations[w], 24, () => true, dirt);
            this._circle(x + w, gradations[w], 24, (x, y) => this._world.getTileId(x, y - 1) === TileEnum.SKY, cover);

            for (l = 0; l < this._size; l += 12) {
                this._circle(x + w, gradations[w] + l + 48, 24, () => true, stone);
            }
        }

        // this._lastTreeCoords = trees[randomTreeIndex](
        //                         this._world,
        //                         x,
        //                         y - 20,
        //                         this._lastTreeCoords,
        //                         x + this._size - 32
        //                     );
    }

    private _circle(
        x: number,
        y: number,
        radius: number,
        comporator: (x: number, y: number) => boolean,
        material: number,
        onSet?: (x: number, y: number) => void
    ) {
        for (let w, h = 0; h < radius * 2; h++) {
            for (w = 0; w < radius * 2; w++) {
                const dx = radius - w;
                const dy = radius - h;

                if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(radius, 2) && comporator(x + dx, y + dy)) {
                    this._world.setTileId(x + dx, y + dy, material, 1);
                    onSet?.(x + dx, y + dy);
                }
            }
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
        const frequency = Math.floor(this._width / 2);

        return (noise2D(x - 1, y) + noise2D(x, y) + noise2D(x + 1, y)) / frequency;
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
