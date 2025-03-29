import type { Scene } from '@scene/scene';
import { Camera } from '@camera/camera.class';
import { World } from '@world/world.class';
import { PlayersList } from '@players-list/players-list.class';

export class Level implements Scene {
    private static _instance?: Level;

    private readonly _camera: Camera;
    private readonly _world: World;
    private readonly _playersList: PlayersList;

    constructor() {
        if (Level._instance) {
            return Level._instance;
        }

        Level._instance = this;

        this._camera = new Camera();
        this._world = new World();
        this._playersList = new PlayersList();

        this._listenForMouseEvents();
    }

    draw(ctx: CanvasRenderingContext2D, delta: DOMHighResTimeStamp) {
        this._world.draw(ctx, this._camera);
        this._playersList.draw(this._camera, this._world, ctx, delta);
    }

    private _listenForMouseEvents() {
        window.addEventListener('click', this._onLeftClick.bind(this));
        window.addEventListener('contextmenu', this._onRightClick.bind(this));
    }

    private _onLeftClick(event: MouseEvent) {
        this._world.setTileId(event.x + this._camera.x, event.y + this._camera.y, 1);
        // this._world.createLightSource(event.x + this._camera.x, event.y + this._camera.y, 75);
        // this._world.addLiquid(event.x + this._camera.x, event.y + this._camera.y);
    }

    private _onRightClick(event: MouseEvent) {
        this._world.setTileId(event.x + this._camera.x, event.y + this._camera.y, 0);
    }
}
