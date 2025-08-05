import { CanvasRenderer } from "../renderer/canvas-renderer";
import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Circle } from "../rigid-bodies/circle";
import { Shape } from "../rigid-bodies/enums/shape.enum";
import { Vector } from "../vectors/entities/vector";

export class World {
    private objects: RigidBody[] = [];
    private renderer: CanvasRenderer;
    public readonly canvasWidth: number;
    public readonly canvasHeight: number;

    private readonly fixedTimeStep: number = 1/60;
    private accumulator: number = 0;
    private readonly physicsStepsLimit: number = 4;

    constructor(
        canvasId: string,
    ) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) throw new Error(`Canvas with id '${canvasId}' not found`);
        

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context from canvas');
        
        this.renderer = new CanvasRenderer(ctx);

        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
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
        const cappedDeltaTime = Math.min(deltaTime, 0.25);

        this.accumulator += cappedDeltaTime;

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
        this.objects.forEach(object => {
            object.updatePosition(deltaTime);
            this.applyConstraints(object);
        });
    }

    public addObject(object: RigidBody): void {
        this.objects.push(object);
    }

    public applyGravity(): void {
        const g = new Vector(0, 9.8)
        this.objects.forEach(object => object.addAcceleration(g));
    }

    private applyConstraints(rigidBody: RigidBody): void {
        if(rigidBody instanceof Circle) {
            if(rigidBody.Position.x - rigidBody.radius <= 0) {
                rigidBody.Position.x = rigidBody.radius;
                rigidBody.velocity.x = -rigidBody.velocity.x;
            }

            if(rigidBody.Position.x + rigidBody.radius >= this.canvasWidth) {
                rigidBody.Position.x = this.canvasWidth - rigidBody.radius;
                rigidBody.velocity.x = -rigidBody.velocity.x;
            }

            if(rigidBody.Position.y - rigidBody.radius <= 0) {
                rigidBody.Position.y = rigidBody.radius;
                rigidBody.velocity.y = -rigidBody.velocity.y;
            }

            if(rigidBody.Position.y + rigidBody.radius >= this.canvasHeight) {
                rigidBody.Position.y = this.canvasHeight - rigidBody.radius;
                rigidBody.velocity.y = -rigidBody.velocity.y;
            }
        }
    }
}
