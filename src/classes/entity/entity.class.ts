import type { World } from '@world/world.class';
import type { SpriteBorders } from '@sprite/types';
import type { EntityInstance, EntityLifeCycle } from '@entity/types';
import type { Camera } from '@camera/camera.class';
import type { Coords } from '@global-types';
import { Vec2 } from '@math/vec2';
import { Sprite } from '@sprite/sprite.class';
import { Tile, TILE_SIZE } from '@tile/tile.class';
import { KEYBOARD_CONFIG } from '@config/keyboard';

export class Entity implements EntityLifeCycle {
    private readonly _tile = new Tile();

    protected world: World;
    protected sprite: Sprite;
    protected velocity: Coords;
    protected speed;
    protected gravity;
    protected frame;

    public coords: Coords;
    public borders: SpriteBorders;

    constructor({ coords, borders, misc, sprite }: EntityInstance) {
        this.coords = coords;
        this.borders = borders;
        this.speed = misc.speed;
        this.gravity = misc.gravity;

        this.velocity = new Vec2();
        this.frame = 1;

        this.sprite = new Sprite({
            src: sprite.src,
            x: this.coords.x,
            y: this.coords.y,
            crop: sprite.crop,
        });
    }

    protected usesKeyboard() {
        window.addEventListener(
            'keypress',
            (event: KeyboardEvent) => {
                switch (event.key) {
                    case KEYBOARD_CONFIG.right:
                        this.velocity.x = this.speed;
                        break;
                    case KEYBOARD_CONFIG.left:
                        this.velocity.x = -this.speed;
                        break;
                    case ' ':
                        this.coords.y--;
                        this.velocity.y = -10;
                        break;
                }
            },
            false
        );

        window.addEventListener(
            'keyup',
            (event: KeyboardEvent) => {
                switch (event.key) {
                    case KEYBOARD_CONFIG.right:
                    case KEYBOARD_CONFIG.left:
                        this.velocity.x = 0;
                        break;
                }
            },
            false
        );
    }

    async collision() {
        if (!this.world) {
            return;
        }

        const rectangle = {
            horizontal: {
                x: Math.floor((this.coords.x + this.velocity.x) / TILE_SIZE),
                w: Math.floor((this.coords.x + this.borders.width + this.velocity.x) / TILE_SIZE),
                y: Math.floor(this.coords.y / TILE_SIZE),
                iterations: Math.ceil((this.borders.height + this.velocity.y) / TILE_SIZE),
            },
            vertical: {
                x: Math.floor(this.coords.x / TILE_SIZE),
                w: Math.floor((this.coords.x + this.borders.width + this.velocity.x) / TILE_SIZE),
                y: Math.floor((this.coords.y + this.borders.height) / TILE_SIZE),
                h: Math.floor((this.coords.y + this.velocity.y) / TILE_SIZE),
                iterations: Math.ceil((this.borders.width + this.velocity.x) / TILE_SIZE),
            },
        };

        for (let i = 0; i < rectangle.horizontal.iterations; i++) {
            if (
                this._tile.get(this.world.getTileId(rectangle.horizontal.x, rectangle.horizontal.y + i), 'solid') ||
                this._tile.get(this.world.getTileId(rectangle.horizontal.w, rectangle.horizontal.y + i), 'solid')
            ) {
                this.velocity.x = 0;
            }
        }

        for (let i = 0; i < rectangle.vertical.iterations; i++) {
            if (
                this._tile.get(this.world.getTileId(rectangle.vertical.x + i, rectangle.vertical.y), 'solid') ||
                this._tile.get(this.world.getTileId(rectangle.vertical.x + i, rectangle.vertical.h), 'solid') ||
                this._tile.get(this.world.getTileId(rectangle.vertical.w, rectangle.vertical.y), 'solid') ||
                this._tile.get(this.world.getTileId(rectangle.vertical.w, rectangle.vertical.h), 'solid')
            ) {
                switch (Math.sign(this.velocity.y)) {
                    case -1:
                        this.velocity.y = this.gravity;
                        break;
                    case 1:
                        this.coords.y = rectangle.vertical.y * TILE_SIZE - this.borders.height;
                        this.velocity.y = 0;
                        break;
                }
                return;
            }
        }

        this.velocity.y += this.gravity;
    }

    attach(world: World) {
        this.world = world;
    }

    update() {}

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {}
}
