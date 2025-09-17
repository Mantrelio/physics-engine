import { PhysicsEngine } from "../../physics-engine/physics-engine";
import { Circle } from "../../rigid-bodies/circle";
import { Polygon } from "../../rigid-bodies/polygon";
import { Square } from "../../rigid-bodies/square";
import { Vector } from "../../vectors/entities/vector";
import { World } from "../../world/world";

const physicsEngine = new PhysicsEngine({ 
    canvas: 'gravity' 
}); 

for(let i = 0; i < 2000; i++) {
    const randomX = Math.random() * physicsEngine.world.canvasWidth;
    const randomY = Math.random() * physicsEngine.world.canvasHeight;
    const randomMass = 1;
    const randomRadius = 50;
    const randomSize = 10;
    const min = -10;
    const max = 10;
    const randomXVelocity = Math.random() * (max - min) + min;
    const randomYVelocity = 0;

    const circle = new Circle(new Vector(randomX, randomY), randomSize, randomMass, new Vector(randomXVelocity, 0));
    physicsEngine.world.addObject(circle);
}



physicsEngine.world.run();
