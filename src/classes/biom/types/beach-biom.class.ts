import type { BiomData, BiomInstance, BiomTree } from '@biom/types';
import type { World } from '@world/world.class';
import { TileEnum } from '@resources/tile.enum';

export class BeachBiom implements BiomInstance {
    private static _instance?: BeachBiom;

    constructor() {
        if (BeachBiom._instance) {
            return BeachBiom._instance;
        }

        BeachBiom._instance = this;
    }

    data(): BiomData {
        return {
            cover: TileEnum.SAND,
            dirt: TileEnum.SAND,
            stone: TileEnum.SANDSTONE,
            trees: [this._palm.bind(this)],
        };
    }

    private _palm: BiomTree = function (world: World, x: number, y: number, lastCoords = 0): number {
        if (x < lastCoords) {
            return lastCoords;
        }

        const size = 5 + Math.round(Math.random() * 15);
        const length = 10 + Math.round(Math.random() * 10);

        const line = (x: number, y: number, direction: number, id: number) => {
            for (let i = -direction; i <= direction; i++) {
                world.setTileId(x + i, y, id, 1);
            }
        };

        for (let s = 0; s < size; s++) {
            world.setTileId(x, y - s, TileEnum.PALM_LOG, 1);
        }

        line(x, y - size, 2, TileEnum.PALM_LEAVES);
        line(x, y - (size + 1), 1, TileEnum.PALM_LEAVES);

        world.setTileId(x + 3, y - size + 1, TileEnum.PALM_LEAVES, 1);
        world.setTileId(x - 3, y - size + 1, TileEnum.PALM_LEAVES, 1);

        line(x, y - (size + 2), 3, TileEnum.PALM_LEAVES);
        line(x, y - (size + 3), 1, TileEnum.PALM_LEAVES);

        world.setTileId(x + 4, y - (size + 1), TileEnum.PALM_LEAVES, 1);
        world.setTileId(x - 4, y - (size + 1), TileEnum.PALM_LEAVES, 1);

        return lastCoords + length;
    };
}
