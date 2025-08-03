import { Shape } from "../../rigid-bodies/enums/shape.enum"

export interface BaseRenderData {
    type: Shape;
    x: number;
    y: number;
}

export interface CircleRenderData extends BaseRenderData {
    radius: number;
}
