import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Circle } from "../rigid-bodies/circle";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";

export class CollisionResolver {
    private readonly CollisionResolutionHandles: Record<string, (rigidBodyA: RigidBody, rigidBodyB: RigidBody) => void> = {
        "circle-circle": (rigidBodyA, rigidBodyB) => CollisionResolver.resolveCircleCircleCollision(rigidBodyA as Circle, rigidBodyB as Circle),
    }

    static resolveCircleCircleCollision(circleA: Circle, circleB: Circle): void {
        const radii: number = circleA.radius + circleB.radius;
        const distanceVector: Vector = VectorMath.subtract(circleA.position, circleB.position);
        const peneteration: number = radii - VectorMath.magnitude(distanceVector);
        const correctionDistanceVector: Vector = VectorMath.multiply(VectorMath.normalize(distanceVector), peneteration / 2);

        circleB.position.subtract(correctionDistanceVector);
        circleA.position.add(correctionDistanceVector);

        const v1 = VectorMath.dot(circleA.velocity, VectorMath.normalize(distanceVector));
        const v2 = VectorMath.dot(circleB.velocity, VectorMath.normalize(distanceVector));

        circleA.velocity.add(VectorMath.multiply(VectorMath.normalize(distanceVector), v2 - v1));
        circleB.velocity.add(VectorMath.multiply(VectorMath.normalize(distanceVector), v1 - v2)); 
    }
}
