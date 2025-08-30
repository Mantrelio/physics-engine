import { Circle } from "../../rigid-bodies/circle";
import { Polygon } from "../../rigid-bodies/polygon";
import { Square } from "../../rigid-bodies/square";
import { Vector } from "../../vectors/entities/vector";
import { World } from "../../world/world";

const world = new World(1.225, 'gravity');

for(let i = 0; i < 50; i++) {
	const randomX = Math.random() * world.canvasHeight;
	const randomY = Math.random() * world.canvasWidth;
	const randomX2 = Math.random() * world.canvasHeight;
	const randomY2 = Math.random() * world.canvasWidth;
	const randomMass = 5;
	const randomRadius = 50;
	const randomSize = 20;
 	const randomXVelocity = 1;
	const randomYVelocity = 0;

	const square = new Square(randomSize, randomMass, new Vector(randomX, 300), new Vector(0, 0));
	const rectangle2 = new Polygon(4, 20, randomMass, new Vector(randomX2, 300), new Vector(2, randomYVelocity));
	const rectangle3 = new Polygon(3, 20, randomMass, new Vector(randomX2, 300), new Vector(2, randomYVelocity));
	const rectangle4 = new Polygon(5, 20, randomMass, new Vector(randomX2, 300), new Vector(2, randomYVelocity));
	const circle = new Circle(new Vector(randomX, 500), randomRadius, randomMass, new Vector(-2, randomYVelocity));
	world.addObject(rectangle2);
	world.addObject(rectangle3);
	world.addObject(square);
	world.addObject(rectangle4);
	world.addObject(square);
}



world.run();
