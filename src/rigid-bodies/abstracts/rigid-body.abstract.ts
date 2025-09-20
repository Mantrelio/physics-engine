import { AABB } from "../../collisions/axis-aligned-bounding-box";
import { AABBRenderData, BaseShapeRenderData } from "../../renderer/interfaces/render-data.interface";
import { Vector } from "../../vectors/entities/vector";
import { VectorMath } from "../../vectors/vector-math";
import { Shape } from "../enums/shape.enum";
import { ShapeConstructorOptions } from "../interfaces/shape-constructor-options";

export abstract class RigidBody {
    private static nextId: number = 1;
    public readonly id: number;
    public position: Vector;
    public readonly mass: number;
    public readonly shape: Shape;
    public velocity: Vector;
    protected acceleration: Vector = VectorMath.zero();
    public angularVelocity: number;
    public angularAcceleration: number = 0;
    public rotationAngle: number = 0;
    public readonly inertia: number;

    constructor(options: ShapeConstructorOptions) {
        if (options.mass && options.mass <= 0) throw new Error('Rigid body mass must be greater than zero');

        this.id = RigidBody.nextId++;
        this.position = options.position ?? VectorMath.zero();
        this.velocity = options.velocity ?? VectorMath.zero();
        this.mass = options.mass ?? Infinity;
        this.shape = options.shape;
        this.angularVelocity = options.angularVelocity ?? 0;
        this.inertia = options.inertia;
    }

    public applyForce(force: Vector): void {
        if (this.mass === Infinity) return;
        const producedAcceleration: Vector = VectorMath.divide(force, this.mass);
        this.acceleration.add(producedAcceleration);
    }

    public applyTorque(torque: number): void {
        if (this.mass === Infinity) return;
        this.angularAcceleration += torque / this.inertia;
    }

    public updateDynamics(deltaTime: number): void {
        this.updatePosition(deltaTime);
        this.updateRotation(deltaTime);
    }

    private updatePosition(deltaTime: number): void {
        this.velocity.add(VectorMath.multiply(this.acceleration, deltaTime));
        this.position.add(VectorMath.multiply(this.velocity, deltaTime).multiply(100)).
            add(VectorMath.multiply(this.acceleration, deltaTime * deltaTime * 0.5).multiply(100));
        this.acceleration.multiply(0);
    }

    private updateRotation(deltaTime: number): void {
        this.angularVelocity += this.angularAcceleration * deltaTime;
        this.rotationAngle += this.angularVelocity * deltaTime * 100;
        this.angularAcceleration = 0;
    }

    public abstract getRenderData(): BaseShapeRenderData;

    public abstract get aabb(): AABB;

    public getAABBRenderData(): AABBRenderData {
        const aabb = this.aabb;

        return {
            x: aabb.position.x,
            y: aabb.position.y,
            halfWidth: aabb.halfWidth,
            halfHeight: aabb.halfHeight
        };
    }

    public get inverseMass(): number {
        return 1 / this.mass;
    }

    public get inverseInertia(): number {
        return 1 / this.inertia;
    }
}
