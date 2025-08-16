import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { Circle } from "../rigid-bodies/circle";
import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";
import { QuadtreeNode } from "./data-structures/quadtree-node";

export class CollisionDetection {
    private rootQuadrantNode: QuadtreeNode;

    constructor(
        private readonly canvasWidth: number,
        private readonly canvasHeight: number
    ) {
        this.rootQuadrantNode = new QuadtreeNode(new Vector(0, 0), this.canvasWidth, this.canvasHeight);
    }

    private createCollisionGrid(worldObjects: RigidBody[]) {
        worldObjects.forEach(object => {
            this.rootQuadrantNode.insert(object);
        });
    }

    public checkForCollision(worldObjects: RigidBody[]) {
        for(let i = 0; i < worldObjects.length; i++) {
            for(let j = i + 1; j < worldObjects.length; j++) {
                if (this.areColliding(worldObjects[i], worldObjects[j])) {
                    this.resolveCollision(worldObjects[i], worldObjects[j]);
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
