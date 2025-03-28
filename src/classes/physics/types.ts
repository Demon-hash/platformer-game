import type { ThreadTileDataInstance } from '@thread/types';

export type PhysicsArgs = {
    width: number;
    height: number;
    tiles: Uint8Array;
    instances: ThreadTileDataInstance[];
};
