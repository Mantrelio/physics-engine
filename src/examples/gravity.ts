import { PhysicsEngine } from "../physics-engine/physics-engine";
import { RigidBodyFactory } from "../rigid-bodies/factories/rigidbody-factory";
import { Vector } from "../vectors/entities/vector";

const physicsEngine = new PhysicsEngine({ 
    canvas: 'gravity',
}); 

for(let i = 0; i < 50; i++) {
    const randomX = Math.random() * physicsEngine.world.canvasWidth;
    const randomY = Math.random() * physicsEngine.world.canvasHeight;

    const circle = RigidBodyFactory.circle({
        position: [randomX, randomY],
        mass: 1,
        radius: 20,
    });

    physicsEngine.world.addObject(circle);
}



physicsEngine.world.run();
