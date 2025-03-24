export const enum ChunkType {
    UNINITIALIZED = 'UNINITIALIZED',
    MEADOW = 'MEADOW',
    BEACH = 'BEACH',
}

export type ChunkData = {
    generated: boolean;
    type: ChunkType;
}
