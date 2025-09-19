import { CollisionDetection } from "../collisions/collision-detection";
import { WorldOptions } from "../physics-engine/interfaces/physics-engine-options";
import { CanvasRenderer } from "../renderer/canvas-renderer";
import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Circle } from "../rigid-bodies/circle";
import { Shape } from "../rigid-bodies/enums/shape.enum";
import { Polygon } from "../rigid-bodies/polygon";
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

    private readonly airDensity: number;
    private readonly gravityActive: boolean;
    private readonly dragActive: boolean;
    private visibleAABB: boolean;
    private visibleCollisionGrid: boolean;

    private readonly constraintHandlers: Record<Shape, (rigidBody: RigidBody) => void> = {
        [Shape.CIRCLE]: (rigidBody: RigidBody) => {
            const restitution: number = 0.8;
            const circle: Circle = rigidBody as Circle;

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

        [Shape.POLYGON]: (rigidBody: RigidBody) => {
            const restitution: number = 0.8;
            const polygon: Polygon = rigidBody as Polygon;
            const { maxX, minX, maxY, minY } = polygon.boundingBox;

            if (minX < 0) {
                polygon.position.x += -minX;
                polygon.velocity.x = -polygon.velocity.x * restitution;
            } else if (maxX > this.canvasWidth) {
                polygon.position.x -= (maxX - this.canvasWidth);
                polygon.velocity.x = -polygon.velocity.x * restitution;
            }

            if (minY < 0) {
                polygon.position.y += -minY;
                polygon.velocity.y = -polygon.velocity.y * restitution;
            } else if (maxY > this.canvasHeight) {
                polygon.position.y -= (maxY - this.canvasHeight);
                polygon.velocity.y = -polygon.velocity.y * restitution;
            } 
        }
    }

    private readonly dragCoefficients: Record<Shape, number> = {
        'circle': 0.47,
        'polygon': 0.5
    }

    constructor(options: WorldOptions) {
        const canvas: HTMLCanvasElement = this.resolveCanvas(options.canvas);
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context from canvas');
        
        this.renderer = new CanvasRenderer(ctx);
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;

        this.gravityActive = options.enableGravity ?? true;
        this.dragActive = options.enableDrag ?? true;
        this.airDensity = options.airDensity ?? 0;

        this.visibleAABB = options.enableAABBVisualization ?? false;
        this.visibleCollisionGrid = options.enableCollisionGridVisualization ?? false;

        this.collisionDetection = new CollisionDetection(this.canvasWidth, this.canvasHeight);
    }

    private resolveCanvas(canvas: HTMLCanvasElement | string): HTMLCanvasElement {
        if (typeof canvas === 'string') {
            const element = document.getElementById(canvas) as HTMLCanvasElement
            if (!element) throw new Error(`Canvas with id '${canvas}' not found`);
            return element;
        }

        return canvas as HTMLCanvasElement;
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

            this.accumulator -= this.fixedTimeStep;
            physicsStepsCount++;
        }

        if (physicsStepsCount >= this.physicsStepsLimit) this.accumulator = 0;

        this.renderer.render(this.objects, this.collisionDetection.rootQuadrantNode, { visibleAABB: this.visibleAABB, visibleCollisionGrid: this.visibleCollisionGrid });
    }

    private updatePhysics(deltaTime: number) {
        this.objects.forEach(object => {
            if (this.gravityActive) this.applyGravity(object);
            if (this.dragActive) this.applyDrag(object);
            object.updateDynamics(deltaTime);
            this.applyConstraints(object);
        });

        this.collisionDetection.checkForCollision(this.objects);
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
        if (object.velocity.x != 0 && object.velocity.y != 0) {
            const dragDirectionalVector: Vector = VectorMath.normalize(object.velocity).multiply(-1);
            const dragForce: Vector = VectorMath.multiply(dragDirectionalVector, VectorMath.magnitude(object.velocity)*this.dragCoefficients[object.shape] * this.airDensity * 0.5); 
            object.applyForce(dragForce);
        }

        if (object.angularVelocity != 0) {
            const angularDragCoefficient = 0.1;
            const angularDragTorque = -object.angularVelocity * angularDragCoefficient;
            object.applyTorque(angularDragTorque);
        }
    }
}
