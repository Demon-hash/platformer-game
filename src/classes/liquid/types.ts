import type { ThreadTileDataInstance } from '@thread/types';

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
    coords: Uint32Array;
    instances: ThreadTileDataInstance[];
}
