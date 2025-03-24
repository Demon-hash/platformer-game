import type { World } from '@world/world';
import { Thread } from '@thread/thread';
import { MessageType } from '@liquid/types';

export const LIQUID_MAX_MASS = 8;

const INT_SIZE = 4;

export class Liquid {
    private static _instance?: Liquid;

    private readonly _thread: Thread;

    masses: Float32Array;

    constructor(world: World) {
        if (Liquid._instance) {
            return Liquid._instance;
        }

        Liquid._instance = this;

        this._thread = new Thread(new Worker(new URL('./worker.ts', import.meta.url)));
        this.masses = new Float32Array(new SharedArrayBuffer(world.widthInBlocks * world.heightInBlocks * INT_SIZE));

        this._thread.send({
            type: MessageType.INIT,
            data: {
                minMass: 1,
                maxMass: LIQUID_MAX_MASS,
                compression: 0.02,
                speed: 5,
                minFlow: 1,
                width: world.widthInBlocks,
                height: world.heightInBlocks,
                masses: this.masses,
                updated: new Float32Array(world.widthInBlocks * world.heightInBlocks),
                tiles: world.data(),
                instances: world.tile.data().map(({ sprite, ...rest }) => rest),
            },
        });
    }

    addMass(x: number, y: number, mass = LIQUID_MAX_MASS) {
        this._thread.send({
            type: MessageType.ADD,
            data: { x, y, mass },
        });
    }
}
