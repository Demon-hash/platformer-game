import type { TileData } from '../tile';

export const enum MessageType {
    INIT = 'INIT',
    ADD = 'ADD',
}

export type LiquidDataInstance = Omit<TileData, 'sprite'>;

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
    instances: LiquidDataInstance[];
}
