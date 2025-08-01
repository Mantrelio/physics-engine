import { Vector } from "../vectors/entities/vector";
import { VectorMath } from "../vectors/vector-math";
import { Force } from "./entities/force";
import { CalculateNetForceInterface } from "./interfaces/calculate-net-force.interface";

export class NetForceCalculator implements CalculateNetForceInterface{
    calculate(forces: Force[]): Force {
        const netForceVector: Vector = VectorMath.add(...forces); 
        return new Force(netForceVector.x, netForceVector.y);
    }
}
