import { World } from '../world';
import { Thread } from '../thread';
import { MessageType } from './types';
import { TILE_SIZE } from '../tile';

export class Liquid {
    private readonly world: World;
    private readonly thread: Thread;

    public masses: Float32Array;

    constructor(world: World) {
        this.world = world;
        this.thread = new Thread(new Worker(new URL('./worker.ts', import.meta.url)));
        this.masses = new Float32Array(world.widthInBlocks * world.heightInBlocks);

        this.thread.send({
            type: MessageType.INIT,
            data: {
                minMass: 0.01,
                maxMass: Math.floor(TILE_SIZE / 2),
                compression: 0.02,
                speed: 5,
                minFlow: 32,
                width: world.widthInBlocks,
                height: world.heightInBlocks,
                masses: this.masses,
                updated: new Float32Array(world.widthInBlocks * world.heightInBlocks),
                tiles: world.tiles,
                instances: world.tile.data().map(({ sprite, ...rest }) => rest),
            },
        });

        this.thread.get().subscribe(({ tiles, masses }) => {
            if (tiles?.length) {
                world.tiles = tiles;
                this.masses = masses;
            }
        });
    }

    sync(x: number, y: number, id: number) {
        this.thread.send({
            type: MessageType.SYNC,
            data: {
                x,
                y,
                id,
            },
        });
    }

    addMass(x: number, y: number, mass = Math.floor(TILE_SIZE / 2)) {
        this.thread.send({
            type: MessageType.ADD,
            data: {
                x,
                y,
                mass,
            },
        });
    }
}
