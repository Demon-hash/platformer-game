import type { Camera } from '@camera/camera.class';
import { Entity } from '@entity/entity.class';
import { Vec2 } from '@math/vec2';
import { Borders } from '@math/borders';
import { crop } from '@sprite/crop';
import { TILE_SIZE } from '@tile/tile.class';

import sprite from '@sprites/player.png';
import { KEYBOARD_CONFIG } from '@config/keyboard';

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
        void this.collision();

        if (this._isKeyPressed?.[KEYBOARD_CONFIG.right] || this._isKeyPressed?.[KEYBOARD_CONFIG.left]) {
            const right = +(this._isKeyPressed?.[KEYBOARD_CONFIG.right] ?? 0);
            const left = -(this._isKeyPressed?.[KEYBOARD_CONFIG.left] ?? 0);

            this.coords.y--;
            this.velocity.x = (right + left) * this.speed;
        }

        if (this._isKeyPressed?.[KEYBOARD_CONFIG.jump]) {
            this.velocity.y = -5;
        }

        this.coords.x += Math.floor(this.velocity.x);
        this.coords.y += Math.min(this.velocity.y, TILE_SIZE);
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        this.sprite.draw(ctx, this.frame, {
            x: Math.floor(this.coords.x - camera.x) - this.borders.width / 2 - this.velocity.x,
            y: Math.floor(this.coords.y - camera.y) - this.borders.height - this.velocity.y,
        });
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
