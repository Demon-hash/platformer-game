import {World} from "../world";
import {TILE_SIZE} from "../tile";
import {Thread} from "../thread";
import {MessageType} from "./types";

export class Liquid {
    private readonly world: World;
    private readonly thread: Thread;

    constructor(world: World) {
        this.world = world;
        this.thread = new Thread(new Worker(new URL('./worker.ts', import.meta.url)));

        this.thread.send({
            type: MessageType.INIT,
            data: {
                minMass: 0.0001,
                maxMass: TILE_SIZE,
                compression: 0.02,
                speed: 5,
                minFlow: 1,
                width: world.widthInBlocks,
                height: world.heightInBlocks,
                masses: new Uint8Array(world.widthInBlocks * world.heightInBlocks),
                updated: new Uint8Array(world.widthInBlocks * world.heightInBlocks),
                tiles: world.tiles,
            }
        });

        this.thread.get().subscribe(({tiles}) => {
            if (tiles?.length) {
                world.tiles = Uint8Array.from(tiles);
            }
        });
    }

    sync(x: number, y: number, id: number) {
        this.thread.send({
            type: MessageType.SYNC,
            data: {
                x, y, id
            },
        })
    }

    addMass(x: number, y: number, mass = TILE_SIZE) {
        this.thread.send({
            type: MessageType.ADD,
            data: {
                x, y, mass
            }
        });
    }
}
