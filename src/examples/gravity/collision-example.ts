import { PhysicsEngine } from "../../physics-engine/physics-engine";
import { RigidBodyFactory } from "../../rigid-bodies/factories/rigidbody-factory";
import { Vector } from "../../vectors/entities/vector";

const physicsEngine = new PhysicsEngine({ 
    canvas: 'gravity',
    enableGravity: false,
}); 

for(let i = 0; i < 100; i++) {
    const randomX = Math.random() * physicsEngine.world.canvasWidth;
    const randomY = Math.random() * physicsEngine.world.canvasHeight;
    const randomMass = 1;
    const randomRadius = 20;
    const randomSize = 20;
    const min = -10;
    const max = 10;
    const randomXVelocity = Math.random() * (max - min) + min;
    const randomYVelocity = 0;

    const circle = RigidBodyFactory.circle({
        position: new Vector(randomX, randomY),
        mass: randomMass,
        radius: randomRadius,
        velocity: new Vector(randomXVelocity, randomYVelocity)
    });

    physicsEngine.world.addObject(circle);
}



physicsEngine.world.run();
