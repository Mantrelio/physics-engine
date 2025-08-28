import { AABB } from "../collisions/axis-aligned-bounding-box";
import {  PolygonRenderData } from "../renderer/interfaces/render-data.interface";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";
import { RigidBody } from "./abstracts/rigid-body.abstract";
import { Shape } from "./enums/shape.enum";
import { BoundingBox } from "./types/bounding-box.type";

export class Polygon extends RigidBody {
    public vertices: Vector[] = [];

    constructor(
            public readonly sideCount: number,
            public readonly size: number,
            mass: number,
            position: Vector,   
            velocity?: Vector, 
            acceleration?: Vector,
            angularAcceleration?: number,
            angularVelocity?: number,
            rotationAngle?: number
    ) {
        super(position, velocity, mass, acceleration, Shape.POLYGON, angularVelocity, angularAcceleration, rotationAngle);

        for (let i = 0; i < sideCount; i++) {
            const angle: number = (2 * Math.PI * i) / sideCount - Math.PI / 2;

            this.vertices.push(new Vector(
                size * Math.cos(angle),
                size * Math.sin(angle)
            ));
        }

        this.momentOfIntertia = 0.5 * mass * size * size * (Math.sin(Math.PI / sideCount) / (Math.PI / sideCount));
    }

    public getRenderData(): PolygonRenderData {
        return {
            type: this.shape,
            x: this.position.x,
            y: this.position.y,
            size: this.size,
            vertices: this.worldVertices
        };
    }

    public get worldVertices(): Vector[] {
        const worldVertices: Vector[] = this.vertices.map(vertex => {
            const rotatedVertice: Vector = VectorMath.rotate(vertex, this.rotationAngle);

            return VectorMath.add(rotatedVertice, this.position)
        });

        return worldVertices;
    }

    public get boundingBox(): BoundingBox {
        const worldVertices: Vector[] = this.worldVertices;

        let minX: number = worldVertices[0].x;
        let maxX: number = worldVertices[0].x;

        let minY: number = worldVertices[0].y;
        let maxY: number = worldVertices[0].y;

        for (const vertex of worldVertices) {
            if (vertex.x < minX) minX = vertex.x;
            if (vertex.x > maxX) maxX = vertex.x;
            if (vertex.y < minY) minY = vertex.y;
            if (vertex.y > maxY) maxY = vertex.y;
        }

        return { minX, maxX, minY, maxY };
    }

    public get aabb(): AABB {
        const { minX, maxX, minY, maxY } = this.boundingBox;

        const halfWidth: number = (maxX - minX) / 2;
        const halfHeight: number = (maxY - minY) / 2; 

        const center: Vector = new Vector(minX + halfWidth, minY + halfHeight);

        return new AABB(center, halfWidth, halfHeight);
    }
}
