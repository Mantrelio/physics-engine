import { Vector } from "../vectors/entities/vector";
import { RigidBody } from "./abstracts/rigid-body.abstract";
import { Shape } from "./enums/shape.enum";
import { CircleRenderData } from "../renderer/interfaces/render-data.interface";

export class Circle extends RigidBody {
    constructor(
        position: Vector,
        private readonly radius: number,
        mass: number,   
        velocity?: Vector, 
        acceleration?: Vector
    ) {
        super(position, velocity, mass, acceleration, Shape.CIRCLE);
    }

    public getRenderData(): CircleRenderData {
        return {
            type: this.shape,
            x: this.position.x,
            y: this.position.y,
            radius: this.radius
        };
    }
}
