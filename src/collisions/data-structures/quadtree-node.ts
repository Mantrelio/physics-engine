import { RigidBody } from "../../rigid-bodies/abstracts/rigid-body.abstract";
import { Vector } from "../../vectors/entities/vector";

export class QuadtreeNode {
    public childNodes: QuadtreeNode[] = [];
    private objectThreshold: number = 4; 
    public pointData: RigidBody[] = [];


    constructor(
        private readonly topLeftCornerPosition: Vector,
        private readonly width: number,
        private readonly height: number
    ) {}
    
    public insert(rigidBody: RigidBody): void {
        if (!this.isPointInQuadrant(rigidBody.position)) {
            return;
        }

        if (this.hasChildren()) {
            this.insertToChildren(rigidBody);
            return;
        }

        this.pointData.push(rigidBody);

        if (this.isObjectThresholdMet()) {
            this.split();
            this.redistributeDataToChildren();
        }
    }

    private split(): void {
        const topLeftQuad = new QuadtreeNode(
            new Vector(this.topLeftCornerPosition.x, this.topLeftCornerPosition.y), 
            this.width / 2, 
            this.height / 2
        );   
        const topRightQuad = new QuadtreeNode(
            new Vector(this.topLeftCornerPosition.x + this.width / 2, this.topLeftCornerPosition.y), 
            this.width / 2, 
            this.height / 2
        );   
        const bottomLeftQuad = new QuadtreeNode(
            new Vector(this.topLeftCornerPosition.x, this.topLeftCornerPosition.y + this.height / 2), 
            this.width / 2, 
            this.height / 2
        );    
        const bottomRightQuad = new QuadtreeNode(
            new Vector(this.topLeftCornerPosition.x + this.width / 2, this.topLeftCornerPosition.y + this.height / 2), 
            this.width / 2, 
            this.height / 2
        ); 

        this.childNodes.push(topLeftQuad);
        this.childNodes.push(topRightQuad);
        this.childNodes.push(bottomLeftQuad);
        this.childNodes.push(bottomRightQuad);
    }

    private isObjectThresholdMet(): boolean {
        return this.pointData.length >= this.objectThreshold;
    }

    private redistributeDataToChildren(): void {
        for(const point of this.pointData) {
            this.insertToChildren(point);
        }

        this.pointData = [];
    }

    private insertToChildren(point: RigidBody) {
        for(let i = 0; i < 4; i++) {
            this.childNodes[i].insert(point);
        }
    }

    private isPointInQuadrant(pointPosition: Vector): boolean {
        return pointPosition.x >= this.topLeftCornerPosition.x && 
            pointPosition.x <= this.topLeftCornerPosition.x + this.width &&
            pointPosition.y >= this.topLeftCornerPosition.y &&
            pointPosition.y <= this.topLeftCornerPosition.y + this.height;
    }

    public hasChildren(): boolean {
        return this.childNodes.length > 0;
    }
}
