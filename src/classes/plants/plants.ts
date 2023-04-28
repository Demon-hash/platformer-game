import { World } from '../world';
import { ChunkType } from '../chunk/types';

export class Plants {
    private readonly world: World;
    private lastCord = 0;

    constructor(world: World) {
        this.world = world;
    }

    private size() {
        return 5 + Math.round(Math.random() * 15);
    }

    private length() {
        return 10 + Math.round(Math.random() * 10);
    }

    private line(x: number, y: number, direction: number, id: number) {
        for (let i = -direction; i <= direction; i++) {
            this.world.setTileId(x + i, y, id, 1);
        }
    }

    private palm(x: number, y: number, size: number) {
        const log = 9;
        const leaves = 10;

        for (let s = 0; s < size; s++) {
            this.world.setTileId(x, y - s, log, 1);
        }

        this.line(x, y - size, 2, leaves);
        this.world.setTileId(x + 3, y - size + 1, leaves, 1);
        this.world.setTileId(x - 3, y - size + 1, leaves, 1);
        this.line(x, y - (size + 1), 1, leaves);
        this.line(x, y - (size + 2), 3, leaves);
        this.world.setTileId(x + 4, y - (size + 1), leaves, 1);
        this.world.setTileId(x - 4, y - (size + 1), leaves, 1);
        this.line(x, y - (size + 3), 1, leaves);
    }

    private mahogany(x: number, y: number, size: number) {
        const log = 4;
        const leaves = 5;

        for (let s = 0; s < size; s++) {
            this.world.setTileId(x, y - s, log, 1);
        }

        this.line(x, y - size, 5, leaves);
        this.line(x, y - (size + 1), 4, leaves);
        this.line(x, y - (size + 2), 3, leaves);
        this.line(x, y - (size + 3), 2, leaves);
    }

    tree(x: number, y: number, type: ChunkType) {
        if (x < this.lastCord) {
            return;
        }

        switch (type) {
            case ChunkType.BEACH:
                this.palm(x, y, this.size());
                break;
            default:
                this.mahogany(x, y, this.size());
                break;
        }

        this.lastCord += this.length();
    }
}
