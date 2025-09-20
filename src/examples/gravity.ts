import { PhysicsEngine } from "../physics-engine/physics-engine";
import { RigidBodyFactory } from "../rigid-bodies/factories/rigidbody-factory";
import { Vector } from "../vectors/entities/vector";

const physicsEngine = new PhysicsEngine({ 
    canvas: 'gravity',
}); 

for(let i = 0; i < 100; i++) {
    const randomX = Math.random() * 6000;
    const randomY = Math.random() * 3000;

    const circle = RigidBodyFactory.circle({
        position: [randomX, randomY],
        radius: 20,
        mass: 1
    });

    const square = RigidBodyFactory.square({
        position: [randomX, randomY],
        size: 20,
    });

    physicsEngine.addObject(square);
    physicsEngine.addObject(circle);
}

physicsEngine.start();
