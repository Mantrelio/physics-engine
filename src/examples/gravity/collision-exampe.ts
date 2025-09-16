import { Circle } from "../../rigid-bodies/circle";
import { Polygon } from "../../rigid-bodies/polygon";
import { Square } from "../../rigid-bodies/square";
import { Vector } from "../../vectors/entities/vector";
import { World } from "../../world/world";

const world = new World(1.225, true, true, false, false, 'gravity'); 

for(let i = 0; i < 100; i++) {
    const randomX = Math.random() * world.canvasWidth;
    const randomY = Math.random() * world.canvasHeight;
    const randomMass = Math.random() * 5;
    const randomRadius = 50;
    const randomSize = Math.random() * 70 + 50;
    const min = -10;
    const max = 10;
    const randomXVelocity = Math.random() * (max - min) + min;
    const randomYVelocity = 0;

    const circle = new Circle(new Vector(randomX, randomY), randomSize, randomMass, new Vector(randomXVelocity, 0));
    world.addObject(circle);
}



world.run();
