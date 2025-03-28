import type { PhysicsArgs } from './types';
import { Thread } from '@thread/thread.class';
import { ThreadMessageType } from '@thread/thread-msg-type';
import { World } from '@world/world.class';

export type PhysicsCalculated = {
    id: string;
    velocity: Float32Array;
    coords: Float32Array;
};

export class Physics {
    private static _instance?: Physics;

    private readonly _thread: Thread;
    private readonly _world: World;

    constructor() {
        if (Physics._instance) {
            return Physics._instance;
        }

        Physics._instance = this;

        this._thread = new Thread(new Worker(new URL('../thread/physics.thread.ts', import.meta.url)));
        this._world = new World();

        this._thread.send({
            type: ThreadMessageType.INIT,
            data: {
                tiles: this._world.data(),
                width: this._world.widthInBlocks,
                height: this._world.heightInBlocks,
                instances: this._world.tile.data().map(({ sprite, ...rest }) => rest),
            } satisfies PhysicsArgs,
        });
    }
}
