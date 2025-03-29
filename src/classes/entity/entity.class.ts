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

    update(delta: DOMHighResTimeStamp) {}

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

        const isVerticalCol = this._isCol(
            shape,
            (shape, bk) => shape.top <= bk.down || shape.down >= bk.top,
            this.velocity.x
        );

        const isHorizontalCol = this._isCol(
            shape,
            (shape, bk) => shape.right >= bk.left || shape.left <= bk.right,
            0,
            1
        );

        this.velocity.y += this.gravity;

        this.velocity.x = isHorizontalCol ? 0 : this.velocity.x;
        this.velocity.y = isVerticalCol ? 0 : this.velocity.y;
    }

    private _isCol(
        shape: Rectangle,
        comparator: (shape: Rectangle, block: Rectangle) => boolean,
        xOffset = 0,
        yOffset = 0
    ) {
        const normalize = (coords: number) => Math.floor(coords / TILE_SIZE);

        for (let x, y, w, h = 0; h < this.borders.height - yOffset; h++) {
            for (w = 0; w < this.borders.width; w++) {
                x = normalize(shape.left + w - xOffset);
                y = normalize(shape.top + h);

                if (!this._td.get(this.world.getTileId(x, y), 'solid')) {
                    continue;
                }

                if (comparator(shape, new Rectangle(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE))) {
                    return true;
                }
            }
        }

        return false;
    }
}
