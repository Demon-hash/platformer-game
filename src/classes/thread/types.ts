import type { ThreadMessageType } from '@thread/thread-msg-type';
import type { TileData } from '@tile/types';

export type ThreadTileDataInstance = Omit<TileData, 'sprite'>;

export type ThreadEvent = {
    type: ThreadMessageType;
    data?: unknown;
};
