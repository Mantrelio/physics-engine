import { AABB } from "../collisions/axis-aligned-bounding-box";
import {  PolygonRenderData } from "../renderer/interfaces/render-data.interface";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";
import { RigidBody } from "./abstracts/rigid-body.abstract";
import { Shape } from "./enums/shape.enum";

export class Polygon extends RigidBody {
    public vertices: Vector[] = [];

    constructor(
            public readonly sideCount: number,
            public readonly size: number,
            mass: number,
            position: Vector,   
            velocity?: Vector, 
            acceleration?: Vector
    ) {
        super(position, velocity, mass, acceleration, Shape.POLYGON);

        for (let i = 0; i < sideCount; i++) {
            const angle = (2 * Math.PI * i) / sideCount - Math.PI / 2;

            this.vertices.push(new Vector(
                size * Math.cos(angle),
                size * Math.sin(angle)
            ));
        }
    }

    public getRenderData(): PolygonRenderData {
        return {
            type: this.shape,
            x: this.position.x,
            y: this.position.y,
            size: this.size,
            vertices: this.vertices.map(vertice => 
                VectorMath.add(vertice, this.position)
            )
        }
    }

    public get aabb(): AABB {
        const worldVertices: Vector[] = this.vertices.map(vertice => 
            VectorMath.add(vertice, this.position)
        );

        let minX: number = worldVertices[0].x;
        let maxX: number = worldVertices[0].x;

        let minY: number = worldVertices[0].y;
        let maxY: number = worldVertices[0].y;

        for (const vertice of worldVertices) {
            if (vertice.x < minX) minX = vertice.x;
            if (vertice.x > maxX) maxX = vertice.x;
            if (vertice.y < minY) minY = vertice.y;
            if (vertice.y > maxY) maxY = vertice.y;
        }

        const halfWidth: number = (maxX - minX) / 2;
        const halfHeight: number = (maxY - minY) / 2; 

        const center: Vector = new Vector(minX + halfWidth, minY + halfHeight)

        return new AABB(center, halfWidth, halfHeight);
    }
}
