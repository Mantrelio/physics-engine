export interface WorldOptions {
    canvas: HTMLCanvasElement | string; 
    airDensity?: number;
    enableDrag?: boolean;
    enableGravity?:boolean;
    enableAABBVisualization?: boolean;
    enableCollisionGridVisualization?: boolean;
}
