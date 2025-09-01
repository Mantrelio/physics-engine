import { RigidBody } from "../../rigid-bodies/abstracts/rigid-body.abstract";
import { Vector } from "../../vectors/entities/vector";
import { ContactPoint } from "./contact-point";

export type CollisionData = {
    collisionNormal: Vector;
    objectA: RigidBody;
    objectB: RigidBody;
    penetrationDepth: number;
    contactPoints: ContactPoint[];
}
