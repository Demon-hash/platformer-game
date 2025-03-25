export const enum ChunkType {
    UNINITIALIZED = 'UNINITIALIZED',
    MEADOW = 'MEADOW',
    BEACH = 'BEACH',
}

export type ChunkData = {
    generated: boolean;
    type: ChunkType;
};

export type ChunkArgs = {
    width: number;
    height: number;
    coords: Uint32Array;
    tiles: Uint8Array;
    widthInBlocks: number;
};
