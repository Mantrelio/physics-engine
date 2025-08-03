import { BaseRenderData, CircleRenderData } from "./interfaces/render-data.interface";

export class ShapeDrawer {
    static draw(ctx: CanvasRenderingContext2D, renderData: BaseRenderData): void {
        switch(renderData.type) {
            case 'circle': 
                this.drawCircle(ctx, renderData as CircleRenderData); 
                break;
        }
    }

    //TODO: let user choose color and style of rigid bodies
    private static drawCircle(ctx: CanvasRenderingContext2D, data: CircleRenderData): void {
        ctx.beginPath();
        ctx.arc(data.x, data.y, data.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#3498db';
        ctx.fill();
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
