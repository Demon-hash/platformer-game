import type { Player } from '@player/player.class';
import type { Camera } from '@camera/camera.class';
import type { World } from '@world/world.class';

export class PlayersList {
    private static _instance?: PlayersList;

    private _players: Player[] = [];

    constructor(players: Player[] = []) {
        if (PlayersList._instance) {
            return PlayersList._instance;
        }

        PlayersList._instance = this;

        if (players.length) {
            players.forEach(this.add.bind(this));
        }
    }

    add(player: Player) {
        player.id = this._players.length;
        this._players.push(player);
    }

    delete(id: number) {
        this._players = this._players.filter((player) => player.id !== id);
    }

    draw(camera: Camera, world: World, ctx: CanvasRenderingContext2D) {
        const target = camera.getAttachedId();
        for (const [index, player] of this._players.entries()) {
            switch (index) {
                case target:
                    camera.update(player.coords.x, player.coords.y, world.width, world.height);
                    player.update();
                    player.draw(ctx, camera);
                    break;
                default:
                    if (
                        camera.hasFocusAt(player.coords.x, player.coords.y, player.borders.width, player.borders.height)
                    ) {
                        player.update();
                        player.draw(ctx, camera);
                    }
                    break;
            }
        }
    }
}
