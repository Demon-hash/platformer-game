import type { TileData } from '@tile/types';

export type LightDataInstance = Exclude<TileData, 'sprite'>;

export interface LightArgs {
    width: number;
    height: number;
    light_h: Uint8Array;
    light_s: Uint8Array;
    tiles: Uint8Array;
    instances: LightDataInstance[];
}
