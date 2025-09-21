import { AABB } from "../../collisions/axis-aligned-bounding-box.js";
import {  PolygonRenderData } from "../../renderer/interfaces/render-data.interface.js";
import { Vector } from "../../vectors/entities/vector.js";
import { VectorMath } from "../../vectors/vector-math.js";
import { RigidBody } from "./rigid-body.js";
import { Shape } from "../enums/shape.enum.js";
import { PolygonConstructorParameters } from "../interfaces/shape-constructor-parameters.js";
import { BoundingBox } from "../types/bounding-box.type.js";

export abstract class Polygon extends RigidBody {
    public vertices: Vector[] = [];

    constructor(parameters: PolygonConstructorParameters) {
        super({
            position: parameters.position,
            shape: Shape.POLYGON,
            mass: parameters.mass,
            velocity: parameters.velocity,
            angularVelocity: parameters.angularVelocity,
            inertia: parameters.inertia,
        });
    }
    
    protected abstract createVertices(): void;

    public getRenderData(): PolygonRenderData {
        return {
            type: this.shape,
            x: this.position.x,
            y: this.position.y,
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
