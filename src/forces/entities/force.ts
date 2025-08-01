import { Vector } from "../../vectors/entities/vector";
import { VectorMath } from "../../vectors/vector-math";

export class Force extends Vector {
    public readonly magnitude: number;

    constructor(x: number, y: number) {
        super(x, y)
        this.magnitude = VectorMath.magnitude(this);
    }
}
