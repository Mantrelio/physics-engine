import { RigidBody } from "./abstracts/rigid-body.js";
import { Shape } from "./enums/shape.enum.js";
import { CircleRenderData } from "../renderer/interfaces/render-data.interface.js";
import { AABB } from "../collisions/axis-aligned-bounding-box.js";
import { CircleConfig } from "./interfaces/shape-config.js";
import { Vector } from "../vectors/entities/vector.js";

export class Circle extends RigidBody {
    public readonly radius: number;

    constructor(config: CircleConfig) {
        super({
            position: new Vector(config.position[0], config.position[1]),
            shape: Shape.CIRCLE,
            mass: config.mass,
            velocity: config.velocity,
            angularVelocity: config.angularVelocity,
            inertia: 0.5 * (config.mass ?? 1) * config.radius * config.radius,
            color: config.color ?? '#0066cc'
        });

        this.radius = config.radius;
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
