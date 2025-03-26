import type { TileData } from '@tile/types';

export type LightDataInstance = Omit<TileData, 'sprite'>;

export interface LightArgs {
    width: number;
    height: number;
    light_h: Uint8Array;
    light_s: Uint8Array;
    tiles: Uint8Array;
    backgrounds: Uint8Array;
    coords: Uint32Array;
    instances: LightDataInstance[];
}
