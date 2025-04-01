import type { BiomData, BiomInstance, BiomTree } from '@biom/types';
import { TileEnum } from '@resources/tile.enum';

type Position = {
    edges: boolean;
    center: boolean;
    halfVertical: boolean;
    halfHorizontal: boolean;
    top: boolean;
};

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
            mud: TileEnum.MUD,
            stone: TileEnum.STONE,
            trees: [this._mahagony.bind(this), this._bamboo.bind(this)],
        };
    }

    private _bamboo: BiomTree = function (
        setter: Function,
        x: number,
        y: number,
        lastCoords = 0,
        limitEnd = Infinity,
        getter?: Function
    ): number {
        if (x < lastCoords || x > limitEnd) {
            return 0;
        }

        const length = 16;

        MeadowBiom._circle(
            x,
            y,
            32,
            (a, b) => {
                const tile = getter?.(a, b);

                const createBambo = () => {
                    const size = 10 + Math.round(Math.random() * 10);
                    for (let s = 0; s < size; s++) {
                        setter(a, b - s, TileEnum.BAMBOO, 1);
                    }

                    setter(a, b - size, TileEnum.BAMBOO_TOP, 1);
                    setter(a, b, TileEnum.SAND, 1);
                };

                switch (tile) {
                    case TileEnum.COVER:
                        createBambo();
                        return TileEnum.MUD_COVER;
                    case TileEnum.DIRT:
                        return TileEnum.MUD;
                    default:
                        return tile;
                }
            },
            setter
        );

        return length;
    };

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
        const length = 20 + Math.round(Math.random() * 5);
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

        line(x, y - (size - 1), 5, () => getLeaves());
        line(x, y - (size - 2), 5, () => getLeaves());
        line(x, y - (size - 3), 4, () => getLeaves());

        line(x, y - size, 5, () => getLeaves());
        line(x, y - (size + 1), 4, () => getLeaves());
        line(x, y - (size + 2), 3, () => getLeaves());
        line(x, y - (size + 3), 2, () => getLeaves());

        MeadowBiom._circle(x, y - (size + 5), 10, () => getLeaves(), setter);

        for (let s = 0; s < size + 4; s++) {
            setter(x, y - s, TileEnum.MAHOGANY_LOG, 1);
        }

        MeadowBiom._circle(x, y + 4, 5, () => (Math.random() > 0.6 ? TileEnum.MAHOGANY_LOG : TileEnum.DIRT), setter);
        return length;
    };

    private static _circle(
        x: number,
        y: number,
        r: number,
        comp: (x: number, y: number, p: Position) => number,
        setter: Function
    ) {
        const R = r * 2;
        for (let w, a = 0, h = 0; h < R; h++) {
            for (w = 0; w < R; w++) {
                const dx = r - w;
                const dy = r - h;

                const O = Math.pow(dx, 2) + Math.pow(dy, 2);

                if (O <= R) {
                    setter(
                        x + dx,
                        y + dy,
                        comp(x + dx, y + dy, {
                            edges: O >= R - r / 2,
                            center: O < R / 2,
                            halfVertical: dy < 1,
                            halfHorizontal: dx < 1,
                            top: dy <= -2,
                        }),
                        1
                    );
                }
            }
        }
    }
}
