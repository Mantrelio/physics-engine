import { Vector } from "../../vectors/entities/vector.js";

export interface ShapeConfig {
    position: [number, number];
    mass?: number;
    velocity?: Vector;
    angularVelocity?: number;
}

export interface CircleConfig extends ShapeConfig {
    radius: number;
}

export interface SquareConfig extends ShapeConfig {
    size: number;
}

export interface RectangleConfig extends ShapeConfig {
    width: number;
    height: number;
}
