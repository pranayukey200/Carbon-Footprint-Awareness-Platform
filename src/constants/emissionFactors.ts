/**
 * @fileoverview Constants and emission factors for carbon calculations.
 * Derived from EPA eGRID, EPA GHG Calculator, and DEFRA 2023.
 * @module constants/emissionFactors
 */

import { TransportMode, DietType, CategoryType } from '../types';

/** Transport emission factors (kg CO₂ per passenger-km) */
export const TRANSPORT_FACTOR_KG_PER_KM: Record<TransportMode, number> = {
  [TransportMode.Car]: 0.21,
  [TransportMode.PublicTransit]: 0.089,
  [TransportMode.Bicycle]: 0,
  [TransportMode.Walking]: 0,
  [TransportMode.Motorcycle]: 0.12,
  [TransportMode.ElectricCar]: 0.05,
};

/** Number of weeks in a single calendar year */
export const WEEKS_PER_YEAR = 52;

/** Number of months in a single calendar year */
export const MONTHS_PER_YEAR = 12;

/** Diet emission factors (kg CO₂e per year per diet type) */
export const DIET_ANNUAL_KG: Record<DietType, number> = {
  [DietType.MeatHeavy]: 3300,
  [DietType.Average]: 2500,
  [DietType.Vegetarian]: 1700,
  [DietType.Vegan]: 1500,
};

/** Energy emission factors */
export const KG_CO2_PER_KWH = 0.417; // US Grid average
export const KG_CO2_PER_THERM = 5.3;  // Natural gas

/** Consumer spending carbon intensity factor (kg CO₂ per USD) */
export const KG_CO2_PER_USD = 0.7;

/** Global and regional per-capita benchmarks (kg CO₂e/year) */
export const WORLD_AVG_KG = 4000;
export const US_AVG_KG = 16000;
export const EU_AVG_KG = 6500;
export const INDIA_AVG_KG = 1900; // Localized Indian per-capita average

/** Category-specific benchmarks for average household (kg CO₂e/year) */
export const CATEGORY_AVERAGES: Record<CategoryType, number> = {
  [CategoryType.Transport]: 2000,
  [CategoryType.Diet]: 2000,
  [CategoryType.Energy]: 3000,
  [CategoryType.Shopping]: 2000,
};
