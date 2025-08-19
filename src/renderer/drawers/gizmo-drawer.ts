import { AABBRenderData } from "../interfaces/render-data.interface";

export class GizmoDrawer {
    static drawAABB(ctx: CanvasRenderingContext2D, data: AABBRenderData): void {
        ctx.save();
        ctx.strokeStyle = 'rgba(19, 148, 2, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            data.x - data.halfWidth,
            data.y - data.halfHeight,
            data.halfWidth * 2,
            data.halfHeight * 2
        );
        ctx.restore();
    }
}
