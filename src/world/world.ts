import { CanvasRenderer } from "../renderer/canvas-renderer";
import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Vector } from "../vectors/entities/vector";

export class World {
    private objects: RigidBody[] = [];
    private renderer: CanvasRenderer;

    private readonly fixedTimeStep: number = 1/60;
    private accumulator: number = 0;
    private readonly physicsStepsLimit: number = 4;
    
    // FPS tracking
    private frameCount: number = 0;
    private lastFpsUpdate: number = 0;
    private currentFps: number = 0;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) throw new Error(`Canvas with id '${canvasId}' not found`);
        

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context from canvas');
        
        this.renderer = new CanvasRenderer(ctx);
    }

    public run(): void {
        let lastFrameTime = 0;
        
        const simulationLoop = (currentTime: number) => {
            if (lastFrameTime === 0) lastFrameTime = currentTime;

            const deltaTime = (currentTime - lastFrameTime) / 1000;
            lastFrameTime = currentTime;

            if(deltaTime > 0) this.fixedTimeStepUpdate(deltaTime);
            
            requestAnimationFrame(simulationLoop);
        }

        requestAnimationFrame(simulationLoop);
    }

    private fixedTimeStepUpdate(deltaTime: number) {
        this.accumulator += deltaTime;

        let physicsStepsCount: number = 0;

        while(this.accumulator >= this.fixedTimeStep && physicsStepsCount < this.physicsStepsLimit) {
            this.updatePhysics(this.fixedTimeStep);

            this.accumulator -= this.fixedTimeStep;
            physicsStepsCount++;
        }

        if (physicsStepsCount >= this.physicsStepsLimit) this.accumulator = 0;

        this.renderer.render(this.objects);
    }

    private updatePhysics(deltaTime: number) {
        this.objects.forEach(object => object.updatePosition(deltaTime));
    }

    public addObject(object: RigidBody): void {
        this.objects.push(object);
    }

    public applyGravity(): void {
        const g = new Vector(0, 9.8)
        this.objects.forEach(object => object.addAcceleration(g));
    }
}
