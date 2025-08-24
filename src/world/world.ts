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

    private visibleAABB: boolean = true;
    private visibleCollisionGrid: boolean = true;

    private readonly constraintHandlers: Record<Shape, (rigidBody: RigidBody) => void> = {
        [Shape.CIRCLE]: (rigidBody: RigidBody) => {
            const restitution: number = 0.8;
            const circle = rigidBody as Circle;

            if (circle.position.x - circle.radius <= 0) {
                circle.position.x = circle.radius;
                circle.velocity.x = -circle.velocity.x * restitution;
            } else if (circle.position.x + circle.radius >= this.canvasWidth) {
                circle.position.x = this.canvasWidth - circle.radius;
                circle.velocity.x = -circle.velocity.x * restitution;
            }

            if (circle.position.y - circle.radius <= 0) {
                circle.position.y = circle.radius;
                rigidBody.velocity.y = -circle.velocity.y * restitution;
            } else if (circle.position.y + circle.radius >= this.canvasHeight) {
                circle.position.y = this.canvasHeight - circle.radius;
                circle.velocity.y = -circle.velocity.y * restitution;
            }
        },

        [Shape.POLYGON]: (rigidBody: RigidBody) => undefined
    }

    private readonly dragCoefficients: Record<Shape, number> = {
        'circle': 0.47,
        'polygon': 0.5
    }

    constructor(
        private readonly airDensity: number,
        canvasId: string,
    ) {
        const canvas: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) throw new Error(`Canvas with id '${canvasId}' not found`);
        

        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context from canvas');
        
        this.renderer = new CanvasRenderer(ctx);

        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;

        this.collisionDetection = new CollisionDetection(this.canvasWidth, this.canvasHeight);
    }

    public run(): void {
        let lastFrameTime: number = 0;
        
        const simulationLoop = (currentTime: number) => {
            if (lastFrameTime === 0) lastFrameTime = currentTime;

            const deltaTime: number = (currentTime - lastFrameTime) / 1000;
            lastFrameTime = currentTime;

            if(deltaTime > 0) this.fixedTimeStepUpdate(deltaTime);
            
            requestAnimationFrame(simulationLoop);
        }

        requestAnimationFrame(simulationLoop);
    }

    private fixedTimeStepUpdate(deltaTime: number) {
        const cappedDeltaTime: number = Math.min(deltaTime, 0.25);

        this.accumulator += cappedDeltaTime;

        let physicsStepsCount: number = 0;

        while (this.accumulator >= this.fixedTimeStep && physicsStepsCount < this.physicsStepsLimit) {
            this.updatePhysics(this.fixedTimeStep);
            this.collisionDetection.checkForCollision(this.objects);

            this.accumulator -= this.fixedTimeStep;
            physicsStepsCount++;
        }

        if (physicsStepsCount >= this.physicsStepsLimit) this.accumulator = 0;

        this.renderer.render(this.objects, this.collisionDetection.rootQuadrantNode, { visibleAABB: this.visibleAABB, visibleCollisionGrid: this.visibleCollisionGrid });
    }

    private updatePhysics(deltaTime: number) {
        this.objects.forEach(object => {
            //this.applyGravity(object);
            this.applyDrag(object);
            object.updatePosition(deltaTime);
            this.applyConstraints(object);
        });
    }

    public addObject(object: RigidBody): void {
        this.objects.push(object);
    }

    public applyGravity(object: RigidBody): void {
        const gravityForce: Vector = new Vector(0, 9.8*object.mass); 
        object.applyForce(gravityForce);
    }

    private applyConstraints(rigidBody: RigidBody): void {
        this.constraintHandlers[rigidBody.shape](rigidBody);
    }

    private applyDrag(object: RigidBody): void {
        if (object.velocity.x === 0 && object.velocity.y === 0) return;
            
        if (object instanceof Circle) {
            const dragDirectionalVector: Vector = VectorMath.normalize(object.velocity).multiply(-1);
            const dragForce: Vector = VectorMath.multiply(dragDirectionalVector, VectorMath.magnitude(object.velocity)*this.dragCoefficients[object.shape]*this.airDensity*0.5); 
            object.applyForce(dragForce);
        }
    }
}
