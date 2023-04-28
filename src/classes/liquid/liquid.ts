import { World } from '../world';
import { Thread } from '../thread';
import { MessageType } from './types';

export const LIQUID_MAX_MASS = 8;

export class Liquid {
    private readonly thread: Thread;
    public masses: Float32Array;

    constructor(world: World) {
        this.thread = new Thread(new Worker(new URL('./worker.ts', import.meta.url)));
        this.masses = new Float32Array(new SharedArrayBuffer(world.widthInBlocks * world.heightInBlocks * 4));

        this.thread.send({
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
        this.thread.send({
            type: MessageType.ADD,
            data: { x, y, mass },
        });
    }
}
