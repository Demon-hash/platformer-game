import Alea from 'alea';
import { createNoise2D } from 'simplex-noise';
import { World } from '../world';
import { Camera } from '../camera';
import { TILE_SIZE } from '../tile';
import { Plants } from '../plants';
import { ChunkData, ChunkType } from './types';
import { Biom } from '../biom/biom';

export class Chunk {
    private readonly width: number;
    private readonly height: number;
    private readonly size: number;
    private readonly world: World;
    private readonly chunks: ChunkData[];
    private readonly frequency: number;
    private readonly seed = new Date().valueOf();
    private readonly plants: Plants;
    private readonly biom: Biom;

    private gradation: number;

    constructor(world: World, size: number = 256) {
        this.plants = new Plants(world);
        this.biom = new Biom();

        this.world = world;
        this.size = size;
        this.width = Math.ceil(this.world.widthInBlocks / this.size);
        this.height = Math.ceil(this.world.heightInBlocks / this.size);
        this.frequency = Math.floor(this.width / 2);
        this.gradation = this.size;

        this.chunks = new Array(this.width * this.height).fill(null).map(() => ({
            type: ChunkType.UNINITIALIZED,
            generated: false,
        }));
    }

    private getType() {
        const type = [ChunkType.MEADOW, ChunkType.BEACH];
        return type[Math.floor(Math.random() * type.length)];
    }

    private amplitude(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }

    private smooth(x: number, y: number): number {
        const noise2D = createNoise2D(Alea(this.seed));
        return (noise2D(x - 1, y) + noise2D(x, y) + noise2D(x + 1, y)) / this.frequency;
    }

    private fillDeep(x: number, y: number, dirt: number, stone: number, level = 0) {
        if (level === 1) {
            for (let z = 16, i = 0; i < this.size; i++) {
                this.world.setTileId(x, y + i, i >= z ? stone : dirt, 1);
            }
        } else {
            for (let i = 0; i < this.size; i++) {
                this.world.setTileId(x, y + i, stone, 1);
            }
        }
    }

    private getChunkId(x: number, y: number) {
        return Math.floor(y * this.width + x);
    }

    private setChunkData<K extends keyof ChunkData, V extends ChunkData[K]>(x: number, y: number, key: K, value: V) {
        this.chunks[this.getChunkId(x, y)][key] = value;
    }

    private getChunkData(x: number, y: number, key: keyof ChunkData) {
        return this.chunks[this.getChunkId(x, y)][key];
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
                        const type = this.getType();
                        const { cover, dirt, stone } = this.biom.data(type);

                        for (let w = 0; w < this.size; w++) {
                            this.gradation += Math.floor(this.smooth(sx + w, this.gradation)) * this.amplitude(-1, 1);

                            this.plants.tree(sx + w, this.gradation, type);
                            this.world.setTileId(sx + w, this.gradation, cover, 1);
                            this.fillDeep(sx + w, this.gradation + 1, dirt, stone, y);
                        }
                        break;
                    default:
                        for (let w = 0; w < this.size; w++) {
                            this.fillDeep(sx + w, sy, 6, 6, y);
                        }
                        break;
                }

                this.setChunkData(x, y, 'generated', true);
            }
        }
    }
}
