import { CanvasRenderer } from "../renderer/canvas-renderer";
import { RigidBody } from "../rigid-bodies/abstracts/rigid-body.abstract";

export class World {
    private objects: RigidBody[] = [];
    private renderer: CanvasRenderer;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) throw new Error(`Canvas with id '${canvasId}' not found`);
        

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context from canvas');
        
        this.renderer = new CanvasRenderer(ctx);
    }

    addObject(object: RigidBody): void {
        this.objects.push(object);
    }
    //TODO: seperate physics engine and renderer run time, physics should run at a higher frequency
    update(deltaTime: number): void {
        this.objects.forEach(object => object.updatePosition(deltaTime));
        
        this.renderer.render(this.objects);
    }
}
