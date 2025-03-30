import type { Scene } from '@scene/scene';
import { Camera, CAMERA_HEIGHT, CAMERA_WIDTH } from '@camera/camera.class';
import { Inventory } from '@inventory/inventory.class';
import { Cursor } from '@cursor/cursor.class';

export const SCREEN_BACKGROUND_COLOR = '#000';

const FPS_120 = 1000 / 120;

export class Screen {
    private static _instance?: Screen;

    private readonly _ctx: CanvasRenderingContext2D;
    private readonly _canvas: HTMLCanvasElement;

    private readonly _inventory: Inventory;
    private readonly _cursor: Cursor;

    private readonly _camera: Camera;

    private _scene: Scene;
    private _prevTime?: DOMHighResTimeStamp;

    constructor() {
        if (Screen._instance) {
            return Screen._instance;
        }

        Screen._instance = this;

        this._canvas = document.getElementById('screen') as HTMLCanvasElement;
        this._ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D;

        this._cursor = new Cursor(this._canvas);
        this._inventory = new Inventory();
        this._camera = new Camera();

        this._resize();
        this._redraw(0);
    }

    setScene(scene: Scene) {
        this._scene = scene;
    }

    getScene(): Scene | undefined {
        return this._scene;
    }

    private _resize() {
        this._canvas.width = CAMERA_WIDTH;
        this._canvas.height = CAMERA_HEIGHT;
    }

    private _redraw(now: DOMHighResTimeStamp) {
        window.requestAnimationFrame(this._redraw.bind(this));

        if (!this._prevTime) {
            this._prevTime = now;
        }

        const delta = now - this._prevTime;

        if (delta > FPS_120) {
            this._clear(delta);
            this._prevTime = now;
        }
    }

    private _clear(delta: DOMHighResTimeStamp) {
        this._ctx.fillStyle = SCREEN_BACKGROUND_COLOR;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

        if (this._scene) {
            this._scene.draw(this._ctx, delta);
            this._inventory.draw(this._ctx, this._camera);
            this._cursor.draw(this._ctx);
        }
    }
}
