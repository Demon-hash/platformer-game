import type { BiomTree } from '@biom/types';
import Alea from 'alea';
import { createNoise2D } from 'simplex-noise';
import { type ChunkArgs, type ChunkData, ChunkType } from '@chunk/types';
import { TILE_SIZE } from '@tile/tile.class';
import { Biom } from '@biom/biom.class';
import { TileEnum } from '@resources/tile.enum';
import { ThreadMessageType } from '@thread/thread-msg-type';

const chunkSize = 256;
const biom = new Biom();
const seed = new Date().valueOf();

let chunkData: ChunkData[] = [];
let settings: ChunkArgs;
let startHeight = 350;
let lastTreeCoords = 0;

type Position = {
    edges: boolean;
    center: boolean;
    halfVertical: boolean;
    halfHorizontal: boolean;
    top: boolean;
};

self.onmessage = ({
    data: {
        message: { type, data },
    },
}) => {
    switch (type as ThreadMessageType) {
        case ThreadMessageType.INIT:
            settings = data;

            chunkData = new Array(settings.width * settings.height).fill(null).map(() => ({
                type: ChunkType.UNINITIALIZED,
                generated: false,
            }));

            setInterval(() => generate(), 1);
            break;
    }
};

function renderChunks(chunkXId: number, chunkYId: number, func: (a: number, b: number) => void) {
    for (let x, y = chunkYId - 1; y <= chunkYId + 1; y++) {
        for (x = chunkXId - 1; x <= chunkXId + 1; x++) {
            if (x < 0 || y < 0 || x >= settings.width || y >= settings.height) {
                continue;
            }

            func(x, y);
        }
    }
}

function generate() {
    const [cameraX, cameraY, cameraW, cameraH] = settings.coords;

    const centerX = (cameraX + cameraW) / 2;
    const centerY = (cameraY + cameraH) / 2;
    const chunkSizeLen = chunkSize * TILE_SIZE;

    const chunkXId = Math.floor(centerX / (chunkSizeLen / 2));
    const chunkYId = Math.floor(centerY / (chunkSizeLen / 2));

    renderChunks(chunkXId, chunkYId, (x, y) => {
        if (getChunkData(x, y, 'generated')) {
            return;
        }

        createCaves(x * chunkSize, y * chunkSize, y);
        coverLevel(x * chunkSize, y * chunkSize, y);

        setChunkData(x, y, 'generated', true);
    });
}

function createCaves(x: number, y: number, level: number) {
    if (level < 2) {
        return;
    }

    const worm = getWorm(x, y);
    for (let w = 0; w < worm.length; w++) {
        circle(x + w, worm[w], 10, () => TileEnum.UNKNOWN);
    }
}

function deepLevel(x: number, gradations: number[], material: number, y?: number) {
    for (let h = 0; h < chunkSize; h++) {
        for (let w = 0; w < chunkSize; w++) {
            if (getWorldTile(x + w, (y ?? gradations[w]) + h) === TileEnum.UNKNOWN) {
                setWorldBackgroundTile(x + w, (y ?? gradations[w]) + h, TileEnum.SAND, 1);
                continue;
            }

            setWorldTile(x + w, (y ?? gradations[w]) + h, material, 1);
        }
    }
}

function plant(trees: BiomTree[], gradations: number[], x: number, cover: number, dirt: number) {
    if (!trees.length) {
        lastTreeCoords += chunkSize;
        return;
    }

    const randomTreeIndex = Math.floor(Math.random() * trees.length);

    for (let w = 0; w < chunkSize; w++) {
        circle(x + w, gradations[w], 30, (a, b) => {
            if (getWorldTile(a, b) === cover) {
                const coords = trees[randomTreeIndex](setWorldTile, a, b - 1, lastTreeCoords);

                if (coords) {
                    lastTreeCoords += coords;
                    return dirt;
                }
            }

            return getWorldTile(a, b);
        });
    }
}

function coverLevel(x: number, y: number, level: number) {
    const { cover, dirt, stone, radius, trees } = biom.data(getType());

    if (level === 2) {
        const gradations = getGradations(x);
        deepLevel(x, gradations, stone);

        for (let w = 0; w < chunkSize; w++) {
            circle(x + w, gradations[w], radius, () => dirt);
            circle(x + w, gradations[w], radius, (x, y) =>
                [TileEnum.SKY, TileEnum.UNKNOWN].includes(getWorldTile(x, y - 1)) ? cover : dirt
            );
        }

        plant(trees, gradations, x, cover, dirt);
        return;
    }

    if (level > 2) {
        deepLevel(x, [], stone, y);
    }
}

function circle(x: number, y: number, r: number, comp: (x: number, y: number, p: Position) => number) {
    const R = r * 2;
    for (let w, a = 0, h = 0; h < R; h++) {
        for (w = 0; w < R; w++) {
            const dx = r - w;
            const dy = r - h;

            const O = Math.pow(dx, 2) + Math.pow(dy, 2);

            if (O <= R) {
                setWorldTile(
                    x + dx,
                    y + dy,
                    comp(x + dx, y + dy, {
                        edges: O >= R - r / 2,
                        center: O < R / 2,
                        halfVertical: dy < 1,
                        halfHorizontal: dx < 1,
                        top: dy <= -2,
                    }),
                    1
                );
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

            startHeight += Math.floor(smooth(x + index, startHeight)) * amplitude(-2, 2);
            return startHeight;
        });
}

function getWorm(x: number, y: number) {
    let w = x;
    let h = y;

    return Array.from({ length: Math.round(chunkSize * 1.5) })
        .fill(0)
        .map((_, index) => {
            if (index === 0) {
                return h;
            }

            w += amplitude(-15, 15);
            h += Math.floor(smooth(w, h)) * amplitude(-8, 8);
            return h;
        });
}

function getType() {
    const chunks = Object.values(ChunkType).filter(Number) as ChunkType[];
    return chunks[Math.floor(Math.random() * chunks.length)];
}

function amplitude(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
}

function smooth(x: number, y: number): number {
    const noise2D = createNoise2D(Alea(seed));
    const frequency = Math.floor(settings.width / 4);

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

function getWorldCoords(x: number, y: number) {
    return Math.floor(y * settings.widthInBlocks + x);
}

function canSetBackground(id: number) {
    return ![
        TileEnum.PALM_LOG,
        TileEnum.PALM_LEAVES,
        TileEnum.MAHOGANY_LOG,
        TileEnum.MAHOGANY_LEAVES,
        TileEnum.UNKNOWN,
    ].includes(id);
}

function setWorldTile(x: number, y: number, id: number, projection = TILE_SIZE) {
    settings.tiles[Math.floor(Math.floor(y / projection) * settings.widthInBlocks + Math.floor(x / projection))] = id;

    if (canSetBackground(id)) {
        let newId;

        switch (id) {
            case TileEnum.COVER:
                newId = TileEnum.DIRT;
                break;
            case TileEnum.WATER:
                settings.water[getWorldCoords(x, y)] = 1024;
                newId = TileEnum.SKY;
                break;
            default:
                newId = id;
                break;
        }

        settings.backgrounds[
            Math.floor(Math.floor(y / projection) * settings.widthInBlocks + Math.floor(x / projection))
        ] = newId;
    }
}

function setWorldBackgroundTile(x: number, y: number, id: number, projection = TILE_SIZE) {
    settings.backgrounds[Math.floor(Math.floor(y / projection) * settings.widthInBlocks + Math.floor(x / projection))] =
        id;
}

function getWorldTile(x: number, y: number): number {
    return settings.tiles[getWorldCoords(x, y)];
}
