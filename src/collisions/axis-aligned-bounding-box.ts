import { Vector } from "../vectors/entities/vector";

export class AABB {
    constructor(
        public readonly position: Vector,
        public readonly halfWidth: number,
        public readonly halfHeight: number
    ) {}

    public contains(pointPosition: Vector): boolean {
        return (
            pointPosition.x >= this.position.x - this.halfWidth &&
            pointPosition.x <= this.position.x + this.halfWidth &&
            pointPosition.y >= this.position.y - this.halfHeight &&
            pointPosition.y <= this.position.y + this.halfHeight
        );
    }

    public intersects(range: AABB): boolean {
        return !(
            range.position.x - range.halfWidth > this.position.x + this.halfWidth ||
            range.position.x + range.halfWidth < this.position.x - this.halfWidth ||
            range.position.y + range.halfHeight < this.position.y - this.halfHeight ||
            range.position.y - range.halfHeight > this.position.y + this.halfHeight 
        );
    }
}
