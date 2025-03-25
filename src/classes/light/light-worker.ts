import { MessageType } from '@liquid/types';
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
            setInterval(() => simulate(), 20);
            break;
        case MessageType.ADD:
            settings.light_s[getId(x, y)] = range;
            break;
        default:
            break;
    }
};

function simulate() {
    settings.light_h.fill(0);

    const coof = [0, 0, 0, 0];

    for (let h = 0; h < settings.height; h++) {
        for (let w = 0; w < settings.width; w++) {
            const delta = settings.light_s[getId(w, h)];

            if (delta <= 0) continue;

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
