import type { World } from '@world/world.class';
import type { LiquidArgs } from '@liquid/types';
import { Thread } from '@thread/thread.class';
import { Camera } from '@camera/camera.class';
import { ThreadMessageType } from '@thread/thread-msg-type';

export const LIQUID_MAX_MASS = 8;

const INT_SIZE = 4;

export class Liquid {
    private static _instance?: Liquid;

    private readonly _thread: Thread;
    private readonly _camera: Camera;

    masses: Float32Array;
    updated: Float32Array;

    constructor(world: World) {
        if (Liquid._instance) {
            return Liquid._instance;
        }

        Liquid._instance = this;

        this._thread = new Thread(new Worker(new URL('../thread/liquid.thread.ts', import.meta.url)));
        this._camera = new Camera();

        this.masses = new Float32Array(new SharedArrayBuffer(world.widthInBlocks * world.heightInBlocks * INT_SIZE));
        this.updated = new Float32Array(new SharedArrayBuffer(world.widthInBlocks * world.heightInBlocks * INT_SIZE));

        this._thread.send({
            type: ThreadMessageType.INIT,
            data: {
                minMass: 0.01,
                maxMass: LIQUID_MAX_MASS,
                compression: 0.02,
                speed: 15,
                minFlow: 1,
                width: world.widthInBlocks,
                height: world.heightInBlocks,
                masses: this.masses,
                updated: this.updated,
                tiles: world.data(),
                coords: this._camera.coords,
                instances: world.tile.data().map(({ sprite, ...rest }) => rest),
            } satisfies LiquidArgs,
        });
    }

    addMass(x: number, y: number, mass = LIQUID_MAX_MASS) {
        this._thread.send({
            type: ThreadMessageType.ADD,
            data: { x, y, mass },
        });
    }
}
