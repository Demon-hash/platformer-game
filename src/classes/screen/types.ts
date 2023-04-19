import {Camera} from "../camera";
import {World} from "../world";
import {PlayersList} from "../players-list";

export interface ScreenInstance {
    camera: Camera;
    world: World;
    players: PlayersList;
}
