import { Circle } from "../../rigid-bodies/circle";
import { Square } from "../../rigid-bodies/square";
import { Vector } from "../../vectors/entities/vector";
import { World } from "../../world/world";

const world = new World(1.225, true, true, true, true, 'gravity'); 


for(let i = 0; i < 1; i++) {
    const randomX = Math.random() * world.canvasWidth;
    const randomY = Math.random() * world.canvasHeight;
    const randomMass = 1;
    const randomRadius = Math.random() * 3 + 5;
    const randomXVelocity = Math.random() * 2 + 1;
    const randomYVelocity = Math.random() * 2 + 1;

    const square1 = new Square(60, randomMass, new Vector(randomX + 50,  2000), new Vector(0, 0));
    const square2 = new Square(60, randomMass, new Vector(randomX, world.canvasHeight), new Vector(0, 0));
    world.addObject(square1);
    world.addObject(square2)
}

world.run();
