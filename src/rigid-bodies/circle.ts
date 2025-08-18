import { Vector } from "../vectors/entities/vector";
import { RigidBody } from "./abstracts/rigid-body.abstract";
import { Shape } from "./enums/shape.enum";
import { CircleRenderData } from "../renderer/interfaces/render-data.interface";
import { AABB } from "../collisions/axis-aligned-bounding-box";

export class Circle extends RigidBody {
    public readonly color: string = this.generateRandomColor();

    constructor(
        position: Vector,
        public readonly radius: number,
        mass: number,   
        velocity?: Vector, 
        acceleration?: Vector
    ) {
        super(position, velocity, mass, acceleration, Shape.CIRCLE);
    }

    private generateRandomColor(): string {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 50) + 50;
        const lightness = Math.floor(Math.random() * 30) + 40;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    public getRenderData(): CircleRenderData {
        return {
            type: this.shape,
            x: this.position.x,
            y: this.position.y,
            radius: this.radius,
            color: this.color
        };
    }

    public get aabb(): AABB {
        return new AABB(this.position, this.radius, this.radius);
    }
}
