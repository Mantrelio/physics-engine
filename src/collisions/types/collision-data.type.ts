import { RigidBody } from "../../rigid-bodies/abstracts/rigid-body.abstract";
import { Vector } from "../../vectors/entities/vector";

export type CollisionData = {
    collisionNormal: Vector;
    objectA: RigidBody;
    objectB: RigidBody;
    peneterationDepth: number;
    referenceBody: RigidBody;
}
