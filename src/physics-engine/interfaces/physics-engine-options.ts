import { Vector } from "../../vectors/entities/vector";

export interface WorldOptions {
    canvas: HTMLCanvasElement | string; 
    airDensity?: number;
    enableDrag?: boolean;
    enableGravity?:boolean;
    enableCollisions?: boolean;
    enableAABBVisualization?: boolean;
    enableCollisionGridVisualization?: boolean;
}
