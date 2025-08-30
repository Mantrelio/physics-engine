import { Circle } from "../../rigid-bodies/circle";
import { Vector } from "../../vectors/entities/vector";
import { World } from "../../world/world";

const world = new World(0, 'gravity');


for(let i = 0; i < 50; i++) {
    const randomX = Math.random() * world.canvasWidth;
    const randomY = Math.random() * world.canvasHeight;
    const randomMass = Math.random() * 5 + 1;
    const randomRadius = Math.random() * 3 + 5;
    const randomXVelocity = Math.random() * 2 + 1;
    const randomYVelocity = Math.random() * 2 + 1;

    const circle = new Circle(new Vector(randomX, randomY), randomRadius, randomMass, new Vector(randomXVelocity, randomYVelocity));
    world.addObject(circle);
}

world.run();
