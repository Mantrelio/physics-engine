import { Circle } from "../circle";
import { CircleConfig, RectangleConfig, SquareConfig } from "../interfaces/shape-config";
import { Polygon } from "../abstracts/polygon";
import { Rectangle } from "../rectangle";
import { Square } from "../square";

export class RigidBodyFactory {
    static circle(config: CircleConfig): Circle {
        if (config.radius <= 0) throw new Error('Circle radius must be positive');

        return new Circle(config);
    }

    static square(config: SquareConfig): Polygon {
        if (config.size <= 0) throw new Error('Polygon size must be positive');
        return new Square(config);
    }

    static rectangle(config: RectangleConfig): Rectangle {
        if (config.width <= 0) throw new Error('Rectangle width must be positive');
        if (config.height <= 0) throw new Error('Rectangle height must be positive');
        return new Rectangle(config);
    }
}
