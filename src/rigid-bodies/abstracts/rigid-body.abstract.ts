import { BaseRenderData } from "../../renderer/interfaces/render-data.interface";
import { Vector } from "../../vectors/entities/vector";
import { VectorMath } from "../../vectors/vector-math";
import { Shape } from "../enums/shape.enum";

export abstract class RigidBody {
    constructor(
        protected position: Vector,
        protected velocity: Vector = new Vector(0, 0),
        protected readonly mass: number,
        protected acceleration: Vector = new Vector(0, 0),
        protected readonly shape: Shape
    ) {}

    protected forces: Vector[] = [];

    //TODO: assign public for clarification
    addForce(force: Vector): void {
        this.forces.push(force);
    }

    public updatePosition(deltaTime: number): void {
        const lastAcceleration: Vector = this.acceleration;    

        this.position = VectorMath.add(this.position, VectorMath.multiply(this.velocity, deltaTime), VectorMath.multiply(this.acceleration, deltaTime * deltaTime * 0.5));
        
        this.acceleration =  VectorMath.divide(VectorMath.add(...this.forces), this.mass);
        const averageAcceleration: Vector = VectorMath.divide(VectorMath.add(lastAcceleration, this.acceleration), 2);

        this.velocity = VectorMath.add(this.velocity, VectorMath.multiply(averageAcceleration, deltaTime));

        this.forces = [];
    }

    abstract getRenderData(): BaseRenderData;
}
