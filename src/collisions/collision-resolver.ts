import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";
import { CollisionData } from "./types/collision-data.type";

export class CollisionResolver {
    static execute(collisionData: CollisionData): void {
        const { objectA, objectB, peneterationDepth: penetrationDepth, collisionNormal } = collisionData;

        const relativeVelocity: Vector = VectorMath.subtract(objectB.velocity, objectA.velocity);
        const velocityAlongNormalScalar: number = VectorMath.dot(relativeVelocity, collisionNormal);

        if (velocityAlongNormalScalar > 0) return;

        const restitution: number = 0.8;

        const inverseObjectAMass: number = 1 / objectA.mass;
        const inverseObjectBMass: number = 1 / objectB.mass; 

        const impulseScalar: number = -(1 + restitution) * velocityAlongNormalScalar / (inverseObjectAMass + inverseObjectBMass);
        const impulseVector: Vector = VectorMath.multiply(collisionNormal, impulseScalar);

        this.resolveObjectPositions(objectA, objectB, penetrationDepth, inverseObjectAMass, inverseObjectBMass, collisionNormal);
        this.resolveObjectVelocities(objectA, objectB, inverseObjectAMass, inverseObjectBMass, impulseVector);
    }
    
    private static resolveObjectPositions(
        objectA: RigidBody, 
        objectB: RigidBody, 
        penetrationDepth: number, 
        inverseObjectAMass: number, 
        inverseObjectBMass: number, 
        collisionNormal: Vector
    ): void {
        const percent = 0.8; 
        const slop = 0.01;

        const correctionMagnitude = Math.max(penetrationDepth - slop, 0) / (inverseObjectAMass + inverseObjectBMass) * percent;
        const correction = VectorMath.multiply(collisionNormal, correctionMagnitude);       

        objectA.position.subtract(VectorMath.multiply(correction, inverseObjectAMass));
        objectB.position.add(VectorMath.multiply(correction, inverseObjectBMass));
    }

    private static resolveObjectVelocities(
        objectA: RigidBody, 
        objectB: RigidBody,
        inverseObjectAMass: number,
        inverseObjectBMass: number,
        impulseVector: Vector
    ): void {
        objectA.velocity.subtract(VectorMath.multiply(impulseVector, inverseObjectAMass));
        objectB.velocity.add(VectorMath.multiply(impulseVector, inverseObjectBMass));
    }
}
