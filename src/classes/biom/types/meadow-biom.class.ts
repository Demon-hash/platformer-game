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

        const size = 8 + Math.round(Math.random() * 5);
        const length = 18 + Math.round(Math.random() * 5);
        const leavesType = [
            TileEnum.MAHOGANY_LEAVES,
            TileEnum.MAHOGANY_LEAVES,
            TileEnum.MAHOGANY_LEAVES,
            TileEnum.LEMON_LEAVES,
            TileEnum.LIME_LEAVES,
            TileEnum.ORANGE_LEAVES,
            TileEnum.GRAPEFRUIT_LEAVES,
        ];

        const leaves = leavesType[Math.floor(Math.random() * leavesType.length)];

        const getLeaves = () => (Math.random() > 0.5 ? leaves : TileEnum.MAHOGANY_LEAVES);

        const line = (x: number, y: number, direction: number, material: () => number) => {
            for (let i = -direction; i <= direction; i++) {
                setter(x + i, y, material(), 1);
            }
        };

        const circle = (a: number, b: number, r: number, comp: (c: number, d: number) => number) => {
            const R = r * 2;
            for (let w, h = 0; h < R; h++) {
                for (w = 0; w < R; w++) {
                    const dx = r - w;
                    const dy = r - h;

                    const O = Math.pow(dx, 2) + Math.pow(dy, 2);

                    if (O <= R) {
                        setter(a + dx, b + dy, comp(a + dx, b + dy), 1);
                    }
                }
            }
        };

        line(x, y - (size - 1), 5, () => getLeaves());
        line(x, y - (size - 2), 5, () => getLeaves());
        line(x, y - (size - 3), 4, () => getLeaves());

        line(x, y - size, 5, () => getLeaves());
        line(x, y - (size + 1), 4, () => getLeaves());
        line(x, y - (size + 2), 3, () => getLeaves());
        line(x, y - (size + 3), 2, () => getLeaves());

        circle(x, y - (size + 5), 10, () => getLeaves());

        for (let s = 0; s < size + 4; s++) {
            setter(x, y - s, TileEnum.MAHOGANY_LOG, 1);
        }

        circle(x, y + 4, 5, () => (Math.random() > 0.6 ? TileEnum.MAHOGANY_LOG : TileEnum.DIRT));

        return length;
    };
}
