export interface ThreadArgs {
    minMass: number;
    maxMass: number;
    compression: number;
    speed: number;
    minFlow: number;
    width: number;
    height: number;
    masses: Float32Array;
    updated: Float32Array;
    tiles: Uint8Array;
}

export interface ThreadEvent {
    type: string;
    data?: unknown;
}
