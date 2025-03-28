import type { PhysicsArgs } from '@physics/types';
import type { ThreadTileDataInstance } from '@thread/types';
import { ThreadMessageType } from '@thread/thread-msg-type';
import { TILE_SIZE } from '@tile/tile.class';
import { Rectangle } from '@math/rectangle';
import { PhysicsCalculated } from '@physics/physics.class';

let settings: PhysicsArgs;

type PhysicsCalculateRequest = PhysicsCalculated & {
    id: string;
    borders: Uint32Array;
};

self.onmessage = ({
    data: {
        message: { type, data },
    },
}) => {
    switch (type as ThreadMessageType) {
        case ThreadMessageType.INIT:
            settings = data;
            break;
        case ThreadMessageType.PHYSICS:
            calculate(data);
            break;
        default:
            break;
    }
};

function calculate({ id, coords, borders, velocity }: PhysicsCalculateRequest) {
    velocity[1] += 0.5;

    postMessage({ id, coords, velocity } satisfies PhysicsCalculated);

    // switch (Math.sign(this.velocity.y)) {
    //     case -1:
    //         // this.coords.y = this.velocity.x === 0 ? bk.down : this.coords.y;
    //         break;
    //     case 1:
    //         break;
    // }

    // this.coords.y = bk.top - (this.borders.height + 1);
    // this.coords.x = isRightCollision ? bk.left : bk.right;
    // this.coords.y = isTopCollision ? bk.down - 1 : bk.top - this.borders.height;
}

function getId(x: number, y: number): number {
    return Math.floor(y * settings.width + x);
}

function getInstanceProperty(id: number, key: keyof ThreadTileDataInstance) {
    if (id < 0 || id >= settings.instances.length) {
        return undefined;
    }

    return settings.instances?.[id]?.[key];
}
