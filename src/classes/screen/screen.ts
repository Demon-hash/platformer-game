import {Camera} from "../camera";
import {ScreenInstance} from "./types";
import {World} from "../world";
import {PlayersList} from "../players-list";

export const SCREEN_BACKGROUND_COLOR = "rgb(58,161,158)";

export class Screen {
    public readonly ctx: CanvasRenderingContext2D;
    public readonly canvas: HTMLCanvasElement;
    public readonly camera: Camera;
    public readonly world: World;
    public readonly players: PlayersList;

    constructor({camera, world, players}: ScreenInstance) {
        this.canvas = document.getElementById("screen") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.camera = camera;
        this.world = world;
        this.players = players;

        this.resize();
        this.redraw();
    }

    private resize() {
        if (this.canvas.width !== this.camera.w || this.canvas.height !== this.camera.h) {
            this.canvas.width = this.camera.w;
            this.canvas.height = this.camera.h;
        }
    }

    private redraw() {
        window.requestAnimationFrame(this.redraw.bind(this));
        this.clear();

        this.world.draw(this.ctx, this.camera);
        this.players.draw(this.camera, this.world, this.ctx);
    }

    private clear(color = SCREEN_BACKGROUND_COLOR) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
