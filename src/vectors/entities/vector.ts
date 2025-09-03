export class Vector {
    constructor(
        public x: number,
        public y: number
    ) {}

    public add(vector: Vector): Vector {
        this.x = this.x + vector.x;
        this.y = this.y + vector.y;

        return this;
    }

    public subtract(vector: Vector): Vector {
        this.x = this.x - vector.x;
        this.y = this.y - vector.y;

        return this;
    }

    public multiply(scalar: number): Vector {
        this.x = this.x * scalar;
        this.y = this.y * scalar;

        return this;
    }

    public divide(scalar: number): Vector {
        this.x = this.x / scalar;
        this.y = this.y / scalar;

        return this;
    }

    public magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    public rotate(angleRadians: number): Vector {
        const cos = Math.cos(angleRadians);
        const sin = Math.sin(angleRadians);

        this.x = this.x * cos - this.y * sin;
        this.y = this.x * sin + this.y * cos;

        return this;
    }

    public normalize(): Vector {
        this.divide(this.magnitude());

        return this;
    }
}
