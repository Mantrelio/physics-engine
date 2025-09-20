import { Shape } from "../../rigid-bodies/enums/shape.enum"
import { Vector } from "../../vectors/entities/vector";

export interface BaseShapeRenderData {
    type: Shape;
    x: number;
    y: number;
    color?: string;
}

export interface CircleRenderData extends BaseShapeRenderData {
    radius: number;
}

export interface PolygonRenderData extends BaseShapeRenderData {
    vertices: Vector[];
}

export interface AABBRenderData {
    x: number;
    y: number;
    halfWidth: number;
    halfHeight: number;
    color?: string;
}
