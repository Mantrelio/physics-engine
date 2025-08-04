import { Circle } from "../../rigid-bodies/circle";
import { Vector } from "../../vectors/entities/vector";
import { World } from "../../world/world";

const world = new World('gravity');


const circle = new Circle(
        new Vector(150, 0), 
        10, 
        1, 
        new Vector(0, 0),
        new Vector(100, 0)
)

const circle2 = new Circle(
        new Vector(300, 0), 
        10, 
        1, 
        new Vector(0, 0),
        new Vector(100, 70)
)


world.addObject(circle);
world.addObject(circle2);


world.applyGravity();

setTimeout(() => world.run(), 16)
