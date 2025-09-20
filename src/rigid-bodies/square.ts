import { Vector } from "../vectors/entities/vector";
import { SquareConfig } from "./interfaces/shape-config";
import { Polygon } from "./polygon";

export class Square extends Polygon {
    public vertices: Vector[] = [];
    
    constructor(config: SquareConfig) {
        super({
            size: config.size,
            sideCount: 4,
            position: [config.position[0], config.position[1]],
            mass: config.mass,
            velocity: config.velocity,
            angularVelocity: config.angularVelocity,
        });

        this.vertices = [
            new Vector(-config.size, -config.size),
            new Vector(config.size, -config.size),
            new Vector(config.size, config.size),
            new Vector(-config.size, config.size)
        ];
    }
}
