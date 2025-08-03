import { CanvasRenderer } from "../renderer/canvas-renderer";
import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Vector } from "../vectors/entities/vector";

export class World {
    private objects: RigidBody[] = [];
    private renderer: CanvasRenderer;

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

            if(deltaTime > 0) this.update(deltaTime);
            
            requestAnimationFrame(simulationLoop);
        }

        requestAnimationFrame(simulationLoop);

    }

    //TODO: seperate physics engine and renderer run time, physics should run at a higher frequency
    private update(deltaTime: number): void {
        if (deltaTime < 0.001 || deltaTime > 0.1) return;

        this.objects.forEach(object => object.updatePosition(deltaTime));
        this.renderer.render(this.objects);
    }

    public addObject(object: RigidBody): void {
        this.objects.push(object);
    }

    public applyGravity(): void {
        const g = new Vector(0, 980)
        this.objects.forEach(object => object.addAcceleration(g));
    }
}
