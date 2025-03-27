export enum ChunkType {
    UNINITIALIZED,
    MEADOW,
    BEACH,
    OCEAN,
}

export type ChunkData = {
    generated: boolean;
    type: ChunkType;
};

export type ChunkArgs = {
    width: number;
    height: number;
    coords: Uint32Array;
    water: Float32Array;
    tiles: Uint8Array;
    backgrounds: Uint8Array;
    widthInBlocks: number;
};
