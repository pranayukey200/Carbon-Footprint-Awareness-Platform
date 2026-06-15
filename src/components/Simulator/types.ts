import { TransportMode, FuelType, DietType } from '../../types';

export interface SimState {
  readonly dist: number;
  readonly mode: TransportMode;
  readonly flights: number;
  readonly flightHours: number;
  readonly fuel: FuelType;
  readonly diet: DietType;
  readonly localFood: number;
  readonly foodWaste: number;
  readonly elec: number;
  readonly gas: number;
  readonly renew: number;
  readonly houseSize: number;
  readonly spend: number;
  readonly fashion: 'never' | 'rarely' | 'sometimes' | 'often';
  readonly electronics: number;
  readonly recycle: number;
}
