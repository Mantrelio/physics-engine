import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Circle } from "../rigid-bodies/circle";
import { Polygon } from "../rigid-bodies/polygon";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";
import { AABB } from "./axis-aligned-bounding-box";
import { CollisionResolver } from "./collision-resolver";
import { QuadtreeNode } from "./data-structures/quadtree-node";
import { CollisionData } from "./types/collision-data.type";
import { Interval } from "./types/interval.type";

export class CollisionDetection {
    public rootQuadrantNode: QuadtreeNode;

    constructor(
        private readonly canvasWidth: number,
        private readonly canvasHeight: number
    ) {}

    private createCollisionGrid(worldObjects: RigidBody[]): void {
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

    public checkForCollision(worldObjects: RigidBody[]): void {
        this.createCollisionGrid(worldObjects);

        for (const object of worldObjects) {
            const potentialColliders: RigidBody[] = this.rootQuadrantNode.query(object.aabb);

            for (const collider of potentialColliders) {
                const collisionData: CollisionData | null =  this.detectCollision(object, collider);
                if (collider !== object && collisionData) {
                    CollisionResolver.execute(collisionData);
                }
            }
        }
    }

    private detectCollision(objectB: RigidBody, objectA: RigidBody): CollisionData | null {
        if (objectA instanceof Circle && objectB instanceof Polygon) return this.isCirclePolygonCollision(objectA, objectB);
        if (objectA instanceof Polygon && objectB instanceof Circle) return this.isCirclePolygonCollision(objectB, objectA);
        if (objectA instanceof Circle && objectB instanceof Circle) return this.isCircleCircleCollision(objectA, objectB);
        if (objectA instanceof Polygon && objectB instanceof Polygon) return this.isPolygonPolygonCollision(objectA, objectB);

        return null;
    }

    private isCirclePolygonCollision(circle: Circle, polygon: Polygon): CollisionData | null {
        const axes: Vector[] = [];

        axes.push(...this.getPolygonAxes(polygon));
        axes.push(this.getCircleAxis(circle, polygon));

        let minPeneterationDepth: number = Infinity;
        let collisionNormal: Vector = new Vector(0, 0);
 
        for (const axis of axes) {
            const circleLimits: Interval = this.projectCircleOnAxis(circle, axis);
            const polygonLimits: Interval = this.projectPolygonOnAxis(polygon, axis);

            if (circleLimits.max < polygonLimits.min || circleLimits.min > polygonLimits.max) return null;

            const axisPeneterationDepth: number = Math.min(circleLimits.max - polygonLimits.min, polygonLimits.max - circleLimits.min);

            if (minPeneterationDepth > axisPeneterationDepth) {
                minPeneterationDepth = axisPeneterationDepth;
                collisionNormal = axis;
            }
        }

        return { objectA: circle, objectB: polygon, peneterationDepth: minPeneterationDepth, collisionNormal: collisionNormal };
    }

    private isPolygonPolygonCollision(polygonA: Polygon, polygonB: Polygon): CollisionData | null {
        const axes: Vector[] = [];

        axes.push(...this.getPolygonAxes(polygonA));
        axes.push(...this.getPolygonAxes(polygonB));

        let minPeneterationDepth: number = Infinity;
        let collisionNormal: Vector = new Vector(0, 0);

        for (const axis of axes) {
            const polygonALimits: Interval = this.projectPolygonOnAxis(polygonA, axis);
            const polygonBLimits: Interval = this.projectPolygonOnAxis(polygonB, axis);

            if (polygonALimits.max < polygonBLimits.min || polygonALimits.min > polygonBLimits.max) {
                return null;
            }

            const axisPeneterationDepth: number = Math.min(polygonALimits.max - polygonBLimits.min, polygonBLimits.max - polygonALimits.min);

            if (minPeneterationDepth > axisPeneterationDepth) {
                minPeneterationDepth = axisPeneterationDepth;
                collisionNormal = axis;
            }
        }

        return { objectA: polygonA, objectB: polygonB, peneterationDepth: minPeneterationDepth, collisionNormal: collisionNormal };
    }
    
    private isCircleCircleCollision(circleA: Circle, circleB: Circle): CollisionData | null {
        const radii: number = circleA.radius + circleB.radius;
        const distanceBetweenObjects: Vector = VectorMath.subtract(circleB.position, circleA.position);

        if (distanceBetweenObjects.magnitude() > radii) return null;

        const peneterationDepth: number = radii - distanceBetweenObjects.magnitude()
        const collisionNormal: Vector = distanceBetweenObjects.normalize();

        return { objectA: circleA, objectB: circleB, peneterationDepth: peneterationDepth, collisionNormal: collisionNormal };
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

    private getCircleAxis(circle: Circle, polygon: Polygon): Vector {
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

        return VectorMath.subtract(circle.position, closestVertex).normalize();
    }

    private projectCircleOnAxis(circle: Circle, axis: Vector): Interval {
        const centerProjection = VectorMath.dot(circle.position, axis);

        return {
            min: centerProjection - circle.radius,
            max: centerProjection + circle.radius
        };
    }
}
