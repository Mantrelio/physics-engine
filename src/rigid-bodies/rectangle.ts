import { Vector } from "../vectors/entities/vector";
import { RectangleConfig } from "./interfaces/shape-config";
import { Polygon } from "./polygon";

export class Rectangle extends Polygon {
    private readonly width: number;
    private readonly height: number;

    constructor(config: RectangleConfig) {
        super({
            size: 1,
            sideCount: 4,
            position: [config.position[0], config.position[1]],
            mass: config.mass,
            velocity: config.velocity,
            angularVelocity: config.angularVelocity,
        });

        this.width = config.width;
        this.height = config.height;

        this.createRectangleVertices();
    }

    private createRectangleVertices(): void {
        this.vertices = [];

        const halfWidth = this.width / 2;
        const halfLength = this.height / 2;

        this.vertices = [
            new Vector(-halfWidth, -halfLength),
            new Vector(halfWidth, -halfLength),    
            new Vector(halfWidth, halfLength),   
            new Vector(-halfWidth, halfLength)  
        ]
    }
}
