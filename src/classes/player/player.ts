import {Entity, EntityRenderCycle} from "../entity";
import {Camera} from "../camera";
import {crop, Sprite} from "../sprite";
import {Tile, TILE_SIZE} from "../tile";
import {World} from "../world";

export class Player extends Entity implements EntityRenderCycle {
    private readonly tile = new Tile();

    public id: number;

    constructor() {
        super(240, 0);
        this.borders = {width: 73, height: 86};

        this.controls();

        this.sprite = new Sprite({
            src: 'https://s6.uupload.ir/files/images_byd7.png',
            x: this.coords.x,
            y: this.coords.y,
            crop: crop(this.borders.width, 0, this.borders.width, this.borders.height)
        })

        setInterval(() => {
            this.frame = (this.frame + 1) % 8
        }, 120);
    }

    attach(world: World) {
        this.world = world;
    }

    async collision() {
        if (!this.world) {
            return;
        }

        const rectangle = {
            horizontal: {
                x: Math.floor((this.coords.x + this.velocity.x) / TILE_SIZE),
                w: Math.floor(((this.coords.x + this.borders.width) + this.velocity.x) / TILE_SIZE),
                y: Math.floor(this.coords.y / TILE_SIZE),
                iterations: Math.ceil((this.borders.height + this.velocity.y) / TILE_SIZE),
            },
            vertical: {
                x: Math.floor(this.coords.x / TILE_SIZE),
                y: Math.floor((this.coords.y + this.borders.height) / TILE_SIZE),
                h: Math.floor((this.coords.y + this.velocity.y) / TILE_SIZE),
                iterations: Math.ceil((this.borders.width + this.velocity.x) / TILE_SIZE),
            }
        }

        for (let i = 0; i < rectangle.horizontal.iterations; i++) {
            rectangle.horizontal.y = Math.floor((this.coords.y + (i * TILE_SIZE)) / TILE_SIZE);
            if (this.tile.get(this.world.getTitleId(rectangle.horizontal.x, rectangle.horizontal.y), 'solid') || this.tile.get(this.world.getTitleId(rectangle.horizontal.w, rectangle.horizontal.y), 'solid')) {
                this.velocity.x = 0;
            }
        }

        for (let i = 0; i < rectangle.vertical.iterations; i++) {
            rectangle.vertical.x = Math.floor((this.coords.x + (i * TILE_SIZE)) / TILE_SIZE);
            if (this.tile.get(this.world.getTitleId(rectangle.vertical.x, rectangle.vertical.y), 'solid') || this.tile.get(this.world.getTitleId(rectangle.vertical.x, rectangle.vertical.h), 'solid')) {
                switch (Math.sign(this.velocity.y)) {
                    case -1:
                        this.velocity.y = this.gravity;
                        break;
                    case 1:
                        this.coords.y = (rectangle.vertical.y * TILE_SIZE) - (this.borders.height);
                        this.velocity.y = 0;
                        break;
                }
                return;
            }
        }

        this.velocity.y += this.gravity;
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
