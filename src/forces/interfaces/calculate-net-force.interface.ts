import { Force } from "../entities/force";

export interface CalculateNetForceInterface {
    calculate(forces: Force[]): Force;
}
