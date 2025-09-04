import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";
import { CollisionData } from "./types/collision-data.type";

export class CollisionResolver {
    static execute(collisionData: CollisionData): void {
        const { objectA, objectB, penetrationDepth, collisionNormal, contactPoints } = collisionData;
        for (const contactPoint of contactPoints) {
            const objectACenterToContactPoint: Vector = VectorMath.subtract(contactPoint.position, objectA.position);
            const objectBCenterToContactPoint: Vector = VectorMath.subtract(contactPoint.position, objectB.position);

            const relativeVelocity: Vector = VectorMath.subtract(
                VectorMath.add(objectB.velocity, VectorMath.crossScalarVector(objectB.angularVelocity, objectBCenterToContactPoint)),
                VectorMath.add(objectA.velocity, VectorMath.crossScalarVector(objectA.angularAcceleration, objectACenterToContactPoint))
            );

            const velocityAlongNormalScalar: number = VectorMath.dot(relativeVelocity, collisionNormal);
            if (velocityAlongNormalScalar > 0) return;

            const restitution: number = 0.8;

            const torqueContributionA: number = VectorMath.cross(objectACenterToContactPoint, collisionNormal);
            const torqueContributionB: number = VectorMath.cross(objectBCenterToContactPoint, collisionNormal);

            const inverseMassSum: number = objectA.inverseMass + objectB.inverseMass + 
                torqueContributionA * torqueContributionB * objectA.inverseInertia +
                torqueContributionA * torqueContributionB * objectB.inverseInertia;

            const impulseScalar: number = -(1 + restitution) * velocityAlongNormalScalar / inverseMassSum / contactPoints.length;
            const impulseVector: Vector = VectorMath.multiply(collisionNormal, impulseScalar);

            this.resolveObjectPositions(objectA, objectB, penetrationDepth, collisionNormal);
            this.resolveObjectVelocities(objectA, objectB, objectACenterToContactPoint, objectBCenterToContactPoint, impulseVector);
        }
    }
    
    private static resolveObjectPositions(
        objectA: RigidBody, 
        objectB: RigidBody, 
        penetrationDepth: number, 
        collisionNormal: Vector
    ): void {
        const percent: number = 0.8; 
        const slop: number = 0.01;

        const correctionMagnitude: number = Math.max(penetrationDepth - slop, 0) / (objectA.inverseMass + objectB.inverseMass) * percent;
        const correction: Vector = VectorMath.multiply(collisionNormal, correctionMagnitude);       

        objectA.position.subtract(VectorMath.multiply(correction, objectA.inverseMass));
        objectB.position.add(VectorMath.multiply(correction, objectA.inverseMass));
    }

    private static resolveObjectVelocities(
        objectA: RigidBody, 
        objectB: RigidBody,
        objectACenterToContactPoint: Vector,
        objectBCenterToContactPoint: Vector,
        impulseVector: Vector
    ): void {
        objectA.velocity.subtract(VectorMath.multiply(impulseVector, objectA.inverseMass));
        objectA.angularVelocity -= VectorMath.cross(objectACenterToContactPoint, impulseVector) * objectA.inverseInertia;

        objectB.velocity.add(VectorMath.multiply(impulseVector, objectB.inverseMass));
        objectB.angularVelocity += VectorMath.cross(objectBCenterToContactPoint, impulseVector) * objectB.inverseInertia;
    }
}
