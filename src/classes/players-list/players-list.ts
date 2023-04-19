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
        for (const [index, player] of this.players.entries()) {
            switch (index) {
                case camera.id:
                    camera.update({
                        x: player.coords.x,
                        y: player.coords.y,
                        ww: world.width,
                        wh: world.height
                    });
                    player.update();
                    player.draw(ctx, camera);
                    break;
                default:
                    if (camera.hasFocusAt({
                        x: player.coords.x,
                        y: player.coords.y,
                        w: player.borders.width,
                        h: player.borders.height
                    })) {
                        player.update();
                        player.draw(ctx, camera);
                    }
                    break;
            }
        }
    }
}
