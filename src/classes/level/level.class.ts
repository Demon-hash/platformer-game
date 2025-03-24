import type { Scene } from '@scene/scene';
import type { Camera } from '@camera/camera.class';
import type { World } from '@world/world.class';
import type { PlayersList } from '@players-list/players-list.class';

export class Level implements Scene {
    private static _instance?: Level;

    private readonly _camera: Camera;
    private readonly _world: World;
    private readonly _players: PlayersList;

    constructor(camera: Camera, world: World, players: PlayersList) {
        if (Level._instance) {
            return Level._instance;
        }

        Level._instance = this;

        this._camera = camera;
        this._world = world;
        this._players = players;

        this._listenForMouseEvents();
    }

    draw(ctx: CanvasRenderingContext2D) {
        this._world.draw(ctx, this._camera);
        this._players.draw(this._camera, this._world, ctx);
    }

    private _listenForMouseEvents() {
        window.addEventListener('click', this._onLeftClick.bind(this));
        window.addEventListener('contextmenu', this._onRightClick.bind(this));
    }

    private _onLeftClick(event: MouseEvent) {
        this._world.addLiquid(event.x + this._camera.x, event.y + this._camera.y);
    }

    private _onRightClick(event: MouseEvent) {}
}
