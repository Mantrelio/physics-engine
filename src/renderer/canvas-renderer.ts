import { QuadtreeNode } from "../collisions/data-structures/quadtree-node.js";
import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.js";
import { WorldRenderingOptions } from "../world/world-rendering-options.ts/world-rendering-options.js";
import { GizmoDrawer } from "./drawers/gizmo-drawer.js";
import { ShapeDrawer } from "./drawers/shape-drawer.js";

export class CanvasRenderer {
    constructor(
        private ctx: CanvasRenderingContext2D
    ) {}

    public render(objects: RigidBody[], collisionGridRootQuadrant: QuadtreeNode, worldOptions?: WorldRenderingOptions): void {
        this.clear();
        
        objects.forEach(object => { 
            ShapeDrawer.draw(this.ctx, object.getRenderData());

            if (worldOptions?.visibleAABB) {
                GizmoDrawer.drawAABB(this.ctx, object.getAABBRenderData());
            }
        });

        if (worldOptions?.visibleCollisionGrid && collisionGridRootQuadrant) {
            GizmoDrawer.drawCollisionGrid(this.ctx, collisionGridRootQuadrant)
        }
    }

    private clear(): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
