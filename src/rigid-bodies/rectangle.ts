import { Vector } from "../vectors/entities/vector.js";
import { RectangleConfig } from "./interfaces/shape-config.js";
import { Polygon } from "./abstracts/polygon.js";

export class Rectangle extends Polygon {
    private readonly width: number;
    private readonly height: number;

    constructor(config: RectangleConfig) {
        const inertia: number = (1/12) * (config.mass ?? Infinity)* (config.width * config.width + config.height * config.height);

        super({
            position: new Vector(config.position[0], config.position[1]),
            mass: config.mass,
            velocity: config.velocity,
            angularVelocity: config.angularVelocity,
            inertia: inertia,
            color: config.color ?? '#0066cc'
        });

        this.width = config.width;
        this.height = config.height;

        this.createVertices();
    }

    protected createVertices(): void {
        this.vertices = [];

        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        this.vertices = [
            new Vector(-halfWidth, -halfHeight),
            new Vector(halfWidth, -halfHeight),    
            new Vector(halfWidth, halfHeight),   
            new Vector(-halfWidth, halfHeight)  
        ];
    }
}
