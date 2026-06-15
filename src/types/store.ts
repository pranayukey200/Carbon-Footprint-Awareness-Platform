/**
 * @fileoverview Store state and action types.
 * @module types/store
 */

import type { CategoryType, Difficulty, OnboardingStep } from './common';
import type {
  UserProfile,
  TransportProfile,
  DietProfile,
  EnergyProfile,
  ShoppingProfile,
} from './profile';

/** Emission score for a single category (kg CO2/year) */
export interface CategoryScore {
  readonly category: CategoryType;
  readonly annualKgCO2: number;
  readonly percentageOfTotal: number;
  readonly comparisonToAverage: number;
}

/** Comparison against global and regional averages */
export interface GlobalComparison {
  readonly worldAverageKg: number;
  readonly usAverageKg: number;
  readonly euAverageKg: number;
  readonly percentileVsWorld: number;
  readonly percentileVsUS: number;
}

/** Complete carbon footprint calculation result */
export interface CarbonScore {
  readonly totalAnnualKgCO2: number;
  readonly categories: readonly CategoryScore[];
  readonly globalComparison: GlobalComparison;
  readonly calculatedAt: string;
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
