import { Vector } from "../../vectors/entities/vector";
import { Shape } from "../enums/shape.enum";

export interface ShapeConstructorParameters {
    position: Vector;
    shape: Shape;
    inertia: number;
    mass?: number;
    velocity?: Vector;
    angularVelocity?: number;
}

export interface PolygonConstructorParameters {
    position: Vector;
    inertia: number;
    mass?: number;
    velocity?: Vector;
    angularVelocity?: number;
}
