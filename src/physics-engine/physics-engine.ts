import { World } from "../world/world";
import { WorldOptions } from "./interfaces/physics-engine-options";

export class PhysicsEngine {
    public world: World;

    constructor(options: WorldOptions) {
        this.world = new World(options);
    }
}
