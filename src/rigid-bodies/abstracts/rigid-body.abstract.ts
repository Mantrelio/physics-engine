import { BaseRenderData } from "../../renderer/interfaces/render-data.interface";
import { Vector } from "../../vectors/entities/vector";
import { VectorMath } from "../../vectors/vector-math";
import { Shape } from "../enums/shape.enum";

export abstract class RigidBody {
    constructor(
        public position: Vector,
        public velocity: Vector = new Vector(0, 0),
        public readonly mass: number,
        protected acceleration: Vector = new Vector(0, 0),
        public readonly shape: Shape
    ) {}

    public applyForce(force: Vector): void {
        const producedAcceleration: Vector = VectorMath.divide(force, this.mass);
        this.acceleration.add(producedAcceleration);
    }

    public updatePosition(deltaTime: number): void {
        this.position.add(VectorMath.multiply(this.velocity, deltaTime).multiply(100)).add(VectorMath.multiply(this.acceleration, deltaTime * deltaTime * 0.5).multiply(100));

        this.velocity.add(VectorMath.multiply(this.acceleration, deltaTime));

        this.acceleration.multiply(0);
    }

    abstract getRenderData(): BaseRenderData;
}
