import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";
import { ShapeDrawer } from "./shape-drawer";

export class CanvasRenderer {
    constructor(
        private ctx: CanvasRenderingContext2D
    ) {}

    public render(objects: RigidBody[]): void {
        this.clear();
        
        objects.forEach(object => 
            ShapeDrawer.draw(this.ctx, object.getRenderData())
        );
    }

    private clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
