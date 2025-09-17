import { Vector } from "../../vectors/entities/vector";

export interface WorldOptions {
    canvas: HTMLCanvasElement | string; 
    gravity?: Vector;
    airDensity?: number;
    enableDrag?: boolean;
    enableGravity?:boolean;
    enableCollisions?: boolean;
    enableAABBVisualization?: boolean;
    enableCollisionGridVisualization?: boolean;
    fixedTimeStep?: number;
    maxPhysicsSteps?: number;
}

export interface WorldBounds {
    width: number;
    height: number;
    enableBoundaryCollisions?: boolean;
    restitution?: number;
}
