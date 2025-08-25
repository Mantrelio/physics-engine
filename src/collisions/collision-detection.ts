import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Circle } from "../rigid-bodies/circle";
import { Polygon } from "../rigid-bodies/polygon";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";
import { AABB } from "./axis-aligned-bounding-box";
import { QuadtreeNode } from "./data-structures/quadtree-node";
import { Interval } from "./types/interval.type";

export class CollisionDetection {
    public rootQuadrantNode: QuadtreeNode;

    constructor(
        private readonly canvasWidth: number,
        private readonly canvasHeight: number
    ) {
    }

    private createCollisionGrid(worldObjects: RigidBody[]) {
        this.rootQuadrantNode = new QuadtreeNode(
            new AABB(
                new Vector(this.canvasWidth / 2, this.canvasHeight / 2),
                this.canvasWidth / 2,
                this.canvasHeight / 2
            )
        );

        worldObjects.forEach(object => {
            this.rootQuadrantNode.insert(object);
        });
    }

    public checkForCollision(worldObjects: RigidBody[]) {
        this.createCollisionGrid(worldObjects);

        for (const object of worldObjects) {
            const potentialColliders: RigidBody[] = this.rootQuadrantNode.query(object.aabb);

            for (const collider of potentialColliders) {
                if (collider !== object && this.areColliding(object, collider)) {
                    this.resolveCollision(object, collider);
                }
            }
        }
    }

    private areColliding(object1: RigidBody, object2: RigidBody): boolean {
        if (object1 instanceof Circle && object2 instanceof Circle) {
            const radii: number = object1.radius + object2.radius;
            const distanceBetweenObjects = VectorMath.subtract(object1.position, object2.position);

            if (distanceBetweenObjects.magnitude() <= radii) {
                return true;
            }

            return false;
        }
        
        return false;
    }

    private isCirclePolygonCollision(circle: Circle, polygon: Polygon) {
        const axes: Vector[] = [];

        axes.push(...this.getPolygonAxes(polygon));
        axes.push(this.getCirclePolygonAxis(circle, polygon));

        for (const axis of axes) {
            const circleLimits: Interval = this.projectCircleOnAxis(circle, axis);
            const polygonLimits: Interval = this.projectPolygonOnAxis(polygon, axis);

            if (circleLimits.max < polygonLimits.min || circleLimits.min > polygonLimits.max) {
                return false;
            }
        }

        return true;
    }
    
    private isCircleCircleCollision(circleA: Circle, circleB: Circle): boolean {
        const radii: number = circleA.radius + circleB.radius;
        const distanceBetweenObjects = VectorMath.subtract(circleA.position, circleB.position);

        if (distanceBetweenObjects.magnitude() <= radii) {
            return true;
        }

        return false;
    }

    private getPolygonAxes(polygon: Polygon): Vector[] {
        const axes: Vector[] = [];
        const vertices = polygon.worldVertices;

        for (let i = 0; i < vertices.length; i++) {
            const vertexA: Vector = vertices[i];
            const vertexB: Vector = vertices[(i + 1) % vertices.length];

            const side: Vector =  VectorMath.subtract(vertexA, vertexB);

            const sideNormal = new Vector(-side.y, side.x);
            axes.push(VectorMath.normalize(sideNormal));
        }

        return axes;
    }

    private projectPolygonOnAxis(polygon: Polygon, axis: Vector): Interval {
        const vertices: Vector[] = polygon.worldVertices;

        let min = VectorMath.dot(vertices[0], axis);
        let max = min;

        for (const vertex of vertices) {
            const projection = VectorMath.dot(vertex, axis);

            if (projection < min) min = projection;

            if (projection > max) max = projection;
        }

        return { max: max, min: min };
    }

    private getCirclePolygonAxis(circle: Circle, polygon: Polygon): Vector {
        const vertices: Vector[] = polygon.worldVertices;

        let closestVertex: Vector = vertices[0];
        let closestDistance: number = VectorMath.subtract(circle.position, vertices[0]).magnitude();

        for (const vertex of vertices) {
            const distance = VectorMath.subtract(circle.position, vertex).magnitude();

            if (distance < closestDistance) {
                closestVertex = vertex;
                closestDistance = distance;
            }
        }

        return closestVertex;
    }

    private projectCircleOnAxis(circle: Circle, axis: Vector): Interval {
        const centerProjection = VectorMath.dot(circle.position, axis);

        return {
            min: centerProjection - circle.radius,
            max: centerProjection + circle.radius
        };
    }
    
    private resolveCollision(object1: RigidBody, object2: RigidBody): void {
        if (object1 instanceof Circle && object2 instanceof Circle) {
            const radii: number = object1.radius + object2.radius;
            const distanceVector: Vector = VectorMath.subtract(object1.position, object2.position);
            const peneteration: number = radii - VectorMath.magnitude(distanceVector);
            const correctionDistanceVector: Vector = VectorMath.multiply(VectorMath.normalize(distanceVector), peneteration / 2);

            object2.position.subtract(correctionDistanceVector);
            object1.position.add(correctionDistanceVector);

            const v1 = VectorMath.dot(object1.velocity, VectorMath.normalize(distanceVector));
            const v2 = VectorMath.dot(object2.velocity, VectorMath.normalize(distanceVector));

            object1.velocity.add(VectorMath.multiply(VectorMath.normalize(distanceVector), v2 - v1));
            object2.velocity.add(VectorMath.multiply(VectorMath.normalize(distanceVector), v1 - v2));
        }
    }
}
