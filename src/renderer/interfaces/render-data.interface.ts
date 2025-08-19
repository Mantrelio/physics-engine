import { Shape } from "../../rigid-bodies/enums/shape.enum"

export interface BaseShapeRenderData {
    type: Shape;
    x: number;
    y: number;
    color: string;
}

export interface CircleRenderData extends BaseShapeRenderData {
    radius: number;
}

export interface AABBRenderData {
    x: number;
    y: number;
    halfWidth: number;
    halfHeight: number;
}
