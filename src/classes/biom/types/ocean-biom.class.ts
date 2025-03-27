import type { BiomData, BiomInstance, BiomTree } from '@biom/types';
import { TileEnum } from '@resources/tile.enum';

export class OceanBiom implements BiomInstance {
    private static _instance?: OceanBiom;

    constructor() {
        if (OceanBiom._instance) {
            return OceanBiom._instance;
        }

        OceanBiom._instance = this;
    }

    data(): BiomData {
        return {
            radius: 96,
            cover: TileEnum.WATER,
            dirt: TileEnum.WATER,
            stone: TileEnum.SAND,
            trees: [],
        };
    }
}
