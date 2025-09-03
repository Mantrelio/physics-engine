import { Vector } from "./entities/vector";

export class VectorMath {
    static add(...vectors: Vector[]): Vector {
        if (vectors.length < 2) throw new Error(`Add() method expected at least 2 vectors, got ${vectors.length}`);

        let xValue: number = 0;
        let yValue: number = 0; 

        for (const vector of vectors) {
            xValue += vector.x;
            yValue += vector.y;
        }

        return new Vector(xValue, yValue);
    }

    static subtract(...vectors: Vector[]): Vector {
        if (vectors.length < 2) throw new Error(`Subtract() method expected at least 2 vectors, got ${vectors.length}`);

        let xValue: number = vectors[0].x;
        let yValue: number = vectors[0].y; 

        for (let i = 1; i < vectors.length; i++) {
            xValue -= vectors[i].x;
            yValue -= vectors[i].y;
        }

        return new Vector(xValue, yValue);
    }

    static multiply(vector: Vector, scalar: number): Vector {
        return new Vector(vector.x * scalar, vector.y * scalar);
    }

    static divide(vector: Vector, scalar: number): Vector {
        return new Vector(vector.x / scalar, vector.y / scalar);
    }

    static dot(vector1: Vector, vector2: Vector): number {
        return (vector1.x * vector2.x + vector1.y * vector2.y);
    }

    static cross(vector1: Vector, vector2: Vector): number {
        return (vector1.x * vector2.y - vector1.y * vector2.x);
    }

    static rotate(vector: Vector, angleRadians: number): Vector {
        const cos = Math.cos(angleRadians);
        const sin = Math.sin(angleRadians);

        return new Vector(
            vector.x * cos - vector.y * sin,
            vector.x * sin + vector.y * cos
        );
    }

    static magnitude(vector: Vector): number {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    static magnitudeSquared(vector: Vector): number {
        return vector.x * vector.x + vector.y * vector.y;
    }

    static distance(vector1: Vector, vector2: Vector): number {
        const dx = vector1.x - vector2.x;
        const dy = vector1.y - vector2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static normalize(vector: Vector): Vector {
        return VectorMath.divide(vector, VectorMath.magnitude(vector));
    }

    static zero(): Vector {
        return new Vector(0, 0);
    }
}
