import { Circle } from "../circle";
import { CircleConfig, PolygonConfig, RectangleConfig, SquareConfig } from "../interfaces/shape-config";
import { Polygon } from "../polygon";
import { Rectangle } from "../rectangle";
import { Square } from "../square";

export class RigidBodyFactory {
    static circle(config: CircleConfig): Circle {
        if (config.radius <= 0) throw new Error('Circle radius must be positive');

        return new Circle(config);
    }

    static polygon(config: PolygonConfig): Polygon {
        if (config.size <= 0) throw new Error('Polygon size must be positive');
        if (config.sideCount < 3) throw new Error('Polygon side count must be greater than 2');

        return new Polygon(config);
    }

    static square(config: SquareConfig): Polygon {
        if (config.size <= 0) throw new Error('Polygon size must be positive');
        return new Square(config);
    }

    static rectangle(config: RectangleConfig) {
        if (config.width <= 0) throw new Error('Rectangle width must be positive');
        if (config.height <= 0) throw new Error('Rectangle height must be positive');
        return new Rectangle(config);
    }
}
