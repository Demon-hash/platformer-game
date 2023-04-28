import { crop } from '../sprite';
import { TILE_SIZE } from '../tile';
import { Entity } from '../entity';
import { Camera } from '../camera';
import { Borders, Vec2 } from '../math';

export class Player extends Entity {
    public id: number;

    constructor() {
        super({
            coords: new Vec2(240, 4096 - 87),
            borders: new Borders(73, 86),
            sprite: {
                src: 'https://s6.uupload.ir/files/images_byd7.png',
                crop: crop(73, 0, 73, 86),
            },
            misc: {
                gravity: 0.5,
                speed: 10,
            },
        });

        this.useKeyboard();

        setInterval(() => {
            this.frame = (this.frame + 1) % 8;
        }, 120);
    }

    update() {
        void this.collision();

        this.coords.x += Math.floor(this.velocity.x);
        this.coords.y += Math.min(this.velocity.y, TILE_SIZE);
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        this.sprite.draw(ctx, this.frame, Math.floor(this.coords.x - camera.x), Math.floor(this.coords.y - camera.y));
    }
}
