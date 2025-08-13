export class Vector {
    constructor(
        public x: number,
        public y: number
    ) {}

    public add(vector: Vector) {
        this.x = this.x + vector.x;
        this.y = this.y + vector.y;
    }
}
