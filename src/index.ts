import {Camera, Player, PlayersList, Screen, World} from "./classes";

const world = new World();
const camera = new Camera();

const player = new Player();
player.attach(world);

const players = new PlayersList([player]);
new Screen({camera, world, players});
