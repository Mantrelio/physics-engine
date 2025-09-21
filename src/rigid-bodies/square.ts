import { Vector } from "../vectors/entities/vector.js";
import { SquareConfig } from "./interfaces/shape-config.js";
import { Polygon } from "./abstracts/polygon.js";

export class Square extends Polygon {
    private readonly size: number;

    constructor(config: SquareConfig) {
        const inertia: number = (1/6) * (config.mass ?? Infinity)  * (config.size / 2) * (config.size / 2);

        super({
            position: new Vector(...config.position),
            mass: config.mass,
            velocity: config.velocity,
            angularVelocity: config.angularVelocity,
            inertia: inertia,
            color: config.color ?? '#0066cc'
        });

        this.size = config.size;

        this.createVertices();
    }

    protected createVertices(): void {
        this.vertices = [
            new Vector(-this.size / 2, -this.size / 2),
            new Vector(this.size / 2, -this.size / 2),
            new Vector(this.size / 2, this.size / 2),
            new Vector(-this.size / 2, this.size / 2)
        ];
    }
}
