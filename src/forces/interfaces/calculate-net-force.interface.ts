import { Force } from "../force";

export interface CalculateNetForceInterface {
    calculate(forces: Force[]): Force;
}
