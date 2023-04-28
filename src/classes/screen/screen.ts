import { CAMERA_HEIGHT, CAMERA_WIDTH } from '../camera';
import { Scene } from '../scene';

export const SCREEN_BACKGROUND_COLOR = 'rgb(145,175,173)';

export class Screen {
    public readonly ctx: CanvasRenderingContext2D;
    public readonly canvas: HTMLCanvasElement;

    private scene: Scene;

    constructor() {
        this.canvas = document.getElementById('screen') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.resize();
        this.redraw();
    }

    private resize() {
        this.canvas.width = CAMERA_WIDTH;
        this.canvas.height = CAMERA_HEIGHT;
    }

    private redraw() {
        window.requestAnimationFrame(this.redraw.bind(this));
        this.clear();
    }

    private clear(color = SCREEN_BACKGROUND_COLOR) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.scene) {
            this.scene.draw(this.ctx);
        }
    }

    setScene(scene: Scene) {
        this.scene = scene;
    }

    getScene(): Scene | undefined {
        return this.scene;
    }
}
