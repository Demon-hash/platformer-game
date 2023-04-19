import {KeyboardConfig} from "../../config/keyboard";
import {Sprite, SpriteBorders} from "../sprite";
import {World} from "../world";
import {Coords} from "../../types";

export class Entity {
    protected world: World;

    protected sprite: Sprite;
    protected frame = 1;

    protected velocity: Coords;
    protected speed = 2;
    protected gravity = 0.5;

    public coords: Coords;
    public borders: SpriteBorders;

    constructor(x: number, y: number) {
        this.coords = {x, y};
        this.velocity = {x: 0, y: 0};
    }

    protected controls() {
        window.addEventListener("keypress", (event: KeyboardEvent) => {
            switch (event.key) {
                case KeyboardConfig.right:
                    this.velocity.x = this.speed;
                    break;
                case KeyboardConfig.left:
                    this.velocity.x = -this.speed;
                    break;
                case " ":
                    this.coords.y--;
                    this.velocity.y = -10;
                    break;
            }
        }, false);

        window.addEventListener("keyup", (event: KeyboardEvent) => {
            switch (event.key) {
                case KeyboardConfig.right:
                case KeyboardConfig.left:
                    this.velocity.x = 0;
                    break;
            }
        }, false);
    }
}
