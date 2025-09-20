import { RigidBody } from "../rigid-bodies/abstracts/rigid-body";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";
import { CollisionData } from "./types/collision-data.type";

export class CollisionResolver {
    static execute(collisionData: CollisionData): void {
        const { objectA, objectB, penetrationDepth, collisionNormal, contactPoints } = collisionData;
        
        if(objectA.inverseMass === 0 && objectB.inverseMass === 0) return;
 
        this.resolveObjectPositions(objectA, objectB, penetrationDepth, collisionNormal);

        for (const contactPoint of contactPoints) {
            const objectACenterToContactPoint: Vector = VectorMath.subtract(contactPoint.position, objectA.position);
            const objectBCenterToContactPoint: Vector = VectorMath.subtract(contactPoint.position, objectB.position);

            const relativeVelocity: Vector = VectorMath.subtract(
                VectorMath.add(objectB.velocity, VectorMath.crossScalarVector(objectB.angularVelocity, objectBCenterToContactPoint)),
                VectorMath.add(objectA.velocity, VectorMath.crossScalarVector(objectA.angularVelocity, objectACenterToContactPoint))
            );

            const velocityAlongNormalScalar: number = VectorMath.dot(relativeVelocity, collisionNormal);
            if (velocityAlongNormalScalar > 0) continue;

            const restitution: number = 0.8;

            const torqueContributionA: number = VectorMath.cross(objectACenterToContactPoint, collisionNormal);
            const torqueContributionB: number = VectorMath.cross(objectBCenterToContactPoint, collisionNormal);

            const inverseMassSum: number = objectA.inverseMass + objectB.inverseMass + 
                (torqueContributionA * torqueContributionA) * objectA.inverseInertia +
                (torqueContributionB * torqueContributionB) * objectB.inverseInertia;

            const impulseScalar: number = -(1 + restitution) * velocityAlongNormalScalar / inverseMassSum / contactPoints.length;
            const impulseVector: Vector = VectorMath.multiply(collisionNormal, impulseScalar);

            this.resolveObjectVelocities(objectA, objectB, objectACenterToContactPoint, objectBCenterToContactPoint, impulseVector);

            const tangentVector: Vector = VectorMath.subtract(
                relativeVelocity,
                VectorMath.multiply(collisionNormal, velocityAlongNormalScalar)
            ).normalize();

            if (tangentVector.magnitude() > 1e-8) {
                const tangent: Vector = tangentVector.normalize();

                const frictionCoefficient: number = 0.5;
                const jt: number = -VectorMath.dot(relativeVelocity, tangent) / inverseMassSum / contactPoints.length;

                const normalImpulse: number = Math.abs(impulseScalar);
                const frictionImpulseScalar: number = Math.max(
                    -frictionCoefficient * normalImpulse,
                    Math.min(jt, frictionCoefficient * normalImpulse)
                );

                const frictionImpulse: Vector = VectorMath.multiply(tangent, frictionImpulseScalar);

                this.resolveObjectVelocities(objectA, objectB, objectACenterToContactPoint, objectBCenterToContactPoint, frictionImpulse);
            }
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
        objectB.position.add(VectorMath.multiply(correction, objectB.inverseMass));
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
