import { Sprite } from '@sprite/sprite.class';

import cursor from '@sprites/cursor.png';

export class Cursor {
    private static _instance?: Cursor;

    private readonly cursor = {
        x: 0,
        y: 0,
        sprite: new Sprite({
            src: cursor,
            x: 0,
            y: 0,
        }),
    };

    constructor(canvas?: HTMLCanvasElement) {
        if (Cursor._instance) {
            return Cursor._instance;
        }

        Cursor._instance = this;
        this._listenForMouseMove(canvas);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.cursor.sprite.draw(ctx, 0, { x: this.cursor.x, y: this.cursor.y });
    }

    private _listenForMouseMove(canvas?: HTMLCanvasElement) {
        canvas?.addEventListener(
            'mousemove',
            (event) => ([this.cursor.x, this.cursor.y = event.y] = [event.x - 16, event.y])
        );
    }

    get coords() {
        return { x: this.cursor.x, y: this.cursor.y };
    }
}
