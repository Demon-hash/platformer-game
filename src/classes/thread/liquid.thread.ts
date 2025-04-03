import { LiquidArgs, LiquidKind } from '@liquid/types';
import type { ThreadTileDataInstance } from '@thread/types';
import { TileEnum } from '@resources/tile.enum';
import { ThreadMessageType } from '@thread/thread-msg-type';

let settings: LiquidArgs;

self.onmessage = ({
    data: {
        message: { type, data },
    },
}) => {
    const { x, y, mass, kind } = data;

    switch (type as ThreadMessageType) {
        case ThreadMessageType.INIT:
            settings = data;
            setInterval(() => simulate(), 1);
            break;
        case ThreadMessageType.ADD:
            settings.updated[getId(x, y)] = mass;
            settings.kind[getId(x, y)] = kind;
            break;
        default:
            break;
    }
};

function simulate() {
    const [cameraX, cameraY] = settings.coords;

    const rangeX = 96;
    const rangeY = 64;

    const normalizedX = Math.floor(cameraX / 16);
    const normalizedY = Math.floor(cameraY / 16);

    const startX = Math.max(0, normalizedX - rangeX);
    const startY = Math.max(0, normalizedY - rangeY);
    const endX = Math.min(normalizedX + rangeX, settings.width);
    const endY = Math.min(normalizedY + rangeY, settings.height);

    update(startX, startY, endX, endY);
    copyMasses();
    setWaterByMass(startX, startY, endX, endY);
}

function copyMasses() {
    settings.masses.set(settings.updated);
}

function setWaterByMass(startX: number, startY: number, endX: number, endY: number) {
    for (let kind, id, x, y = startY; y < endY; y++) {
        for (x = startX; x < endX; x++) {
            id = getTileId(x, y);
            kind = getKind(x, y);

            if (isCollidable(id, kind)) {
                continue;
            }

            if (getMassValue(x, y) >= settings.minMass) {
                switch (id) {
                    case TileEnum.WATER:
                        setTileId(x, y, kind === TileEnum.LAVA ? TileEnum.MUD : id);
                        break;
                    case TileEnum.LAVA:
                        setTileId(x, y, kind === TileEnum.WATER ? TileEnum.STONE : id);
                        break;
                    default:
                        setTileId(x, y, kind);
                        break;
                }
            } else {
                setTileId(x, y, 0);
                settings.updated[id] = 0;
                settings.kind[id] = LiquidKind.UNKNOWN;
            }
        }
    }
}

function update(startX: number, startY: number, endX: number, endY: number) {
    for (let remainingMass, x, y = startY; y < endY; y++) {
        for (x = startX; x < endX; x++) {
            if (settings.masses[getId(x, y)] <= 0) continue;

            remainingMass = getMassValue(x, y);
            if (remainingMass <= 0) continue;

            remainingMass = vertical(x, y, 1, remainingMass, settings.kind[getId(x, y)]);
            if (remainingMass <= 0) continue;

            remainingMass = horizontal(x, y, -1, remainingMass, settings.kind[getId(x, y)]);
            if (remainingMass <= 0) continue;

            remainingMass = horizontal(x, y, 1, remainingMass, settings.kind[getId(x, y)]);
        }
    }
}

function clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
}

function getId(x: number, y: number): number {
    return Math.floor(y * settings.width + x);
}

function getTileId(x: number, y: number) {
    if (x < 0 || x >= settings.width || y < 0 || y >= settings.height) {
        return 0;
    }

    return settings.tiles[getId(x, y)];
}

function getInstanceProperty(id: number, key: keyof ThreadTileDataInstance) {
    return settings.instances[id][key];
}

function isCollidable(id: number, kind = TileEnum.WATER): boolean {
    return !!getInstanceProperty(id, 'solid') || !!getInstanceProperty(id, 'vegetation');
}

function setTileId(x: number, y: number, id: number) {
    settings.tiles[getId(x, y)] = id;
}

function getMassValue(x: number, y: number): number {
    return settings.masses[getId(x, y)];
}

function getKind(x: number, y: number) {
    switch (settings.kind[getId(x, y)]) {
        case LiquidKind.WATER:
            return TileEnum.WATER;
        case LiquidKind.LAVA:
            return TileEnum.LAVA;
        default:
            return TileEnum.SKY;
    }
}

function updateMassValue(x: number, y: number, value: number, kind: LiquidKind) {
    const id = getId(x, y);
    if (settings.updated[id] + value < 0) {
        settings.updated[id] = 0;
        settings.kind[id] = LiquidKind.UNKNOWN;
    } else {
        //  if ([LiquidKind.UNKNOWN, kind].includes(settings.kind[id]))
        settings.updated[id] += value;
        settings.kind[id] = kind;
    }
}

function getFlowAmount(total: number) {
    if (total <= 1) {
        return 1;
    }

    if (total < 2 * settings.maxMass + settings.compression) {
        const doubleMass = Math.pow(settings.maxMass, 2);
        return (doubleMass + total * settings.compression) / (settings.maxMass + settings.compression);
    } else {
        return (total + settings.compression) / 2;
    }
}

function vertical(x: number, y: number, direction: number, remainMass: number, kind: LiquidKind) {
    if (isCollidable(getTileId(x, y + direction))) {
        return remainMass;
    }

    const neighborMass = getMassValue(x, y + direction);

    let flow =
        direction === 1
            ? getFlowAmount(remainMass + neighborMass) - neighborMass
            : getFlowAmount(remainMass + neighborMass);

    if (flow > settings.minFlow) {
        flow *= 0.5;
    }

    flow = clamp(flow, 0, Math.min(settings.speed, remainMass));
    updateMassValue(x, y, -flow, kind);
    updateMassValue(x, y + direction, flow, kind);

    return remainMass - flow;
}

function horizontal(x: number, y: number, direction: number, remainMass: number, kind: LiquidKind) {
    if (isCollidable(getTileId(x + direction, y))) {
        return remainMass;
    }

    const mass = getMassValue(x, y);
    const neighborMass = getMassValue(x + direction, y);

    let flow = (mass - neighborMass) / 4;
    if (flow > settings.minFlow) {
        flow *= 0.5;
    }

    flow = clamp(flow, 0, remainMass);

    updateMassValue(x, y, -flow, kind);
    updateMassValue(x + direction, y, flow, kind);

    return remainMass - flow;
}
