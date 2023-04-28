import Alea from 'alea';
import { createNoise2D } from 'simplex-noise';
import { World } from '../world';
import { Camera } from '../camera';
import { TILE_SIZE } from '../tile';
import { ChunkData } from './types';

export class Chunk {
    private readonly width: number;
    private readonly height: number;
    private readonly size: number;
    private readonly world: World;
    private readonly chunks: ChunkData[];
    private readonly frequency: number;
    private readonly seed = new Date().valueOf();

    private gradation: number;

    constructor(world: World, size: number = 256) {
        this.world = world;
        this.size = size;
        this.width = Math.ceil(this.world.widthInBlocks / this.size);
        this.height = Math.ceil(this.world.heightInBlocks / this.size);
        this.frequency = Math.floor(this.width / 2);
        this.gradation = this.size;

        this.chunks = new Array(this.width * this.height).fill(null).map(() => ({
            generated: false,
        }));
    }

    private amplitude(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }

    private smooth(x: number, y: number): number {
        const noise2D = createNoise2D(Alea(this.seed));
        return (noise2D(x - 1, y) + noise2D(x, y) + noise2D(x + 1, y)) / this.frequency;
    }

    private fillDeep(x: number, y: number, level = 0) {
        if (level === 1) {
            for (let z = 16, i = 0; i < this.size; i++) {
                this.world.setTileId(x, y + i, i >= z ? 3 : 2, 1);
            }
        } else {
            for (let i = 0; i < this.size; i++) {
                this.world.setTileId(x, y + i, 3, 1);
            }
        }
    }

    setChunkData<K extends keyof ChunkData, V extends ChunkData[K]>(x: number, y: number, key: K, value: V) {
        this.chunks[this.getChunkId(x, y)][key] = value;
    }

    getChunkData(x: number, y: number, key: keyof ChunkData) {
        return this.chunks[this.getChunkId(x, y)][key];
    }

    getChunkId(x: number, y: number) {
        return Math.floor(y * this.width + x);
    }

    generate(camera: Camera) {
        const centerX = (camera.x + camera.w) / 2;
        const centerY = (camera.y + camera.h) / 2;
        const chunkSize = this.size * TILE_SIZE;

        const chunkXId = Math.floor(centerX / (chunkSize / 2));
        const chunkYId = Math.floor(centerY / (chunkSize / 2));

        for (let x, y = chunkYId - 1; y <= chunkYId + 1; y++) {
            for (x = chunkXId - 1; x <= chunkXId + 1; x++) {
                if (x < 0 || y < 0 || x >= this.width || y >= this.height || this.getChunkData(x, y, 'generated'))
                    continue;

                const sx = x * this.size;
                const sy = y * this.size;

                switch (y) {
                    case 0:
                        break;
                    case 1:
                        for (let w = 0; w < this.size; w++) {
                            this.gradation += Math.floor(this.smooth(sx + w, this.gradation)) * this.amplitude(-1, 1);

                            this.world.setTileId(sx + w, this.gradation, 1, 1);
                            this.fillDeep(sx + w, this.gradation + 1, y);
                        }
                        break;
                    default:
                        for (let w = 0; w < this.size; w++) {
                            this.fillDeep(sx + w, sy, y);
                        }
                        break;
                }

                this.setChunkData(x, y, 'generated', true);
            }
        }
    }
}
