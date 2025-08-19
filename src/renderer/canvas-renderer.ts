import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { WorldOptions } from "../world/types/world-options";
import { GizmoDrawer } from "./drawers/gizmo-drawer";
import { ShapeDrawer } from "./drawers/shape-drawer";

export class CanvasRenderer {
    constructor(
        private ctx: CanvasRenderingContext2D
    ) {}

    public render(objects: RigidBody[], worldOptions?: WorldOptions): void {
        this.clear();
        
        objects.forEach(object => { 
            ShapeDrawer.draw(this.ctx, object.getRenderData());
            if (worldOptions?.visibleAABB) {
                GizmoDrawer.drawAABB(this.ctx, object.getAABBRenderData())
            }
        });
    }

    private clear(): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
