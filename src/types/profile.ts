/**
 * @fileoverview User profile interfaces and average defaults.
 * @module types/profile
 */

import { TransportMode, FuelType, DietType } from './common';

/** Transport-related lifestyle inputs */
export interface TransportProfile {
  readonly primaryMode: TransportMode;
  readonly fuelType: FuelType;
  readonly weeklyDistanceKm: number;
  readonly flightsPerYear: number;
  readonly averageFlightHours: number;
}

/** Diet-related lifestyle inputs */
export interface DietProfile {
  readonly dietType: DietType;
  readonly localFoodPercentage: number;
  readonly foodWastePercentage: number;
}

/** Energy-related household inputs */
export interface EnergyProfile {
  readonly monthlyElectricityKwh: number;
  readonly monthlyGasUsageTherms: number;
  readonly renewablePercentage: number;
  readonly householdSize: number;
}

/** Shopping and consumption habits */
export interface ShoppingProfile {
  readonly monthlySpendingInr: number;
  readonly fastFashionFrequency: 'never' | 'rarely' | 'sometimes' | 'often';
  readonly electronicsPerYear: number;
  readonly recyclingRate: number;
}

/** Complete user lifestyle profile */
export interface UserProfile {
  readonly name?: string;
  readonly emailHash?: string;
  readonly transport: TransportProfile;
  readonly diet: DietProfile;
  readonly energy: EnergyProfile;
  readonly shopping: ShoppingProfile;
}

/** Default transport profile values */
export const DEFAULT_TRANSPORT: TransportProfile = {
  primaryMode: TransportMode.Car,
  fuelType: FuelType.Gasoline,
  weeklyDistanceKm: 200,
  flightsPerYear: 2,
  averageFlightHours: 4,
};

/** Default diet profile values */
export const DEFAULT_DIET: DietProfile = {
  dietType: DietType.Average,
  localFoodPercentage: 30,
  foodWastePercentage: 20,
};

/** Default energy profile values */
export const DEFAULT_ENERGY: EnergyProfile = {
  monthlyElectricityKwh: 900,
  monthlyGasUsageTherms: 50,
  renewablePercentage: 0,
  householdSize: 3,
};

/** Default shopping profile values */
export const DEFAULT_SHOPPING: ShoppingProfile = {
  monthlySpendingInr: 15000,
  fastFashionFrequency: 'sometimes',
  electronicsPerYear: 2,
  recyclingRate: 30,
};

/** Default user profile with average values */
export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  emailHash: '',
  transport: DEFAULT_TRANSPORT,
  diet: DEFAULT_DIET,
  energy: DEFAULT_ENERGY,
  shopping: DEFAULT_SHOPPING,
};
