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
        const producedAcceleration = VectorMath.divide(force, this.mass);
        this.acceleration = VectorMath.add(this.acceleration, producedAcceleration);
    }

    public updatePosition(deltaTime: number): void {
        const lastAcceleration: Vector = this.acceleration;    

        this.position = VectorMath.add(
            this.position, 
            VectorMath.multiply(VectorMath.multiply(this.velocity, deltaTime), 100), 
            VectorMath.multiply(VectorMath.multiply(this.acceleration, deltaTime * deltaTime * 0.5), 100)
        );

        const averageAcceleration: Vector = VectorMath.divide(
            VectorMath.add(lastAcceleration, this.acceleration), 
            2
        );

        this.velocity = VectorMath.add(
            this.velocity, 
            VectorMath.multiply(averageAcceleration, deltaTime)
        );

        this.acceleration = VectorMath.multiply(this.acceleration, 0);
    }

    abstract getRenderData(): BaseRenderData;
}
