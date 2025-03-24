import type { BiomData, BiomInstance } from '@biom/types';
import { TileEnum } from '@resources/tile.enum';

export class UnknownBiom implements BiomInstance {
    private static _instance?: UnknownBiom;

    constructor() {
        if (UnknownBiom._instance) {
            return UnknownBiom._instance;
        }

        UnknownBiom._instance = this;
    }

    data(): BiomData {
        return {
            cover: TileEnum.SKY,
            dirt: TileEnum.SKY,
            stone: TileEnum.SKY,
            trees: [],
        };
    }
}
