/**
 * @fileoverview Core type definitions for the Carbon Footprint Awareness Platform.
 * Provides comprehensive TypeScript interfaces and enums for all domain entities.
 * @module types
 */

/* ─── Enums ─────────────────────────────────────────────────────────── */

/** Categories of carbon emission sources tracked by the platform */
export enum CategoryType {
  Transport = 'transport',
  Diet = 'diet',
  Energy = 'energy',
  Shopping = 'shopping',
}

/** Primary transport modes with emission factors */
export enum TransportMode {
  Car = 'car',
  PublicTransit = 'publicTransit',
  Bicycle = 'bicycle',
  Walking = 'walking',
  Motorcycle = 'motorcycle',
  ElectricCar = 'electricCar',
}

/** Fuel types for motor vehicles */
export enum FuelType {
  Gasoline = 'gasoline',
  Diesel = 'diesel',
  Hybrid = 'hybrid',
  Electric = 'electric',
}

/** Dietary patterns ranked by emissions impact */
export enum DietType {
  MeatHeavy = 'meatHeavy',
  Average = 'average',
  Vegetarian = 'vegetarian',
  Vegan = 'vegan',
}

/** Household energy source types */
export enum EnergySource {
  Electricity = 'electricity',
  NaturalGas = 'naturalGas',
  HeatingOil = 'heatingOil',
  Solar = 'solar',
  Wind = 'wind',
}

/** Difficulty levels for recommended actions */
export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

/** Steps in the onboarding form flow */
export enum OnboardingStep {
  Transport = 0,
  Diet = 1,
  Energy = 2,
  Shopping = 3,
  Review = 4,
}

/* ─── Interfaces ────────────────────────────────────────────────────── */

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
  readonly monthlySpendingUsd: number;
  readonly fastFashionFrequency: 'never' | 'rarely' | 'sometimes' | 'often';
  readonly electronicsPerYear: number;
  readonly recyclingRate: number;
}

/** Complete user lifestyle profile */
export interface UserProfile {
  readonly transport: TransportProfile;
  readonly diet: DietProfile;
  readonly energy: EnergyProfile;
  readonly shopping: ShoppingProfile;
}

/** Emission score for a single category (kg CO2/year) */
export interface CategoryScore {
  readonly category: CategoryType;
  readonly annualKgCO2: number;
  readonly percentageOfTotal: number;
  readonly comparisonToAverage: number;
}

/** Complete carbon footprint calculation result */
export interface CarbonScore {
  readonly totalAnnualKgCO2: number;
  readonly categories: readonly CategoryScore[];
  readonly globalComparison: GlobalComparison;
  readonly calculatedAt: string;
}

/** Comparison against global and regional averages */
export interface GlobalComparison {
  readonly worldAverageKg: number;
  readonly usAverageKg: number;
  readonly euAverageKg: number;
  readonly percentileVsWorld: number;
  readonly percentileVsUS: number;
}

/** Recommended action to reduce carbon footprint */
export interface Action {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: CategoryType;
  readonly potentialSavingKgCO2: number;
  readonly difficulty: Difficulty;
  readonly icon: string;
  readonly isCompleted: boolean;
}

/** Logged progress entry when user takes an action */
export interface ProgressEntry {
  readonly id: string;
  readonly actionId: string;
  readonly actionTitle: string;
  readonly category: CategoryType;
  readonly kgCO2Saved: number;
  readonly completedAt: string;
  readonly notes: string;
}

/** Chart data point for trend visualizations */
export interface TrendDataPoint {
  readonly date: string;
  readonly totalKgCO2: number;
  readonly transport: number;
  readonly diet: number;
  readonly energy: number;
  readonly shopping: number;
}

/** Application state shape for the Zustand store */
export interface AppState {
  /** User's lifestyle profile */
  userProfile: UserProfile;
  /** Calculated carbon score */
  carbonScore: CarbonScore | null;
  /** Personalized action recommendations */
  recommendations: readonly Action[];
  /** Log of completed actions */
  progressLog: readonly ProgressEntry[];
  /** Whether onboarding is complete */
  isOnboarded: boolean;
  /** Current onboarding step */
  currentStep: OnboardingStep;
  /** Historical trend data */
  trendData: readonly TrendDataPoint[];
}

/** Store action methods */
export interface AppActions {
  setUserProfile: (profile: Partial<UserProfile>) => void;
  setTransportProfile: (transport: Partial<TransportProfile>) => void;
  setDietProfile: (diet: Partial<DietProfile>) => void;
  setEnergyProfile: (energy: Partial<EnergyProfile>) => void;
  setShoppingProfile: (shopping: Partial<ShoppingProfile>) => void;
  calculateScore: () => void;
  addProgressEntry: (entry: Omit<ProgressEntry, 'id' | 'completedAt'>) => void;
  completeOnboarding: () => void;
  setCurrentStep: (step: OnboardingStep) => void;
  resetProfile: () => void;
  toggleActionCompleted: (actionId: string) => void;
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
  monthlySpendingUsd: 500,
  fastFashionFrequency: 'sometimes',
  electronicsPerYear: 2,
  recyclingRate: 30,
};

/** Default user profile with average values */
export const DEFAULT_PROFILE: UserProfile = {
  transport: DEFAULT_TRANSPORT,
  diet: DEFAULT_DIET,
  energy: DEFAULT_ENERGY,
  shopping: DEFAULT_SHOPPING,
};
