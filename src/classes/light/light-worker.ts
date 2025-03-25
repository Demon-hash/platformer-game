import { type LiquidDataInstance, MessageType } from '@liquid/types';
import type { LightArgs } from './types';

let settings: LightArgs;

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

    for (let i = 0; i < 8400; i++) {
        settings.light_s[getId(i * 16, 300)] = 150;
    }

    const startX = Math.max(0, normalizedX - rangeX);
    const startY = Math.max(0, normalizedY - rangeY);
    const endX = Math.min(normalizedX + rangeX, settings.width);
    const endY = Math.min(normalizedY + rangeY, settings.height);

    settings.light_h.fill(0);

    const coof = [0, 0, 0, 0];

    for (let w, h = startY; h < endY; h++) {
        for (w = startX; w < endX; w++) {
            if (w < 0 || w > settings.width || h < 0 || h > settings.height) {
                continue;
            }

            const delta = settings.light_s[getId(w, h)];

            if (delta <= 0) continue;

            // coof[0] = Number(!getInstanceProperty(getId(w - 1, h), 'solid')) * 8 + 1;
            // coof[1] = Number(!getInstanceProperty(getId(w + 1, h), 'solid')) * 8 + 1;
            // coof[2] = Number(!getInstanceProperty(getId(w, h - 1), 'solid')) * 8 + 1;
            // coof[3] = Number(!getInstanceProperty(getId(w, h + 1), 'solid')) * 8 + 1;

            coof[0] = Number(!!settings.tiles[getId(w - 1, h)]) * 8 + 1;
            coof[1] = Number(!!settings.tiles[getId(w + 1, h)]) * 8 + 1;
            coof[2] = Number(!!settings.tiles[getId(w, h - 1)]) * 8 + 1;
            coof[3] = Number(!!settings.tiles[getId(w, h + 1)]) * 8 + 1;

            if (settings.light_h[getId(w - 1, h)] < delta - coof[0]) {
                settings.light_h[getId(w - 1, h)] = delta - coof[0];
            }

            if (settings.light_h[getId(w + 1, h)] < delta - coof[1]) {
                settings.light_h[getId(w + 1, h)] = delta - coof[1];
            }

            if (settings.light_h[getId(w, h - 1)] < delta - coof[2]) {
                settings.light_h[getId(w, h - 1)] = delta - coof[2];
            }

            if (settings.light_h[getId(w, h + 1)] < delta - coof[3]) {
                settings.light_h[getId(w, h + 1)] = delta - coof[3];
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
