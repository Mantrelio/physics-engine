import { CollisionDetection } from "../collisions/collision-detection";
import { CanvasRenderer } from "../renderer/canvas-renderer";
import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Circle } from "../rigid-bodies/circle";
import { Shape } from "../rigid-bodies/enums/shape.enum";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";

export class World {
    private objects: RigidBody[] = [];
    private renderer: CanvasRenderer;
    private collisionDetection: CollisionDetection;
    public readonly canvasWidth: number;
    public readonly canvasHeight: number;

    private readonly fixedTimeStep: number = 1/60;
    private accumulator: number = 0;
    private readonly physicsStepsLimit: number = 4;

    private readonly dragCoefficients: Record<Shape, number> = {
        'circle': 0.47
    }

    constructor(
        private readonly airDensity: number,
        canvasId: string,
    ) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) throw new Error(`Canvas with id '${canvasId}' not found`);
        

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context from canvas');
        
        this.renderer = new CanvasRenderer(ctx);

        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;

        this.collisionDetection = new CollisionDetection(this.canvasWidth, this.canvasHeight);
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
            this.applyDrag();
            this.updatePhysics(this.fixedTimeStep);
            this.collisionDetection.checkForCollision(this.objects);

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
        const g = new Vector(0, 9.8);
        this.objects.forEach(object => object.addAcceleration(g));
    }

    private applyConstraints(rigidBody: RigidBody): void {
        const restitution = 0.8;

        if(rigidBody instanceof Circle) {
            if(rigidBody.position.x - rigidBody.radius <= 0) {
                rigidBody.position.x = rigidBody.radius;
                rigidBody.velocity.x = -rigidBody.velocity.x * restitution;
            }

            if(rigidBody.position.x + rigidBody.radius >= this.canvasWidth) {
                rigidBody.position.x = this.canvasWidth - rigidBody.radius;
                rigidBody.velocity.x = -rigidBody.velocity.x * restitution;
            }

            if(rigidBody.position.y - rigidBody.radius <= 0) {
                rigidBody.position.y = rigidBody.radius;
                rigidBody.velocity.y = -rigidBody.velocity.y * restitution;
            }

            if(rigidBody.position.y + rigidBody.radius >= this.canvasHeight) {
                rigidBody.position.y = this.canvasHeight - rigidBody.radius;
                rigidBody.velocity.y = -rigidBody.velocity.y * restitution;
            }
        }
    }

    private applyDrag(): void {
        this.objects.forEach(object => {
            if (object.velocity.x === 0 && object.velocity.y === 0) {
                return;
            }
                
            if (object instanceof Circle) {
                const dragAcceleration: Vector = VectorMath.multiply(
                    VectorMath.multiply(object.velocity, 0.5*this.airDensity*object.radius*VectorMath.magnitude(object.velocity)*this.dragCoefficients[object.shape] / object.mass),
                    -1
                );

                object.velocity = VectorMath.add(object.velocity, VectorMath.multiply(dragAcceleration, this.fixedTimeStep));
            }
        });
    }
}
