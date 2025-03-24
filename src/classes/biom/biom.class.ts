import type { BiomData } from './types';
import { ChunkType } from '@chunk/types';
import { BeachBiom } from '@biom/types/beach-biom.class';
import { MeadowBiom } from '@biom/types/meadow-biom.class';
import { UnknownBiom } from '@biom/types/unknown-biom.class';

export class Biom {
    private static _instance?: Biom;

    private readonly _data: Record<ChunkType, BiomData> = {
        [ChunkType.UNINITIALIZED]: new UnknownBiom().data(),
        [ChunkType.MEADOW]: new MeadowBiom().data(),
        [ChunkType.BEACH]: new BeachBiom().data(),
    };

    constructor() {
        if (Biom._instance) {
            return Biom._instance;
        }

        Biom._instance = this;
    }

    data(type: ChunkType): BiomData {
        return this._data?.[type] ?? this._data[ChunkType.UNINITIALIZED];
    }
}
