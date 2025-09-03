import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Circle } from "../rigid-bodies/circle";
import { Polygon } from "../rigid-bodies/polygon";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";
import { AABB } from "./axis-aligned-bounding-box";
import { CollisionResolver } from "./collision-resolver";
import { QuadtreeNode } from "./data-structures/quadtree-node";
import { CollisionData } from "./types/collision-data.type";
import { ContactPoint } from "./types/contact-point";
import { Edge } from "./types/edge.type";
import { Interval } from "./types/interval.type";
import { Plane } from "./types/plane.type";

export class CollisionDetection {
    public rootQuadrantNode!: QuadtreeNode;

    constructor(
        private readonly canvasWidth: number,
        private readonly canvasHeight: number
    ) {}

    private createCollisionGrid(worldObjects: RigidBody[]): QuadtreeNode {
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

        return this.rootQuadrantNode;
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

        const contactPoint: ContactPoint = this.findPolygonCircleContactPoints(polygon, circle);

        return {
            objectA: circle,
            objectB: polygon, 
            penetrationDepth: minPeneterationDepth, 
            collisionNormal: collisionNormal, 
            contactPoints: [contactPoint]
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

        const incidentBody: Polygon = (referenceBody === polygonA) ? polygonB: polygonA;

        const contactPoints: ContactPoint[] = this.getPolygonPolygonContactPoints(incidentBody, referenceBody, collisionNormal);

        return { 
            objectA: polygonA,
            objectB: polygonB,
            penetrationDepth: minPeneterationDepth, 
            collisionNormal: collisionNormal, 
            contactPoints: contactPoints
        };
    }
    
    private isCircleCircleCollision(circleA: Circle, circleB: Circle): CollisionData | null {
        const radii: number = circleA.radius + circleB.radius;
        const distanceBetweenObjects: Vector = VectorMath.subtract(circleB.position, circleA.position);

        if (distanceBetweenObjects.magnitude() > radii) return null;

        const peneterationDepth: number = radii - distanceBetweenObjects.magnitude();
        const collisionNormal: Vector = distanceBetweenObjects.normalize();

        const contactPoint: ContactPoint = this.findCircleCircleContactPoints(circleA, circleB);

        return { 
            objectA: circleA, 
            objectB: circleB,
            penetrationDepth: peneterationDepth, 
            collisionNormal: collisionNormal,
            contactPoints: [contactPoint]
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
        const normalizedAxis = axis.normalize();
        
        return normalizedAxis;
    }

    private findReferenceEdge(referenceBody: Polygon, collisionNormal: Vector): Edge {
        const vertices: Vector[] = referenceBody.worldVertices;
        
        let edgeCornerIndex: number = 0;
        let maxDot: number = -Infinity;

        for (let i = 0; i < referenceBody.vertices.length; i++) {
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

    private getPolygonPolygonContactPoints(incidentBody: Polygon, referenceBody: Polygon, collisionNormal: Vector): ContactPoint[] {
        const referenceEdge: Edge = this.findReferenceEdge(referenceBody, collisionNormal);
        const incidentEdge: Edge = this.findIncidentEdge(incidentBody, collisionNormal);

        const [leftPlane, rightPlane] = this.getSidePlanes(referenceEdge, collisionNormal);

        let contactPoints: ContactPoint[] = this.clipIncidentEdge(incidentEdge, leftPlane);

        if (contactPoints.length >= 2) {
            const clippedIncidentEdge: Edge = { start: contactPoints[0].position, end: contactPoints[1].position } 
            contactPoints = this.clipIncidentEdge(clippedIncidentEdge, rightPlane);
        }

        const projectedContactPoints: ContactPoint[] = contactPoints.map(contactPoint => 
            this.projectPointOnReferenceFace(contactPoint, referenceEdge.start, collisionNormal)
        )

        return projectedContactPoints;
    }

    private findIncidentEdge(incidentPolygon: Polygon, collisionNormal: Vector): Edge {
        const vertices: Vector[] = incidentPolygon.worldVertices;

        let edgeCornerIndex: number = 0;
        let minDot: number = Infinity;

        for (let i = 0; i < incidentPolygon.vertices.length; i++) {
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

    private getSidePlanes(referenceEdge: Edge, collisionNormal: Vector): Plane[] {
        const tangent: Vector = VectorMath.subtract(referenceEdge.end, referenceEdge.start).normalize();

        let inwardNormal: Vector = new Vector(-tangent.y, tangent.x);

        if (VectorMath.dot(inwardNormal, collisionNormal) < 0) {
            inwardNormal = VectorMath.multiply(inwardNormal, -1);
        }

        const leftPlane: Plane = { point: referenceEdge.start, normal: inwardNormal };
        const rightPlane: Plane = { point: referenceEdge.end, normal: VectorMath.multiply(inwardNormal, -1) };

        return [leftPlane, rightPlane];
    }

    private clipIncidentEdge(incidentEdge: Edge, plane: Plane): ContactPoint[] {
        let intersectingPoints: ContactPoint[] = [];

        const startDistanceFromPlane: number = VectorMath.dot(plane.normal, VectorMath.subtract(incidentEdge.start, plane.point));
        const endDistanceFromPlane: number = VectorMath.dot(plane.normal, VectorMath.subtract(incidentEdge.end, plane.point));

        const isStartInsidePlane: boolean = startDistanceFromPlane >= 0;
        const isEndInsidePlane: boolean = endDistanceFromPlane >= 0;

        if (isStartInsidePlane) intersectingPoints.push({ position: incidentEdge.start });
        if (isEndInsidePlane) intersectingPoints.push({ position: incidentEdge.end });
        
        if (startDistanceFromPlane !== endDistanceFromPlane) {
            const t: number = startDistanceFromPlane / (startDistanceFromPlane - endDistanceFromPlane);
            const intersection: Vector = VectorMath.add(
                incidentEdge.start,
                VectorMath.multiply(VectorMath.subtract(incidentEdge.end, incidentEdge.start), t)
            );
            intersectingPoints.push({ position: intersection });
        }

        return intersectingPoints;
    }

    private projectPointOnReferenceFace(point: ContactPoint, referenceEdgeStartingPoint: Vector, collisionNormal: Vector): ContactPoint {
        const distance: number = VectorMath.dot(
            VectorMath.subtract(point.position, referenceEdgeStartingPoint),
            collisionNormal
        );

        const contactPointPosition: Vector = VectorMath.subtract(
            point.position,
            VectorMath.multiply(collisionNormal, distance)
        );

        return {
            position: contactPointPosition
        };
    }

    private findCircleCircleContactPoints(circleA: Circle, circleB: Circle): ContactPoint {
        const directionFromCenterToCenter: Vector = VectorMath.subtract(circleB.position, circleA.position).normalize();

        const contactPointPosition: Vector = VectorMath.add(
            circleA.position, 
            VectorMath.multiply(directionFromCenterToCenter, circleA.radius)
        );

        return { 
            position: contactPointPosition
        };
    }

    private findPolygonCircleContactPoints(polygon: Polygon, circle: Circle): ContactPoint {
        let closestPointToCircleCenter: Vector = VectorMath.zero();
        let minMagnitudeSquared = Infinity;

        const polygonWorldVertices: Vector[] = polygon.worldVertices;

        for (let i = 0; i < polygonWorldVertices.length; i++) {
            const polygonEdge: Edge = {
                start: polygonWorldVertices[i],
                end: polygonWorldVertices[(i + 1) % polygonWorldVertices.length]
            }
            const closestPointOnEdge: Vector = this.closestPointOnEdgeFromCircleCenter(circle, polygonEdge);
            
            const pointToCircleVector: Vector = VectorMath.subtract(circle.position, closestPointOnEdge);
            const magnitudeSquared: number = pointToCircleVector.magnitudeSquared();

            if (magnitudeSquared < minMagnitudeSquared) {
                minMagnitudeSquared = magnitudeSquared;
                closestPointToCircleCenter = closestPointOnEdge;
            }
        }

        return {
            position: closestPointToCircleCenter
        };
    }

    private closestPointOnEdgeFromCircleCenter(circle: Circle, edge: Edge): Vector {
        const edgeVector: Vector = VectorMath.subtract(edge.end, edge.start);
        const edgeStartToCircleCenterVector: Vector = VectorMath.subtract(circle.position, edge.start);

        const projection: number = VectorMath.dot(edgeVector, edgeStartToCircleCenterVector);

        let t = projection / edgeVector.magnitudeSquared();

        if (t < 0) t = 0;
        else if (t > 1) t = 1;

        const edgeStartToPointSegmentVector: Vector = VectorMath.multiply(edgeVector, t);
        const pointSegmentWorldVector: Vector = VectorMath.add(edge.start, edgeStartToPointSegmentVector);

        return pointSegmentWorldVector;
    }
}
