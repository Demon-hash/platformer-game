export type BiomTree = (setter: Function, x: number, y: number, lastCoords?: number, limit?: number) => number;

export type BiomData = {
    cover: number;
    dirt: number;
    radius: number;
    stone: number;
    trees: BiomTree[];
};

export interface BiomInstance {
    data(): BiomData;
}
