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
    private readonly _tile = new Tile();

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

        const nm = (coords: number) => Math.floor(coords / TILE_SIZE);

        const wb = this.borders.width / 2;

        for (let w, h = 0; h < this.borders.height; h++) {
            for (w = -wb; w < wb; w++) {
                const x = nm(this.coords.x + w);
                const y = nm(this.coords.y - h);
                const id = this.world.getTileId(x, y);

                if (!this._tile.get(id, 'solid')) {
                    continue;
                }

                const bk = new Rectangle(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                const sf = new Rectangle(
                    this.coords.x - wb + this.velocity.x,
                    this.coords.y - this.borders.height + this.velocity.y,
                    wb + this.velocity.x,
                    this.borders.height + this.velocity.y
                );

                const isRightCollision = sf.right >= bk.left;
                const isLeftCollision = sf.left >= bk.right;

                const isTopCollision = sf.top >= bk.down;
                const isBottomCollision = sf.down >= bk.top; // Bottom collision

                if (!isTopCollision && !isBottomCollision && !isRightCollision && !isLeftCollision) {
                    continue;
                }

                if (isRightCollision || isLeftCollision) {
                    this.velocity.x = 0;
                }

                if (isTopCollision || isBottomCollision) {
                    this.coords.y = this.velocity.x === 0 ? (isBottomCollision ? bk.top : bk.down) : this.coords.y;
                    this.velocity.y = 0;
                }

                // this.coords.y = this.velocity.x === 0 ? bk.down - margin : this.coords.y;
                // if (bk.top - sf.down != -48) {
                // }

                // switch (Math.sign(this.velocity.y)) {
                //     case -1:
                //         this.velocity.y = this.gravity;
                //         return;
                //     case 1:
                //         this.coords.y = bk.top;
                //         this.velocity.y = 0;
                //         return;
                // }

                return;
            }
        }

        this.velocity.y += this.gravity;
    }
}
