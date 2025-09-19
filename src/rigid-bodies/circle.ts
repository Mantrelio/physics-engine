import { RigidBody } from "./abstracts/rigid-body.abstract";
import { Shape } from "./enums/shape.enum";
import { CircleRenderData } from "../renderer/interfaces/render-data.interface";
import { AABB } from "../collisions/axis-aligned-bounding-box";
import { CircleConfig } from "./interfaces/shape-config";

export class Circle extends RigidBody {
    public readonly color: string = this.generateRandomColor();
    public readonly radius: number;

    constructor(config: CircleConfig) {
        super({
            position: config.position,
            shape: Shape.CIRCLE,
            mass: config.mass,
            velocity: config.velocity,
            angularVelocity: config.angularVelocity,
            inertia: 0.5 * (config.mass ?? 1) * config.radius * config.radius,
        });

        this.radius = config.radius;
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
