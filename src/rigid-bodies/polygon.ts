import { AABB } from "../collisions/axis-aligned-bounding-box";
import {  PolygonRenderData } from "../renderer/interfaces/render-data.interface";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";
import { RigidBody } from "./abstracts/rigid-body.abstract";
import { Shape } from "./enums/shape.enum";
import { PolygonConfig } from "./interfaces/shape-config";
import { BoundingBox } from "./types/bounding-box.type";

export class Polygon extends RigidBody {
    public vertices: Vector[] = [];
    private readonly size: number;

    constructor(config: PolygonConfig) {
        super({
            position: new Vector(config.position[0], config.position[1]),
            shape: Shape.POLYGON,
            mass: config.mass,
            velocity: config.velocity,
            angularVelocity: config.angularVelocity,
            inertia: 0.5 * (config.mass ?? 1) * config.size * config.size * (Math.sin(Math.PI / config.sideCount) / (Math.PI / config.sideCount)),
        });

        this.size = config.size;

        this.createVertices(config.sideCount, config.size);
    }

    private createVertices(sideCount: number, size: number): void {
        for (let i = 0; i < sideCount; i++) {
            const angle: number = (2 * Math.PI * i) / sideCount - Math.PI / 2;

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
