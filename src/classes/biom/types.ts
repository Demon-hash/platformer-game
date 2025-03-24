import type { World } from '@world/world';

export type BiomTree = (world: World, x: number, y: number, lastCoords?: number) => number;

export type BiomData = {
    cover: number;
    dirt: number;
    stone: number;
    trees: BiomTree[];
};

export interface BiomInstance {
    data(): BiomData;
}
