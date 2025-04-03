import type { ThreadTileDataInstance } from '@thread/types';

export enum LiquidKind {
    UNKNOWN,
    WATER,
    LAVA,
}

export interface LiquidArgs {
    minMass: number;
    maxMass: number;
    compression: number;
    speed: number;
    minFlow: number;
    width: number;
    height: number;
    masses: Float32Array;
    updated: Float32Array;
    tiles: Uint8Array;
    kind: Uint8Array;
    coords: Uint32Array;
    instances: ThreadTileDataInstance[];
}
