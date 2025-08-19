import { QuadtreeNode } from "../../collisions/data-structures/quadtree-node";
import { AABBRenderData } from "../interfaces/render-data.interface";

export class GizmoDrawer {
    static drawAABB(ctx: CanvasRenderingContext2D, data: AABBRenderData): void {
        ctx.save();
        ctx.strokeStyle = data.color || 'rgba(19, 148, 2, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            data.x - data.halfWidth,
            data.y - data.halfHeight,
            data.halfWidth * 2,
            data.halfHeight * 2
        );
        ctx.restore();
    }

    static drawCollisionGrid(ctx: CanvasRenderingContext2D, quadtreeNode: QuadtreeNode): void {
        GizmoDrawer.drawAABB(ctx, {
            x: quadtreeNode.boundary.position.x,
            y: quadtreeNode.boundary.position.y,
            halfWidth: quadtreeNode.boundary.halfWidth,
            halfHeight: quadtreeNode.boundary.halfHeight,
            color: 'rgba(0, 0, 0, 1)'
        });

        for (const child of quadtreeNode.childNodes) {
            GizmoDrawer.drawCollisionGrid(ctx, child);
        }
    }
}
