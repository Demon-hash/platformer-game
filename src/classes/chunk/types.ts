export const enum ChunkType {
    UNINITIALIZED = 'UNINITIALIZED',
    MEADOW = 'MEADOW',
    BEACH = 'BEACH',
}

export interface ChunkData {
    generated: boolean;
    type: ChunkType;
}
