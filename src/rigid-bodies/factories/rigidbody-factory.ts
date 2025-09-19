import { Circle } from "../circle";
import { CircleConfig, PolygonConfig } from "../interfaces/shape-config";
import { Polygon } from "../polygon";

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
}
