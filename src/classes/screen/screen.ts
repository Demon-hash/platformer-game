import type { Scene } from '@scene/scene';
import { CAMERA_HEIGHT, CAMERA_WIDTH } from '@camera/camera';

export const SCREEN_BACKGROUND_COLOR = 'rgb(145,175,173)';

export class Screen {
    private static _instance?: Screen;

    private readonly _ctx: CanvasRenderingContext2D;
    private readonly _canvas: HTMLCanvasElement;

    private _scene: Scene;

    constructor() {
        if (Screen._instance) {
            return Screen._instance;
        }

        Screen._instance = this;

        this._canvas = document.getElementById('screen') as HTMLCanvasElement;
        this._ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D;

        this._resize();
        this._redraw();
    }

    private _resize() {
        this._canvas.width = CAMERA_WIDTH;
        this._canvas.height = CAMERA_HEIGHT;
    }

    private _redraw() {
        window.requestAnimationFrame(this._redraw.bind(this));
        this._clear();
    }

    private _clear(color = SCREEN_BACKGROUND_COLOR) {
        this._ctx.fillStyle = color;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

        if (this._scene) {
            this._scene.draw(this._ctx);
        }
    }

    setScene(scene: Scene) {
        this._scene = scene;
    }

    getScene(): Scene | undefined {
        return this._scene;
    }
}
