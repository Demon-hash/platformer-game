import { type LiquidDataInstance, MessageType } from '@liquid/types';
import type { LightArgs } from './types';
import { TileEnum } from '@resources/tile.enum';

let settings: LightArgs;

const sources: number[][] = [];

self.onmessage = ({
    data: {
        message: { type, data },
    },
}) => {
    const { x, y, range } = data;

    switch (type as MessageType) {
        case MessageType.INIT:
            settings = data;
            setInterval(() => simulate(), 1);
            break;
        case MessageType.ADD:
            settings.light_s[getId(x, y)] = range;
            sources.push([getId(x, y), range]);

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

    // settings.light_s[getId(normalizedX + 32, normalizedY + 24)] = 25;

    for (let i = 0; i < sources.length; i++) {
        const [id, range] = sources[i];
        settings.light_s[id] = range;
    }

    const startX = Math.max(0, normalizedX - rangeX);
    const startY = Math.max(0, normalizedY - rangeY);
    const endX = Math.min(normalizedX + rangeX, settings.width);
    const endY = Math.min(normalizedY + rangeY, settings.height);

    settings.light_h.fill(0);

    const lumen = [0, 0, 0, 0];

    for (let w, h = startY; h < endY; h++) {
        for (w = startX; w < endX; w++) {
            if (w < 0 || w > settings.width || h < 0 || h > settings.height) {
                continue;
            }

            const ptr = settings.tiles;
            const delta = getInstanceProperty(ptr[getId(w, h)], 'solid') ? settings.light_s[getId(w, h)] : 75;

            if (delta <= 0) continue;

            lumen[0] = Number(!!ptr[getId(w - 1, h)]) * 8 + 1;
            lumen[1] = Number(!!ptr[getId(w + 1, h)]) * 8 + 1;
            lumen[2] = Number(!!ptr[getId(w, h - 1)]) * 8 + 1;
            lumen[3] = Number(!!ptr[getId(w, h + 1)]) * 8 + 1;

            if (settings.light_h[getId(w - 1, h)] < delta - lumen[0]) {
                settings.light_h[getId(w - 1, h)] = delta - lumen[0];
            }

            if (settings.light_h[getId(w + 1, h)] < delta - lumen[1]) {
                settings.light_h[getId(w + 1, h)] = delta - lumen[1];
            }

            if (settings.light_h[getId(w, h - 1)] < delta - lumen[2]) {
                settings.light_h[getId(w, h - 1)] = delta - lumen[2];
            }

            if (settings.light_h[getId(w, h + 1)] < delta - lumen[3]) {
                settings.light_h[getId(w, h + 1)] = delta - lumen[3];
            }
        }
    }

    settings.light_s.set(settings.light_h);
}

function getId(x: number, y: number): number {
    return Math.floor(y * settings.width + x);
}

function getInstanceProperty(id: number, key: keyof LiquidDataInstance) {
    if (id < 0 || id >= settings.instances.length) {
        return undefined;
    }

    return settings.instances?.[id]?.[key];
}

function circle(x: number, y: number, radius: number, delta: number) {
    for (let coof, w, h = 0; h < radius * 2; h++) {
        for (w = 0; w < radius * 2; w++) {
            const dx = radius - w;
            const dy = radius - h;

            if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(radius, 2)) {
                coof = Number(!!settings.tiles[getId(x + dx, y + dy)]);

                if (settings.light_h[getId(x + dx, y + dy)] < delta - coof) {
                    settings.light_h[getId(x + dx, y + dy)] = delta - coof;
                }
            }
        }
    }
}
