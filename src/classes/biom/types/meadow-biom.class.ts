import type { BiomData, BiomInstance, BiomTree } from '@biom/types';
import { TileEnum } from '@resources/tile.enum';

export class MeadowBiom implements BiomInstance {
    private static _instance?: MeadowBiom;

    constructor() {
        if (MeadowBiom._instance) {
            return MeadowBiom._instance;
        }

        MeadowBiom._instance = this;
    }

    data(): BiomData {
        return {
            radius: 30,
            cover: TileEnum.COVER,
            dirt: TileEnum.DIRT,
            stone: TileEnum.STONE,
            trees: [this._mahagony.bind(this)],
        };
    }

    private _mahagony: BiomTree = function (
        setter: Function,
        x: number,
        y: number,
        lastCoords = 0,
        limitEnd = Infinity
    ): number {
        if (x < lastCoords || x > limitEnd) {
            return 0;
        }

        const size = 5 + Math.round(Math.random() * 15);
        const length = 10 + Math.round(Math.random() * 10);

        const line = (x: number, y: number, direction: number, id: number) => {
            for (let i = -direction; i <= direction; i++) {
                setter(x + i, y, id, 1);
            }
        };

        for (let s = 0; s < size; s++) {
            setter(x, y - s, TileEnum.MAHOGANY_LOG, 1);
        }

        line(x, y - size, 5, TileEnum.MAHOGANY_LEAVES);
        line(x, y - (size + 1), 4, TileEnum.MAHOGANY_LEAVES);
        line(x, y - (size + 2), 3, TileEnum.MAHOGANY_LEAVES);
        line(x, y - (size + 3), 2, TileEnum.MAHOGANY_LEAVES);

        return length;
    };
}
