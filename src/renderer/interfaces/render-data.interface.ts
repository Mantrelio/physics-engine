import { Shape } from "../../rigid-bodies/enums/shape.enum"

export interface BaseRenderData {
    type: Shape;
    x: number;
    y: number;
    color: string;
}

export interface CircleRenderData extends BaseRenderData {
    radius: number;
}
