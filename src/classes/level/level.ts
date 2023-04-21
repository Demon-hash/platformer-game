import {Scene} from "../scene";
import {World} from "../world";
import {Camera} from "../camera";
import {PlayersList} from "../players-list";

export class Level implements Scene {
    private readonly camera: Camera;
    private readonly world: World;
    private readonly players: PlayersList;

    constructor(camera: Camera, world: World, players: PlayersList) {
        this.camera = camera;
        this.world = world;
        this.players = players;

        window.addEventListener('click', (event: MouseEvent) => {
            this.world.setTileId(event.x + this.camera.x, event.y + this.camera.y, 1);
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.world.draw(ctx, this.camera);
        this.players.draw(this.camera, this.world, ctx);
    }
}
