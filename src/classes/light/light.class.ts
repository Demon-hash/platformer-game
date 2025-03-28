import type { World } from '@world/world.class';
import type { LightArgs } from '@light/types';
import { Thread } from '@thread/thread.class';
import { Camera } from '@camera/camera.class';
import { ThreadMessageType } from '@thread/thread-msg-type';

export class Light {
    private static _instance?: Light;

    private readonly _thread: Thread;
    private readonly _world: World;
    private readonly _camera: Camera;

    readonly light_s: Uint8Array;
    readonly light_h: Uint8Array;

    constructor(world: World) {
        if (Light._instance) {
            return Light._instance;
        }

        Light._instance = this;

        this._thread = new Thread(new Worker(new URL('../thread/light.thread.ts', import.meta.url)));
        this._camera = new Camera();

        this._world = world;

        this.light_s = new Uint8Array(new SharedArrayBuffer(world.widthInBlocks * world.heightInBlocks));
        this.light_h = new Uint8Array(new SharedArrayBuffer(world.widthInBlocks * world.heightInBlocks));

        this._thread.send({
            type: ThreadMessageType.INIT,
            data: {
                width: world.widthInBlocks,
                height: world.heightInBlocks,
                light_h: this.light_h,
                light_s: this.light_s,
                tiles: world.data(),
                backgrounds: world.backgrounds(),
                coords: this._camera.coords,
                instances: world.tile.data().map(({ sprite, ...rest }) => rest),
            } satisfies LightArgs,
        });
    }

    addSource(x: number, y: number, range = 2) {
        this._thread.send({
            type: ThreadMessageType.ADD,
            data: { x, y, range },
        });
    }

    getLightSource(x: number, y: number) {
        const id = Math.floor(y * this._world.widthInBlocks + x);
        return (this.light_s?.[id] ?? 0) / 50;
    }
}
