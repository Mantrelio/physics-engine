import { RigidBody } from "../../rigid-bodies/abstracts/rigid-body.abstract";
import { Vector } from "../../vectors/entities/vector";
import { Edge } from "./edge.type";

export type CollisionData = {
    collisionNormal: Vector;
    referenceBody: RigidBody;
    incidentBody: RigidBody;
    peneterationDepth: number;
    referenceEdge?: Edge;
}
