import { World } from '../world';
import { Thread } from '../thread';
import { MessageType } from './types';

export const LIQUID_MAX_MASS = 8;

export class Liquid {
    private readonly thread: Thread;
    public masses: Float32Array;

    constructor(world: World) {
        this.thread = new Thread(new Worker(new URL('./worker.ts', import.meta.url)));
        this.masses = new Float32Array(world.widthInBlocks * world.heightInBlocks);

        this.thread.send({
            type: MessageType.INIT,
            data: {
                minMass: 0.01,
                maxMass: LIQUID_MAX_MASS,
                compression: 0.02,
                speed: 5,
                minFlow: 32,
                width: world.widthInBlocks,
                height: world.heightInBlocks,
                masses: this.masses,
                updated: new Float32Array(world.widthInBlocks * world.heightInBlocks),
                tiles: world.data(),
                instances: world.tile.data().map(({ sprite, ...rest }) => rest),
            },
        });

        this.thread.get().subscribe(({ tiles, masses }) => {
            if (tiles?.length) {
                world.setData(tiles);
                this.masses = masses;
            }
        });
    }

    sync(x: number, y: number, id: number) {
        this.thread.send({
            type: MessageType.SYNC,
            data: { x, y, id },
        });
    }

    addMass(x: number, y: number, mass = LIQUID_MAX_MASS) {
        this.thread.send({
            type: MessageType.ADD,
            data: { x, y, mass },
        });
    }
}
