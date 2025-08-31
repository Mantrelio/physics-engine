import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Circle } from "../rigid-bodies/circle";
import { Polygon } from "../rigid-bodies/polygon";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";
import { AABB } from "./axis-aligned-bounding-box";
import { CollisionResolver } from "./collision-resolver";
import { QuadtreeNode } from "./data-structures/quadtree-node";
import { CollisionData } from "./types/collision-data.type";
import { Edge } from "./types/edge.type";
import { Interval } from "./types/interval.type";

export class CollisionDetection {
    constructor(
        private readonly canvasWidth: number,
        private readonly canvasHeight: number
    ) {}
    //WARNING: COLLISION DOESN'T WORK AS INTENDED PROBABLY BECAUSE OF THE CHANGES TO COLLISION DATA PROPERTY
    private createCollisionGrid(worldObjects: RigidBody[]): QuadtreeNode {
        const rootQuadrantNode: QuadtreeNode = new QuadtreeNode(
            new AABB(
                new Vector(this.canvasWidth / 2, this.canvasHeight / 2),
                this.canvasWidth / 2,
                this.canvasHeight / 2
            )
        );

        worldObjects.forEach(object => {
            rootQuadrantNode.insert(object);
        });

        return rootQuadrantNode;
    }

    public checkForCollision(worldObjects: RigidBody[]): void {
        const rootQuadrantNode: QuadtreeNode = this.createCollisionGrid(worldObjects);

        const iterations: number = 3;

        for (let i = 0; i < iterations; i++) {
            for (const object of worldObjects) {
                const potentialColliders: RigidBody[] = rootQuadrantNode.query(object.aabb);

                for (const collider of potentialColliders) {
                    const collisionData: CollisionData | null =  this.detectCollision(object, collider);

                    if (collider !== object && collisionData) {
                        CollisionResolver.execute(collisionData);
                    }
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
        const axes: Vector[] = [...this.getPolygonAxes(polygon), this.getCircleAxis(circle, polygon)];

        let minPeneterationDepth: number = Infinity;
        let collisionNormal: Vector = VectorMath.zero();
        let referenceBody: Polygon = polygon;
 
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
        
        collisionNormal = this.orientAxis(circle, polygon, collisionNormal);
        const referenceEdge: Edge = this.findReferenceEdge(referenceBody, collisionNormal);

        return {
            referenceBody: referenceBody,
            incidentBody: circle, 
            peneterationDepth: minPeneterationDepth, 
            collisionNormal: collisionNormal, 
            referenceEdge: referenceEdge 
        };
    }

    private isPolygonPolygonCollision(polygonA: Polygon, polygonB: Polygon): CollisionData | null {
        const axes: Vector[] = [...this.getPolygonAxes(polygonA), ...this.getPolygonAxes(polygonB)];

        let minPeneterationDepth: number = Infinity;
        let collisionNormal: Vector = new Vector(0, 0);
        let referenceBody: Polygon = polygonA;

        for (const axis of axes) {
            const polygonALimits: Interval = this.projectPolygonOnAxis(polygonA, axis);
            const polygonBLimits: Interval = this.projectPolygonOnAxis(polygonB, axis);

            if (polygonALimits.max < polygonBLimits.min || polygonALimits.min > polygonBLimits.max) return null;

            const axisPeneterationDepth: number = Math.min(polygonALimits.max - polygonBLimits.min, polygonBLimits.max - polygonALimits.min);

            if (minPeneterationDepth > axisPeneterationDepth) {
                minPeneterationDepth = axisPeneterationDepth;
                collisionNormal = axis;

                if (axes.indexOf(axis) > polygonA.sideCount) {
                    referenceBody = polygonB;
                } else {
                    referenceBody = polygonA;
                }
            }
        }

        collisionNormal = this.orientAxis(polygonA, polygonB, collisionNormal);
        const referenceEdge: Edge = this.findReferenceEdge(referenceBody, collisionNormal);

        return { 
            referenceBody: referenceBody,
            incidentBody: (referenceBody === polygonA) ? polygonB : polygonA,
            peneterationDepth: minPeneterationDepth, 
            collisionNormal: collisionNormal, 
            referenceEdge: referenceEdge 
        };
    }
    
    private isCircleCircleCollision(circleA: Circle, circleB: Circle): CollisionData | null {
        const radii: number = circleA.radius + circleB.radius;
        const distanceBetweenObjects: Vector = VectorMath.subtract(circleB.position, circleA.position);
        const referenceBody: RigidBody = circleA;

        if (distanceBetweenObjects.magnitude() > radii) return null;

        const peneterationDepth: number = radii - distanceBetweenObjects.magnitude();
        const collisionNormal: Vector = distanceBetweenObjects.normalize();

        return { 
            referenceBody: referenceBody, 
            incidentBody: circleB,
            peneterationDepth: peneterationDepth, 
            collisionNormal: collisionNormal
        };
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

    private orientAxis(rigidBodyA: RigidBody, rigidBodyB: RigidBody, axis: Vector): Vector {
        const distance: Vector = VectorMath.subtract(rigidBodyB.position, rigidBodyA.position);

        if (VectorMath.dot(distance, axis) < 0) axis = new Vector(-axis.x, -axis.y);

        return axis;
    }

    private findReferenceEdge(polygon: Polygon, collisionNormal: Vector): Edge {
        const vertices: Vector[] = polygon.worldVertices;
        
        let edgeCornerIndex: number = 0;
        let maxDot: number = -Infinity;

        for (let i = 0; i < polygon.vertices.length; i++) {
            const edge: Vector = VectorMath.subtract(vertices[(i+1) % vertices.length], vertices[i]);
            const edgeNormal: Vector = new Vector(-edge.y, edge.x).normalize();

            const alignment: number = VectorMath.dot(edgeNormal, collisionNormal);

            if(alignment > maxDot) {
                maxDot = alignment;
                edgeCornerIndex = i;
            }
        }

        return { 
            start: vertices[edgeCornerIndex], 
            end: vertices[(edgeCornerIndex + 1) % vertices.length]
        };
    }

    private findIncidentEdge(polygon: Polygon, collisionNormal: Vector): Edge {
        const vertices: Vector[] = polygon.worldVertices;

        let edgeCornerIndex: number = 0;
        let minDot: number = Infinity;

        for (let i = 0; i < polygon.vertices.length; i++) {
            const edge: Vector = VectorMath.subtract(vertices[(i+1) % vertices.length], vertices[i]);
            const edgeNormal: Vector = new Vector(-edge.y, edge.x).normalize();

            const alignment: number = VectorMath.dot(edgeNormal, collisionNormal);

            if (alignment < minDot) {
                minDot = alignment;
                edgeCornerIndex = i;
            }
        }

        return {
            start: vertices[edgeCornerIndex],
            end: vertices[(edgeCornerIndex + 1) % vertices.length]
        };
    }

    private clipIncidentEdge(incidentEdge: Edge, planePoint: Vector, planeNormal: Vector): Vector[] {
        let intersectingPoints: Vector[] = [];

        const startDistanceFromPlane: number = VectorMath.dot(planeNormal, VectorMath.subtract(incidentEdge.start, planePoint));
        const endDistanceFromPlane: number = VectorMath.dot(planeNormal, VectorMath.subtract(incidentEdge.end, planePoint));

        const isStartInsidePlane: boolean = startDistanceFromPlane >= 0;
        const isEndInsidePlane: boolean = endDistanceFromPlane >= 0;

        if (isStartInsidePlane) intersectingPoints.push(incidentEdge.start);
        if (isEndInsidePlane) intersectingPoints.push(incidentEdge.end);
        
        if (startDistanceFromPlane !== endDistanceFromPlane) {
            const t: number = startDistanceFromPlane / (startDistanceFromPlane - endDistanceFromPlane);
            const intersection: Vector = VectorMath.add(
                incidentEdge.start,
                VectorMath.multiply(VectorMath.subtract(incidentEdge.end, incidentEdge.start), t)
            );
            intersectingPoints.push(intersection);
        }

        return intersectingPoints;
    }

    private projectOntoReferenceFace(point: Vector, referencePoint: Vector, referenceNormal: Vector): Vector {
        const distance: number = VectorMath.dot(
            VectorMath.subtract(point, referencePoint),
            referenceNormal
        );

        return VectorMath.subtract(
            point,
            VectorMath.multiply(referenceNormal, distance)
        );
    }
    
}
