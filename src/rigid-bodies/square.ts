import { Vector } from "../vectors/entities/vector";
import { SquareConfig } from "./interfaces/shape-config";
import { Polygon } from "./abstracts/polygon";

export class Square extends Polygon {
    private readonly size: number;

    constructor(config: SquareConfig) {
        const inertia: number = (1/6) * (config.mass ?? Infinity)  * (config.size / 2) * (config.size / 2);

        super({
            position: new Vector(...config.position),
            mass: config.mass,
            velocity: config.velocity,
            angularVelocity: config.angularVelocity,
            inertia: inertia
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
