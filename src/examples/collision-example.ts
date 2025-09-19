import { PhysicsEngine } from "../physics-engine/physics-engine";
import { RigidBodyFactory } from "../rigid-bodies/factories/rigidbody-factory";
import { Vector } from "../vectors/entities/vector";

const physicsEngine = new PhysicsEngine({ 
    canvas: 'gravity',
    enableGravity: false,
    enableAABBVisualization: true,
    enableCollisionGridVisualization: true
}); 

for(let i = 0; i < 500; i++) {
    const randomX = Math.random() * 6000;
    const randomY = Math.random() * 3000;
    const min = -10;
    const max = 10;
    const randomXVelocity = Math.random() * (max - min) + min;
    const randomYVelocity = 0;

    const circle = RigidBodyFactory.circle({
        position: [randomX, randomY],
        mass: 1,
        radius: 20,
        velocity: new Vector(randomXVelocity, randomYVelocity)
    });

    physicsEngine.addObject(circle);
}

physicsEngine.start();
