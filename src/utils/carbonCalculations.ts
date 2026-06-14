import {
  type UserProfile,
  type CarbonScore,
  type CategoryScore,
  type GlobalComparison,
  CategoryType,
  TransportMode,
  FuelType,
  DietType,
} from '../types/index.ts';
import type {
  TransportProfile,
  DietProfile,
  EnergyProfile,
  ShoppingProfile,
} from '../types/index.ts';

// ── Transport emission factors (kg CO₂ per km) ─────────────────────
const TRANSPORT_FACTOR_KG_PER_KM: Record<TransportMode, number> = {
  [TransportMode.Car]: 0.21,
  [TransportMode.PublicTransit]: 0.089,
  [TransportMode.Bicycle]: 0,
  [TransportMode.Walking]: 0,
  [TransportMode.Motorcycle]: 0.12,
  [TransportMode.ElectricCar]: 0.05,
};

const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;

// ── Diet emission factors (kg CO₂e / year) ─────────────────────────
const DIET_ANNUAL_KG: Record<DietType, number> = {
  [DietType.MeatHeavy]: 3300,
  [DietType.Average]: 2500,
  [DietType.Vegetarian]: 1700,
  [DietType.Vegan]: 1500,
};

// ── Energy emission factors ─────────────────────────────────────────
const KG_CO2_PER_KWH = 0.417;
const KG_CO2_PER_THERM = 5.3;

// ── Shopping factor ────────────────────────────────────────────────
const KG_CO2_PER_USD = 0.7;

// ── Global averages (Our World in Data, 2023) ──────────────────────
const WORLD_AVG_KG = 4000;
const US_AVG_KG = 16000;
const EU_AVG_KG = 6500;

// Benchmark averages for category comparisonToAverage
const CATEGORY_AVERAGES: Record<CategoryType, number> = {
  [CategoryType.Transport]: 2000,
  [CategoryType.Diet]: 2000,
  [CategoryType.Energy]: 3000,
  [CategoryType.Shopping]: 2000,
};

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
  let fashionMultiplier = 1.0;
  if (profile.fastFashionFrequency === 'never') {
    fashionMultiplier = 0.5;
  } else if (profile.fastFashionFrequency === 'rarely') {
    fashionMultiplier = 0.8;
  } else if (profile.fastFashionFrequency === 'sometimes') {
    fashionMultiplier = 1.0;
  } else if (profile.fastFashionFrequency === 'often') {
    fashionMultiplier = 1.5;
  }

  const baseSpendingEmissions =
    profile.monthlySpendingUsd * MONTHS_PER_YEAR * KG_CO2_PER_USD * fashionMultiplier;
  const electronicsEmissions = profile.electronicsPerYear * 300;
  const totalEmissions = baseSpendingEmissions + electronicsEmissions;

  const recyclingReduction = 1 - (profile.recyclingRate / 100) * 0.15;
  return Math.round(totalEmissions * recyclingReduction);
}

/**
 * Compare a user's total footprint against world, US, and EU averages.
 * @param totalKg - User's total annual kg CO₂e.
 * @returns Global comparison metrics.
 */
export function getGlobalComparison(totalKg: number): GlobalComparison {
  return {
    worldAverageKg: WORLD_AVG_KG,
    usAverageKg: US_AVG_KG,
    euAverageKg: EU_AVG_KG,
    percentileVsWorld: Math.round((totalKg / WORLD_AVG_KG) * 100),
    percentileVsUS: Math.round((totalKg / US_AVG_KG) * 100),
  };
}

/**
 * Compute the full carbon score for a user profile.
 * @param profile - Complete user lifestyle profile.
 * @returns Full carbon score with category breakdown and global comparison.
 */
export function calculateTotalFootprint(profile: UserProfile): CarbonScore {
  const transportKg = calculateTransportEmissions(profile.transport);
  const dietKg = calculateDietEmissions(profile.diet);
  const energyKg = calculateEnergyEmissions(profile.energy);
  const shoppingKg = calculateShoppingEmissions(profile.shopping);

  const totalAnnualKgCO2 = transportKg + dietKg + energyKg + shoppingKg;

  const categories: CategoryScore[] = [
    {
      category: CategoryType.Transport,
      annualKgCO2: transportKg,
      percentageOfTotal:
        totalAnnualKgCO2 > 0 ? Math.round((transportKg / totalAnnualKgCO2) * 100) : 0,
      comparisonToAverage: Math.round(
        ((transportKg - CATEGORY_AVERAGES[CategoryType.Transport]) /
          CATEGORY_AVERAGES[CategoryType.Transport]) *
          100,
      ),
    },
    {
      category: CategoryType.Diet,
      annualKgCO2: dietKg,
      percentageOfTotal: totalAnnualKgCO2 > 0 ? Math.round((dietKg / totalAnnualKgCO2) * 100) : 0,
      comparisonToAverage: Math.round(
        ((dietKg - CATEGORY_AVERAGES[CategoryType.Diet]) / CATEGORY_AVERAGES[CategoryType.Diet]) *
          100,
      ),
    },
    {
      category: CategoryType.Energy,
      annualKgCO2: energyKg,
      percentageOfTotal: totalAnnualKgCO2 > 0 ? Math.round((energyKg / totalAnnualKgCO2) * 100) : 0,
      comparisonToAverage: Math.round(
        ((energyKg - CATEGORY_AVERAGES[CategoryType.Energy]) /
          CATEGORY_AVERAGES[CategoryType.Energy]) *
          100,
      ),
    },
    {
      category: CategoryType.Shopping,
      annualKgCO2: shoppingKg,
      percentageOfTotal:
        totalAnnualKgCO2 > 0 ? Math.round((shoppingKg / totalAnnualKgCO2) * 100) : 0,
      comparisonToAverage: Math.round(
        ((shoppingKg - CATEGORY_AVERAGES[CategoryType.Shopping]) /
          CATEGORY_AVERAGES[CategoryType.Shopping]) *
          100,
      ),
    },
  ];

  return {
    totalAnnualKgCO2,
    categories,
    globalComparison: getGlobalComparison(totalAnnualKgCO2),
    calculatedAt: new Date().toISOString(),
  };
}
