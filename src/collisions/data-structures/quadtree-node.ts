import { RigidBody } from "../../rigid-bodies/abstracts/rigid-body.abstract";
import { Vector } from "../../vectors/entities/vector";
import { AABB } from "../axis-aligned-bounding-box";

export class QuadtreeNode {
    public childNodes: QuadtreeNode[] = [];
    public points: RigidBody[] = [];

    private objectThreshold: number = 4; 
    private isLeaf: boolean = true;

    constructor(
        public readonly boundary: AABB
    ) {}

    public query(range: AABB): RigidBody[] {
        let foundPoints: RigidBody[] = [];

        if (!this.boundary.intersects(range)) return foundPoints;
        
        for (const point of this.points) {
            if (range.intersects(point.aabb)) foundPoints.push(point);
        }

        if (this.isLeaf) return foundPoints;

        for (const childNode of this.childNodes) {
            foundPoints.push(...childNode.query(range));
        }

        return foundPoints;
    }
    
    public insert(point: RigidBody): void {
        if (!this.boundary.contains(point.position)) return;
        
        if (this.points.length < this.objectThreshold && this.isLeaf) {
            this.points.push(point);
            return;
        }

        if (this.isLeaf) this.subdivide();

        this.insertToChildren(point);
    }

    private subdivide(): void {
        const { position, halfWidth, halfHeight } = this.boundary;

        const topLeftQuad: QuadtreeNode = new QuadtreeNode(
            new AABB(
                new Vector(position.x - halfWidth / 2, position.y - halfHeight / 2), 
                halfWidth / 2, 
                halfHeight / 2
            )
        );
        const topRightQuad: QuadtreeNode = new QuadtreeNode(
           new AABB(
                new Vector(position.x + halfWidth / 2, position.y - halfHeight / 2),
                halfWidth / 2,
                halfHeight / 2
            )
        );
        const bottomLeftQuad: QuadtreeNode = new QuadtreeNode(
            new AABB(
                new Vector(position.x - halfWidth / 2, position.y + halfHeight / 2), 
                halfWidth / 2, 
                halfHeight / 2
            )
        );    
        const bottomRightQuad: QuadtreeNode = new QuadtreeNode(
            new AABB(
                new Vector(position.x + halfWidth / 2, position.y + halfHeight / 2), 
                halfWidth / 2, 
                halfHeight / 2
            )
        );    

        this.childNodes.push(topLeftQuad, topRightQuad, bottomLeftQuad, bottomRightQuad);
        this.isLeaf = false;
        
        for (const point of this.points) {
            this.insertToChildren(point);
        }

        this.points = [];
    }

    private insertToChildren(point: RigidBody): void {
        for (let i = 0; i < 4; i++) {
            this.childNodes[i].insert(point);
        }
    }
}
