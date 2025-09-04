import { BaseShapeRenderData, CircleRenderData, PolygonRenderData } from "../interfaces/render-data.interface";
import { CanvasRenderingContext2D } from "canvas";

export class ShapeDrawer {
    static draw(ctx: CanvasRenderingContext2D, renderData: BaseShapeRenderData): void {
        switch(renderData.type) {
            case 'circle': 
                this.drawCircle(ctx, renderData as CircleRenderData); 
                break;
            case 'polygon':
                this.drawPolygon(ctx, renderData as PolygonRenderData);
                break;
        }
    }

    //TODO: let user choose color and style of rigid bodies
    private static drawCircle(ctx: CanvasRenderingContext2D, data: CircleRenderData): void {
        ctx.beginPath();
        ctx.arc(data.x, data.y, data.radius, 0, Math.PI * 2);
        ctx.fillStyle = data.color || "#000";
        ctx.fill();
        ctx.strokeStyle = data.color || "#000";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    private static drawPolygon(ctx: CanvasRenderingContext2D, data: PolygonRenderData): void {
        ctx.beginPath();
        ctx.moveTo(data.vertices[0].x, data.vertices[0].y);

        for (let i = 0; i < data.vertices.length; i++) {
            ctx.lineTo(data.vertices[i].x, data.vertices[i].y);
        }

        ctx.closePath();
        ctx.fillStyle = data.color || "#000";
        ctx.fill();
        ctx.strokeStyle = data.color || "#000";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
