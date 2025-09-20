import { RigidBody } from "../rigid-bodies/abstracts/rigid-body";
import { World } from "../world/world";
import { WorldOptions } from "./interfaces/physics-engine-options";

export class PhysicsEngine {
    private world: World;

    constructor(options: WorldOptions) {
        this.world = new World(options);
    }

    public addObject(rigidBody: RigidBody): void {
        this.world.addObject(rigidBody);
    }

    public removeBody(body: RigidBody): void {
        this.world.removeObject(body);
    }

    public start(): void {
        this.world.run();
    }

    public get objects(): RigidBody[] {
        return this.world.objectList;
    }
}
