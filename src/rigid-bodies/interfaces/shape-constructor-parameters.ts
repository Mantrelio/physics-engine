import { Vector } from "../../vectors/entities/vector.js";
import { Shape } from "../enums/shape.enum.js";

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
