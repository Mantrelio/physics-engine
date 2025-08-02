import { Vector } from "../../../vectors/entities/vector";
import { VectorMath } from "../../../vectors/vector-math";

export abstract class RigidBody {
    constructor(
        public position: Vector,
        public velocity: Vector = new Vector(0, 0),
        public mass: number = 1,
        public acceleration: Vector = new Vector(0, 0)
    ) {}

    private forces: Vector[] = [];

    addForce(force: Vector): void {
        this.forces.push(force);
    }

    updatePosition(deltaTime: number): void {
        const lastAcceleration: Vector = this.acceleration;    

        this.position = VectorMath.add(this.position, VectorMath.multiply(this.velocity, deltaTime), VectorMath.multiply(this.acceleration, deltaTime * deltaTime * 0.5));
        
        this.acceleration =  VectorMath.divide(VectorMath.add(...this.forces), this.mass);
        const averageAcceleration: Vector = VectorMath.divide(VectorMath.add(lastAcceleration, this.acceleration), 2);

        this.velocity = VectorMath.add(this.velocity, VectorMath.multiply(averageAcceleration, deltaTime));

        this.drawShape();
    }

    abstract drawShape(): void;
}
