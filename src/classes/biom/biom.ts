import { ChunkType } from '../chunk/types';
import { BiomData, BiomTree } from './types';

export class Biom {
    normalizeRawTreeData(log: number, leaves: number): BiomTree {
        return { log, leaves };
    }

    normalizeRawData(cover: number, dirt: number, stone: number, tree: BiomTree[]): BiomData {
        return { cover, dirt, stone, tree };
    }

    data(type: ChunkType): BiomData {
        switch (type) {
            case ChunkType.BEACH:
                return this.normalizeRawData(6, 6, 6, [this.normalizeRawTreeData(9, 10)]);
            default:
                return this.normalizeRawData(1, 2, 3, [this.normalizeRawTreeData(4, 5)]);
        }
    }
}
