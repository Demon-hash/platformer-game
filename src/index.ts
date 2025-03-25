import { Camera, Player, PlayersList, Screen, World, Level } from './classes';

const camera = new Camera();
const world = new World();
const list = new PlayersList();
const player = new Player();
const screen = new Screen();
const level = new Level(camera, world, list);

camera.attachTo(0);
player.attach(world);
list.add(player);
screen.setScene(level);
