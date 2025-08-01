import { Vector } from "../vectors/vector";
import { VectorMath } from "../vectors/vector-math";
import { Force } from "./force";
import { CalculateNetForceInterface } from "./interfaces/calculate-net-force.interface";

export class NetForceCalculator implements CalculateNetForceInterface{
    calculate(forces: Force[]): Force {
        const netForceVector: Vector = VectorMath.add(...forces); 
        return new Force(netForceVector.x, netForceVector.y);
    }
}
