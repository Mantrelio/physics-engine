import { Vector } from "../../vectors/entities/vector";

export interface ShapeConfig {
    position: Vector;
    mass?: number;
    velocity?: Vector;
    angularVelocity?: number;
}

export interface CircleConfig extends ShapeConfig {
    radius: number;
}

export interface PolygonConfig extends ShapeConfig {
    sideCount: number;
    size: number;
}
