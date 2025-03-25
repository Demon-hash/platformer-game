import { type LiquidArgs, type LiquidDataInstance, MessageType } from './types';

let settings: LiquidArgs;

self.onmessage = ({
    data: {
        message: { type, data },
    },
}) => {
    const { x, y, mass } = data;

    switch (type as MessageType) {
        case MessageType.INIT:
            settings = data;
            setInterval(() => simulate(), 3.5);
            break;
        case MessageType.ADD:
            settings.updated[getId(x, y)] = mass;
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
    for (let id, x, y = startY; y < endY; y++) {
        for (x = startX; x < endX; x++) {
            id = getTileId(x, y);

            if (isCollidable(id)) {
                continue;
            }

            if (getMassValue(x, y) >= settings.minMass) {
                setTileId(x, y, 11);
            } else if (id === 11) {
                setTileId(x, y, 0);
                settings.updated[id] = 0;
            }
        }
    }
}

function update(startX: number, startY: number, endX: number, endY: number) {
    for (let x, y = startY; y < endY; y++) {
        for (x = startX; x < endX; x++) {
            if (settings.masses[getId(x, y)] <= 0) continue;

            let remainingMass = getMassValue(x, y);
            if (remainingMass <= 0) continue;

            remainingMass = vertical(x, y, 1, remainingMass);
            if (remainingMass <= 0) continue;

            remainingMass = horizontal(x, y, -1, remainingMass);
            if (remainingMass <= 0) continue;

            remainingMass = horizontal(x, y, 1, remainingMass);
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

function getInstanceProperty(id: number, key: keyof LiquidDataInstance) {
    return settings.instances[id][key];
}

function isCollidable(id: number): boolean {
    return !!getInstanceProperty(id, 'solid') || !!getInstanceProperty(id, 'vegetation');
}

function setTileId(x: number, y: number, id: number) {
    return (settings.tiles[getId(x, y)] = id);
}

function getMassValue(x: number, y: number): number {
    return settings.masses[getId(x, y)];
}

function updateMassValue(x: number, y: number, value: number) {
    const id = getId(x, y);
    if (settings.updated[id] + value < 0) {
        settings.updated[id] = 0;
    } else {
        settings.updated[id] += value;
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

function vertical(x: number, y: number, direction: number, remainMass: number) {
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
    updateMassValue(x, y, -flow);
    updateMassValue(x, y + direction, flow);

    return remainMass - flow;
}

function horizontal(x: number, y: number, direction: number, remainMass: number) {
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

    updateMassValue(x, y, -flow);
    updateMassValue(x + direction, y, flow);

    return remainMass - flow;
}
