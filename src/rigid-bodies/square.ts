import { Vector } from "../vectors/entities/vector";
import { Polygon } from "./polygon";

export class Square extends Polygon {
    public vertices: Vector[] = [];
    
    constructor(
            public readonly size: number,
            mass: number,
            position: Vector,   
            velocity?: Vector, 
            acceleration?: Vector
    ) {
        super(4, size, mass, position, velocity, acceleration);

        this.vertices = [
            new Vector(-size, -size),
            new Vector(size, -size),
            new Vector(size, size),
            new Vector(-size, size)
        ];
    }
}
