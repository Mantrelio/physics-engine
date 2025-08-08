import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Circle } from "../rigid-bodies/circle";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";

export class CollisionDetection {
    constructor(
        private readonly canvasWidth: number,
        private readonly canvasHeight: number
    ) {
    }

    public checkForCollision(worldObjects: RigidBody[]) {
        for(let i = 0; i < worldObjects.length - 1; i++) {
            for(let j = i + 1; j < worldObjects.length; j++) {
                if (this.areColliding(worldObjects[i], worldObjects[j])) {
                    this.resolveCollision(worldObjects[i], worldObjects[j]);
                }
            }
        }
    }

    private areColliding(object1: RigidBody, object2: RigidBody): boolean {
        if (object1 instanceof Circle && object2 instanceof Circle) {
            if (VectorMath.magnitude(VectorMath.subtract(object1.position, object2.position)) <= object1.radius + object2.radius) {
                return true;
            }

            return false;
        }
        
        return false;
    } 
    
    private resolveCollision(object1: RigidBody, object2: RigidBody): void {
        if (object1 instanceof Circle && object2 instanceof Circle) {
            const radii: number = object1.radius + object2.radius;
            const distanceVector: Vector = VectorMath.subtract(object1.position, object2.position);
            const peneteration: number = radii - VectorMath.magnitude(distanceVector);
            const correctionDistanceVector: Vector = VectorMath.multiply(VectorMath.normalize(distanceVector), peneteration / 2);

            object2.position = VectorMath.subtract(object2.position, correctionDistanceVector);
            object1.position = VectorMath.add(object1.position, correctionDistanceVector);

            const v1 = VectorMath.dot(object1.velocity, VectorMath.normalize(distanceVector));
            const v2 = VectorMath.dot(object2.velocity, VectorMath.normalize(distanceVector));

            object1.velocity = VectorMath.add(
                object1.velocity,
                VectorMath.multiply(VectorMath.normalize(distanceVector), v2 - v1)
            );
            object2.velocity = VectorMath.add(
                object2.velocity,
                VectorMath.multiply(VectorMath.normalize(distanceVector), v1 - v2)
            );
        }
    }
}
