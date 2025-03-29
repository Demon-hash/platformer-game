import type { World } from '@world/world.class';
import type { SpriteBorders } from '@sprite/types';
import type { EntityInstance, EntityLifeCycle } from '@entity/types';
import type { Camera } from '@camera/camera.class';
import type { Coords } from '@global-types';
import { Vec2 } from '@math/vec2';
import { Sprite } from '@sprite/sprite.class';
import { Tile, TILE_SIZE } from '@tile/tile.class';
import { Rectangle } from '@math/rectangle';

export class Entity implements EntityLifeCycle {
    private readonly _td = new Tile();

    protected world: World;
    protected sprite: Sprite;
    protected velocity: Coords;
    protected speed;
    protected gravity;
    protected frame;

    coords: Coords;
    borders: SpriteBorders;

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

    attach(world: World) {
        this.world = world;
    }

    update() {}

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {}

    async collision() {
        if (!this.world) {
            return;
        }

        const shape = new Rectangle(
            Math.floor(this.coords.x + this.velocity.x),
            Math.floor(this.coords.y - this.borders.height + this.velocity.y),
            this.borders.width,
            this.borders.height
        );

        this.velocity.y += this.gravity;

        this.velocity.x = this._isHorizontalCol(shape) ? 0 : this.velocity.x;
        this.velocity.y = this._isVerticalCol(shape) ? 0 : this.velocity.y;
    }

    private _isHorizontalCol(shape: Rectangle) {
        return this._isVerticalCol(shape, 1);
    }

    private _isVerticalCol(shape: Rectangle, yOffset = 0) {
        const normalize = (coords: number) => Math.floor(coords / TILE_SIZE);

        for (let i, x, y, w, h = 0; h < this.borders.height - yOffset; h++) {
            for (w = 0; w < this.borders.width; w++) {
                x = normalize(shape.left + w);
                y = normalize(shape.top + h);
                i = this.world.getTileId(x, y);

                if (!this._td.get(i, 'solid')) {
                    continue;
                }

                return true;
            }
        }

        return false;
    }
}
