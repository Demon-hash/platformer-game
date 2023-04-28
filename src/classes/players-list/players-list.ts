import {Player} from "../player";
import {Camera} from "../camera";
import {World} from "../world";

export class PlayersList {
    private players: Player[] = [];

    constructor(players: Player[] = []) {
        if (players.length) {
            players.forEach(this.add.bind(this))
        }
    }

    add(player: Player) {
        player.id = this.players.length;
        this.players.push(player);
    }

    delete(id: number) {
        this.players = this.players.filter((player) => player.id !== id);
    }

    draw(camera: Camera, world: World, ctx: CanvasRenderingContext2D) {
        const target = camera.getAttachedId();
        for (const [index, player] of this.players.entries()) {
            switch (index) {
                case target:
                    camera.update(
                        player.coords.x,
                        player.coords.y,
                        world.width,
                        world.height
                    );
                    player.update();
                    player.draw(ctx, camera);
                    break;
                default:
                    if (camera.hasFocusAt(
                        player.coords.x,
                        player.coords.y,
                        player.borders.width,
                        player.borders.height
                    )) {
                        player.update();
                        player.draw(ctx, camera);
                    }
                    break;
            }
        }
    }
}
