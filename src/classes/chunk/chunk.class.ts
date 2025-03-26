import type { World } from '@world/world.class';
import type { Camera } from '@camera/camera.class';
import type { ChunkArgs } from '@chunk/types';
import { Thread } from '@thread/thread.class';
import { MessageType } from '@liquid/types';

export const MIN_CHUNK_LENGTH = 256;

export class Chunk {
    private static _instance?: Chunk;
    private readonly _cameraCoords: Uint32Array;
    private readonly _thread: Thread;

    constructor(world: World, size = MIN_CHUNK_LENGTH) {
        if (Chunk._instance) {
            return Chunk._instance;
        }

        Chunk._instance = this;

        this._thread = new Thread(new Worker(new URL('./chunk-worker.ts', import.meta.url)));
        this._cameraCoords = new Uint32Array(new SharedArrayBuffer(16));

        this._thread.send({
            type: MessageType.INIT,
            data: {
                width: Math.ceil(world.widthInBlocks / size),
                height: Math.ceil(world.heightInBlocks / size),
                coords: this._cameraCoords,
                tiles: world.data(),
                backgrounds: world.backgrounds(),
                widthInBlocks: world.widthInBlocks,
            } satisfies ChunkArgs,
        });
    }

    generate(camera: Camera) {
        this._cameraCoords.set([camera.x, camera.y, camera.w, camera.h]);
    }
}
