import { AABB } from "../../collisions/axis-aligned-bounding-box";
import { AABBRenderData, BaseShapeRenderData } from "../../renderer/interfaces/render-data.interface";
import { Vector } from "../../vectors/entities/vector";
import { VectorMath } from "../../vectors/vector-math";
import { Shape } from "../enums/shape.enum";

export abstract class RigidBody {
    public momentOfIntertia: number = 0;

    constructor(
        public position: Vector,
        public velocity: Vector = new Vector(0, 0),
        public readonly mass: number,
        protected acceleration: Vector = new Vector(0, 0),
        public readonly shape: Shape,
        public angularVelocity: number = 0,
        public angularAcceleration: number = 0,
        public rotationAngle: number = 0,
    ) {}

    public applyForce(force: Vector): void {
        const producedAcceleration: Vector = VectorMath.divide(force, this.mass);
        this.acceleration.add(producedAcceleration);
    }

    public applyTorque(torque: number): void {
        this.angularAcceleration += torque / this.momentOfIntertia;
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
        this.rotationAngle += this.angularVelocity * deltaTime;
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
}
