export class Vector {
    constructor(
        public x: number,
        public y: number
    ) {}

    public add(vector: Vector): void {
        this.x = this.x + vector.x;
        this.y = this.y + vector.y;
    }

    public subtract(vector: Vector): void {
        this.x = this.x - vector.x;
        this.y = this.y - vector.y;
    }

    public multiply(scalar: number): void {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
    }

    public divide(scalar: number): void {
        this.x = this.x / scalar;
        this.y = this.y / scalar;
    }

    public magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
