/**
 * @fileoverview Comprehensive unit tests for carbon calculation engine.
 * Tests all emission calculation functions against known EPA/DEFRA values.
 * @module test/carbonCalculations.test
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTransportEmissions,
  calculateDietEmissions,
  calculateEnergyEmissions,
  calculateShoppingEmissions,
  calculateTotalFootprint,
  getGlobalComparison,
} from '../utils/carbonCalculations';
import { TransportMode, FuelType, DietType, DEFAULT_PROFILE } from '../types';
import type { TransportProfile, DietProfile, EnergyProfile, ShoppingProfile } from '../types';

/* ─── Transport Emission Tests ──────────────────────────────────────── */
describe('calculateTransportEmissions', () => {
  it('calculates car commuting emissions with gasoline', () => {
    const profile: TransportProfile = {
      primaryMode: TransportMode.Car,
      fuelType: FuelType.Gasoline,
      weeklyDistanceKm: 200,
      flightsPerYear: 0,
      averageFlightHours: 0,
    };
    const result = calculateTransportEmissions(profile);
    // 200 km * 0.21 kg/km * 52 weeks = 2184 kg
    expect(result).toBe(2184);
  });

  it('calculates zero emissions for cycling', () => {
    const profile: TransportProfile = {
      primaryMode: TransportMode.Bicycle,
      fuelType: FuelType.Gasoline,
      weeklyDistanceKm: 100,
      flightsPerYear: 0,
      averageFlightHours: 0,
    };
    expect(calculateTransportEmissions(profile)).toBe(0);
  });

  it('calculates zero emissions for walking', () => {
    const profile: TransportProfile = {
      primaryMode: TransportMode.Walking,
      fuelType: FuelType.Gasoline,
      weeklyDistanceKm: 50,
      flightsPerYear: 0,
      averageFlightHours: 0,
    };
    expect(calculateTransportEmissions(profile)).toBe(0);
  });

  it('includes flight emissions correctly', () => {
    const profile: TransportProfile = {
      primaryMode: TransportMode.Bicycle,
      fuelType: FuelType.Gasoline,
      weeklyDistanceKm: 0,
      flightsPerYear: 2,
      averageFlightHours: 4,
    };
    // 2 flights * 4 hours * 250 kg/hour = 2000 kg
    expect(calculateTransportEmissions(profile)).toBe(2000);
  });

  it('sums commute and flight emissions', () => {
    const profile: TransportProfile = {
      primaryMode: TransportMode.Car,
      fuelType: FuelType.Diesel,
      weeklyDistanceKm: 100,
      flightsPerYear: 1,
      averageFlightHours: 3,
    };
    // Commute: 100 * 0.24 * 52 = 1248
    // Flights: 1 * 3 * 250 = 750
    expect(calculateTransportEmissions(profile)).toBe(1998);
  });

  it('calculates electric car emissions at lower rate', () => {
    const profile: TransportProfile = {
      primaryMode: TransportMode.ElectricCar,
      fuelType: FuelType.Electric,
      weeklyDistanceKm: 200,
      flightsPerYear: 0,
      averageFlightHours: 0,
    };
    // 200 * 0.05 * 52 = 520
    expect(calculateTransportEmissions(profile)).toBe(520);
  });

  it('handles public transit emissions', () => {
    const profile: TransportProfile = {
      primaryMode: TransportMode.PublicTransit,
      fuelType: FuelType.Gasoline,
      weeklyDistanceKm: 150,
      flightsPerYear: 0,
      averageFlightHours: 0,
    };
    // 150 * 0.089 * 52 = 693.6 → 694
    expect(calculateTransportEmissions(profile)).toBe(694);
  });
});

/* ─── Diet Emission Tests ───────────────────────────────────────────── */
describe('calculateDietEmissions', () => {
  it('returns base emissions for average diet with no adjustments', () => {
    const profile: DietProfile = {
      dietType: DietType.Average,
      localFoodPercentage: 0,
      foodWastePercentage: 0,
    };
    expect(calculateDietEmissions(profile)).toBe(2500);
  });

  it('calculates meat-heavy diet emissions', () => {
    const profile: DietProfile = {
      dietType: DietType.MeatHeavy,
      localFoodPercentage: 0,
      foodWastePercentage: 0,
    };
    expect(calculateDietEmissions(profile)).toBe(3300);
  });

  it('calculates vegan diet emissions', () => {
    const profile: DietProfile = {
      dietType: DietType.Vegan,
      localFoodPercentage: 0,
      foodWastePercentage: 0,
    };
    expect(calculateDietEmissions(profile)).toBe(1500);
  });

  it('reduces emissions for local food sourcing', () => {
    const profile: DietProfile = {
      dietType: DietType.Average,
      localFoodPercentage: 100,
      foodWastePercentage: 0,
    };
    // 2500 * (1 - 1.0 * 0.1) = 2500 * 0.9 = 2250
    expect(calculateDietEmissions(profile)).toBe(2250);
  });

  it('increases emissions for food waste', () => {
    const profile: DietProfile = {
      dietType: DietType.Average,
      localFoodPercentage: 0,
      foodWastePercentage: 40,
    };
    // 2500 * 1 * (1 + 0.4 * 0.25) = 2500 * 1.1 = 2750
    expect(calculateDietEmissions(profile)).toBe(2750);
  });
});

/* ─── Energy Emission Tests ─────────────────────────────────────────── */
describe('calculateEnergyEmissions', () => {
  it('calculates standard household energy emissions', () => {
    const profile: EnergyProfile = {
      monthlyElectricityKwh: 900,
      monthlyGasUsageTherms: 50,
      renewablePercentage: 0,
      householdSize: 1,
    };
    // Electricity: 900 * 12 * 0.417 = 4503.6
    // Gas: 50 * 12 * 5.3 = 3180
    // Total: 7683.6 / 1 = 7684
    expect(calculateEnergyEmissions(profile)).toBe(7684);
  });

  it('splits emissions per household member', () => {
    const profile: EnergyProfile = {
      monthlyElectricityKwh: 900,
      monthlyGasUsageTherms: 50,
      renewablePercentage: 0,
      householdSize: 4,
    };
    // 7683.6 / 4 = 1920.9 → 1921
    expect(calculateEnergyEmissions(profile)).toBe(1921);
  });

  it('reduces emissions with renewable energy', () => {
    const profile: EnergyProfile = {
      monthlyElectricityKwh: 900,
      monthlyGasUsageTherms: 50,
      renewablePercentage: 50,
      householdSize: 1,
    };
    // 7683.6 * 0.5 = 3841.8 → 3842
    expect(calculateEnergyEmissions(profile)).toBe(3842);
  });

  it('returns zero for 100% renewable energy', () => {
    const profile: EnergyProfile = {
      monthlyElectricityKwh: 900,
      monthlyGasUsageTherms: 50,
      renewablePercentage: 100,
      householdSize: 1,
    };
    expect(calculateEnergyEmissions(profile)).toBe(0);
  });

  it('handles household size of zero (defaults to 1)', () => {
    const profile: EnergyProfile = {
      monthlyElectricityKwh: 100,
      monthlyGasUsageTherms: 10,
      renewablePercentage: 0,
      householdSize: 0,
    };
    // Should use Math.max(0, 1) = 1
    const result = calculateEnergyEmissions(profile);
    expect(result).toBeGreaterThan(0);
  });
});

/* ─── Shopping Emission Tests ───────────────────────────────────────── */
describe('calculateShoppingEmissions', () => {
  it('calculates base shopping emissions', () => {
    const profile: ShoppingProfile = {
      monthlySpendingUsd: 500,
      fastFashionFrequency: 'sometimes',
      electronicsPerYear: 0,
      recyclingRate: 0,
    };
    // 500 * 12 * 0.7 * 1.0 + 0 = 4200
    expect(calculateShoppingEmissions(profile)).toBe(4200);
  });

  it('increases emissions for frequent fast fashion', () => {
    const profile: ShoppingProfile = {
      monthlySpendingUsd: 500,
      fastFashionFrequency: 'often',
      electronicsPerYear: 0,
      recyclingRate: 0,
    };
    // 500 * 12 * 0.7 * 1.5 = 6300
    expect(calculateShoppingEmissions(profile)).toBe(6300);
  });

  it('adds electronics emissions', () => {
    const profile: ShoppingProfile = {
      monthlySpendingUsd: 0,
      fastFashionFrequency: 'sometimes',
      electronicsPerYear: 3,
      recyclingRate: 0,
    };
    // 0 + 3 * 300 = 900
    expect(calculateShoppingEmissions(profile)).toBe(900);
  });

  it('reduces emissions with high recycling rate', () => {
    const profile: ShoppingProfile = {
      monthlySpendingUsd: 500,
      fastFashionFrequency: 'sometimes',
      electronicsPerYear: 0,
      recyclingRate: 100,
    };
    // 4200 * (1 - 1.0 * 0.15) = 4200 * 0.85 = 3570
    expect(calculateShoppingEmissions(profile)).toBe(3570);
  });
});

/* ─── Total Footprint Tests ─────────────────────────────────────────── */
describe('calculateTotalFootprint', () => {
  it('returns a valid CarbonScore object', () => {
    const score = calculateTotalFootprint(DEFAULT_PROFILE);
    expect(score).toHaveProperty('totalAnnualKgCO2');
    expect(score).toHaveProperty('categories');
    expect(score).toHaveProperty('globalComparison');
    expect(score).toHaveProperty('calculatedAt');
    expect(score.categories).toHaveLength(4);
  });

  it('category percentages sum to approximately 100%', () => {
    const score = calculateTotalFootprint(DEFAULT_PROFILE);
    const totalPercentage = score.categories.reduce((sum, cat) => sum + cat.percentageOfTotal, 0);
    expect(totalPercentage).toBeGreaterThanOrEqual(98);
    expect(totalPercentage).toBeLessThanOrEqual(102);
  });

  it('total equals sum of all categories', () => {
    const score = calculateTotalFootprint(DEFAULT_PROFILE);
    const categorySum = score.categories.reduce((sum, cat) => sum + cat.annualKgCO2, 0);
    expect(score.totalAnnualKgCO2).toBe(categorySum);
  });

  it('includes ISO timestamp in calculatedAt', () => {
    const score = calculateTotalFootprint(DEFAULT_PROFILE);
    expect(new Date(score.calculatedAt).getTime()).not.toBeNaN();
  });
});

/* ─── Global Comparison Tests ───────────────────────────────────────── */
describe('getGlobalComparison', () => {
  it('returns correct comparison for world average', () => {
    const comparison = getGlobalComparison(4000);
    expect(comparison.percentileVsWorld).toBe(100);
  });

  it('returns correct comparison for US average', () => {
    const comparison = getGlobalComparison(16000);
    expect(comparison.percentileVsUS).toBe(100);
  });

  it('returns below 100% for lower-than-average footprint', () => {
    const comparison = getGlobalComparison(2000);
    expect(comparison.percentileVsWorld).toBe(50);
  });

  it('provides all comparison averages', () => {
    const comparison = getGlobalComparison(5000);
    expect(comparison.worldAverageKg).toBe(4000);
    expect(comparison.usAverageKg).toBe(16000);
    expect(comparison.euAverageKg).toBe(6500);
  });
});
