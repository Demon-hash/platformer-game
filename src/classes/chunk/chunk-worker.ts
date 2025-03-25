import Alea from 'alea';
import { createNoise2D, createNoise3D } from 'simplex-noise';
import { type ChunkArgs, type ChunkData, ChunkType } from '@chunk/types';
import { TILE_SIZE } from '@tile/tile.class';
import { Biom } from '@biom/biom.class';
import { TileEnum } from '@resources/tile.enum';
import { MessageType } from '@liquid/types';

const chunkSize = 256;
const chunkTypes = [ChunkType.MEADOW];
const biom = new Biom();
const seed = new Date().valueOf();

let chunkData: ChunkData[] = [];
let settings: ChunkArgs;
let startHeight = 350;
let lastTreeCoords = 0;

self.onmessage = ({
    data: {
        message: { type, data },
    },
}) => {
    switch (type as MessageType) {
        case MessageType.INIT:
            settings = data;

            chunkData = new Array(settings.width * settings.height).fill(null).map(() => ({
                type: ChunkType.UNINITIALIZED,
                generated: false,
            }));

            setInterval(() => generate(), 1);
            break;
    }
};

function generate() {
    const [cameraX, cameraY, cameraW, cameraH] = settings.coords;

    const centerX = (cameraX + cameraW) / 2;
    const centerY = (cameraY + cameraH) / 2;
    const chunkSizeLen = chunkSize * TILE_SIZE;

    const chunkXId = Math.floor(centerX / (chunkSizeLen / 2));
    const chunkYId = Math.floor(centerY / (chunkSizeLen / 2));

    for (let x, y = chunkYId - 1; y <= chunkYId + 1; y++) {
        for (x = chunkXId - 1; x <= chunkXId + 1; x++) {
            if (x < 0 || y < 0 || x >= settings.width || y >= settings.height || getChunkData(x, y, 'generated'))
                continue;

            coverLevel(x * chunkSize, y * chunkSize, y);
            setChunkData(x, y, 'generated', true);
        }
    }
}

function coverLevel(x: number, y: number, level: number) {
    const { cover, dirt, stone, trees } = biom.data(getType());
    const randomTreeIndex = Math.floor(Math.random() * trees.length);
    const gradations = getGradations(x);

    for (let l, w = 0; w < chunkSize; w += 12) {
        circle(x + w, gradations[w], 24, () => true, dirt);
        circle(x + w, gradations[w], 24, (x, y) => getWorldTile(x, y - 1) === TileEnum.SKY, cover);

        for (l = 0; l < chunkSize; l += 12) {
            circle(x + w, gradations[w] + l + 48, 24, () => true, stone);
        }
    }

    /*for (let _z, _x, _y = 0; _y < settings.chunkSize; _y++) {
        for (_x = 0; _x < settings.chunkSize; _x++) {
            _z = amplitude(-1, 1);

            if (worm(_x, _y, _z) < 0) {
                circle(x + _x, gradations[0] + _y, 12, () => true, TileEnum.SKY);
            }
        }
    }*/

    // settings.lastTreeCoords = trees[randomTreeIndex](
    //                         settings.world,
    //                         x,
    //                         y - 20,
    //                         settings.lastTreeCoords,
    //                         x + settings.chunkSize - 32
    //                     );
}

function worm(x: number, y: number, z: number) {
    const noise3D = createNoise3D();
    return noise3D(x, y, z);
}

function circle(
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
                settings.tiles;

                setWorldTile(x + dx, y + dy, material, 1);
                onSet?.(x + dx, y + dy);
            }
        }
    }
}

function getGradations(x: number) {
    return Array.from({ length: chunkSize })
        .fill(0)
        .map((_, index) => {
            if (index === 0) {
                return startHeight;
            }

            startHeight += Math.floor(smooth(x + index, startHeight)) * amplitude(-1, 1);
            return startHeight;
        });
}

function getType() {
    return chunkTypes[Math.floor(Math.random() * chunkTypes.length)];
}

function amplitude(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
}

function smooth(x: number, y: number): number {
    const noise2D = createNoise2D(Alea(seed));
    const frequency = Math.floor(settings.width / 2);

    return (noise2D(x - 1, y) + noise2D(x, y) + noise2D(x + 1, y)) / frequency;
}

function getChunkId(x: number, y: number) {
    return Math.floor(y * settings.width + x);
}

function setChunkData<K extends keyof ChunkData, V extends ChunkData[K]>(x: number, y: number, key: K, value: V) {
    chunkData[getChunkId(x, y)][key] = value;
}

function getChunkData(x: number, y: number, key: keyof ChunkData) {
    return chunkData[getChunkId(x, y)][key];
}

function getWorldId(x: number, y: number) {
    return Math.floor(y * settings.widthInBlocks + x);
}

function setWorldTile(x: number, y: number, id: number, projection = TILE_SIZE) {
    settings.tiles[Math.floor(Math.floor(y / projection) * settings.widthInBlocks + Math.floor(x / projection))] = id;
}

function getWorldTile(x: number, y: number): number {
    return settings.tiles[getWorldId(x, y)];
}
