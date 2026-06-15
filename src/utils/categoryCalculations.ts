/**
 * @fileoverview Individual category carbon calculation formulas.
 * @module utils/categoryCalculations
 */

import { FuelType, TransportMode } from '../types';
import type {
  TransportProfile,
  DietProfile,
  EnergyProfile,
  ShoppingProfile,
} from '../types';
import {
  TRANSPORT_FACTOR_KG_PER_KM,
  WEEKS_PER_YEAR,
  MONTHS_PER_YEAR,
  DIET_ANNUAL_KG,
  KG_CO2_PER_KWH,
  KG_CO2_PER_THERM,
  KG_CO2_PER_USD,
} from '../constants/emissionFactors';

/**
 * Calculate annual transport emissions.
 * @param profile - Transport lifestyle inputs.
 * @returns Annual kg CO₂e from transportation.
 */
export function calculateTransportEmissions(profile: TransportProfile): number {
  let factor = TRANSPORT_FACTOR_KG_PER_KM[profile.primaryMode];
  if (profile.primaryMode === TransportMode.Car) {
    if (profile.fuelType === FuelType.Diesel) {
      factor = 0.24;
    } else if (profile.fuelType === FuelType.Hybrid) {
      factor = 0.12;
    } else if (profile.fuelType === FuelType.Electric) {
      factor = 0.05;
    } else {
      factor = 0.21; // Gasoline
    }
  }

  const commuteAnnualKm = profile.weeklyDistanceKm * WEEKS_PER_YEAR;
  const commuteEmissions = commuteAnnualKm * factor;

  // Flights: flightsPerYear * averageFlightHours * 250 kg/hour
  const flightEmissions = profile.flightsPerYear * profile.averageFlightHours * 250;

  return Math.round(commuteEmissions + flightEmissions);
}

/**
 * Calculate annual diet-related emissions.
 * @param profile - Diet lifestyle inputs.
 * @returns Annual kg CO₂e from diet.
 */
export function calculateDietEmissions(profile: DietProfile): number {
  const base = DIET_ANNUAL_KG[profile.dietType];
  const localReduction = (profile.localFoodPercentage / 100) * 0.1;
  const wasteIncrease = (profile.foodWastePercentage / 100) * 0.25;
  return Math.round(base * (1 - localReduction + wasteIncrease));
}

/**
 * Calculate annual household energy emissions.
 * Splits by electricity grid mix and natural gas usage.
 * @param profile - Energy household inputs.
 * @returns Annual kg CO₂e from home energy, divided by household size.
 */
export function calculateEnergyEmissions(profile: EnergyProfile): number {
  const electricityAnnual = profile.monthlyElectricityKwh * MONTHS_PER_YEAR * KG_CO2_PER_KWH;
  const gasAnnual = profile.monthlyGasUsageTherms * MONTHS_PER_YEAR * KG_CO2_PER_THERM;
  const total = electricityAnnual + gasAnnual;
  const renewableFactor = 1 - profile.renewablePercentage / 100;
  const household = profile.householdSize <= 0 ? 1 : profile.householdSize;
  return Math.round((total * renewableFactor) / household);
}

/**
 * Calculate annual shopping / consumption emissions.
 * @param profile - Shopping consumption habits.
 * @returns Annual kg CO₂e from consumer spending.
 */
export function calculateShoppingEmissions(profile: ShoppingProfile): number {
  const fashionMultipliers = { never: 0.5, rarely: 0.8, sometimes: 1.0, often: 1.5 } as const;
  const fashionMultiplier = fashionMultipliers[profile.fastFashionFrequency] ?? 1.0;

  const baseSpendingEmissions =
    profile.monthlySpendingUsd * MONTHS_PER_YEAR * KG_CO2_PER_USD * fashionMultiplier;
  const electronicsEmissions = profile.electronicsPerYear * 300;
  const totalEmissions = baseSpendingEmissions + electronicsEmissions;

  const recyclingReduction = 1 - (profile.recyclingRate / 100) * 0.15;
  return Math.round(totalEmissions * recyclingReduction);
}
