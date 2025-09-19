import { Vector } from "../../vectors/entities/vector";
import { Shape } from "../enums/shape.enum";

export interface ShapeConstructorOptions {
    position: Vector;
    shape: Shape;
    inertia: number;
    mass?: number;
    velocity?: Vector;
    angularVelocity?: number;
}
