export interface BiomTree {
    log: number;
    leaves: number;
}

export interface BiomData {
    cover: number;
    dirt: number;
    stone: number;
    tree: BiomTree[];
}
