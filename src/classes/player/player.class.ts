import type { Camera } from '@camera/camera.class';
import { Entity } from '@entity/entity.class';
import { Vec2 } from '@math/vec2';
import { Borders } from '@math/borders';
import { crop } from '@sprite/crop';
import { TILE_SIZE } from '@tile/tile.class';

import sprite from '@sprites/player.png';
import { KEYBOARD_CONFIG } from '@config/keyboard';
import { Rectangle } from '@math/rectangle';

export class Player extends Entity {
    private readonly _isKeyPressed: Record<string, boolean> = {};

    id: number;

    constructor() {
        super({
            coords: new Vec2(240, 4096 - 87),
            borders: new Borders(32, 48),
            sprite: {
                src: sprite,
                crop: crop(0, 0, 32, 48),
            },
            misc: {
                gravity: 0.5,
                speed: 4,
            },
        });

        window.addEventListener('keypress', this._onMove.bind(this), false);
        window.addEventListener('keydown', this._onMove.bind(this), false);
        window.addEventListener('keyup', this._onStopMove.bind(this), false);

        setInterval(() => {
            this.frame = (this.frame + 1) % 8;
        }, 120);
    }

    update() {
        if (this._isKeyPressed?.[KEYBOARD_CONFIG.right] || this._isKeyPressed?.[KEYBOARD_CONFIG.left]) {
            const right = +(this._isKeyPressed?.[KEYBOARD_CONFIG.right] ?? 0);
            const left = -(this._isKeyPressed?.[KEYBOARD_CONFIG.left] ?? 0);

            this.velocity.x = (right + left) * this.speed;
        }

        if (this._isKeyPressed?.[KEYBOARD_CONFIG.jump]) {
            this.velocity.y = -5;
        }

        void this.collision();
        this.coords.x += Math.floor(this.velocity.x);
        this.coords.y += Math.min(this.velocity.y, TILE_SIZE - 1);
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        // const x = Math.floor(this.coords.x - camera.x) + this.velocity.x;
        // const y = Math.floor(this.coords.y - camera.y) - this.borders.height;
        //
        // this.sprite.draw(ctx, this.frame, { x, y });

        const shape = new Rectangle(
            Math.floor(this.coords.x + this.velocity.x - camera.x),
            Math.floor(this.coords.y - 1 - this.borders.height + this.velocity.y - camera.y),
            this.borders.width,
            this.borders.height
        );

        ctx.fillStyle = '#009900';
        ctx.fillRect(shape.left, shape.top, this.borders.width, this.borders.height);

        // ctx.fillStyle = '#ff9900';
        // ctx.fillRect(shape.left, shape.top, this.borders.width, 2);

        // ctx.fillStyle = '#ff5500';
        // ctx.fillRect(shape.left, shape.down - 2, this.borders.width, 2);
    }

    private _onMove(event: KeyboardEvent) {
        if (Object.values(KEYBOARD_CONFIG).includes(event.key)) {
            this._isKeyPressed[event.key] = true;
        }
    }

    private _onStopMove(event: KeyboardEvent) {
        if (Object.values(KEYBOARD_CONFIG).includes(event.key)) {
            this._isKeyPressed[event.key] = false;

            switch (event.key) {
                case KEYBOARD_CONFIG.right:
                case KEYBOARD_CONFIG.left:
                    this.velocity.x = 0;
                    break;
            }
        }
    }
}
