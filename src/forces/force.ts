import { Vector } from "../vectors/vector";

export class Force extends Vector {
    constructor(
        x: number,
        y: number,
        public readonly newtons: number
    ) {
        super(x, y)
    }
}
