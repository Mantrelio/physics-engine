import { Vector } from "../../vectors/entities/vector";
import { AABB } from "../axis-aligned-bounding-box";
import { Point } from "./point.interface";

export class QuadtreeNode {
    public childNodes: QuadtreeNode[] = [];
    public points: Point[] = [];

    private objectThreshold: number = 4; 
    private isLeaf: boolean = true;

    constructor(
        private readonly boundary: AABB
    ) {}

    public query(range: AABB): Point[] {
        let foundPoints: Point[] = [];

        if (this.boundary.intersects(range)) return foundPoints;
        
        for (const point of this.points) {
            if (range.contains(point.position)) foundPoints.push(point);
        }

        if (this.childNodes.length === 0) return foundPoints;

        for (const childNode of this.childNodes) {
            foundPoints.push(...childNode.query(range));
        }

        return foundPoints;
    }
    
    public insert(point: Point): void {
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
        const bottomLeftQuad = new QuadtreeNode(
            new AABB(
                new Vector(position.x - halfWidth / 2, position.y + halfHeight / 2), 
                halfWidth / 2, 
                halfHeight / 2
            )
        );    
        const bottomRightQuad = new QuadtreeNode(
            new AABB(
                new Vector(position.x + halfWidth / 2, position.y + halfHeight / 2), 
                halfWidth / 2, 
                halfHeight / 2
            )
        );    

        this.childNodes.push(topLeftQuad, topRightQuad, bottomLeftQuad, bottomRightQuad);
        this.isLeaf = false;
    }

    private insertToChildren(point: Point) {
        for (let i = 0; i < 4; i++) {
            this.childNodes[i].insert(point);
        }
    }
}
