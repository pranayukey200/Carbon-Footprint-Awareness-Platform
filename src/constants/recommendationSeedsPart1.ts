/**
 * @fileoverview Part 1 of recommendation seeds: Transport and Diet.
 * @module constants/recommendationSeedsPart1
 */

import { Difficulty, CategoryType, TransportMode, FuelType, DietType } from '../types';
import type { RecommendationSeed } from './recommendationSeeds';

/**
 * Recommendation seeds for Transport and Diet categories.
 */
export const TRANSPORT_AND_DIET_SEEDS: readonly RecommendationSeed[] = [
  // ── Transport ─────────────────────────────────────────────────
  {
    id: 't1',
    title: 'Switch to public transit',
    description: 'Replace car commutes with bus or rail to cut per-km emissions by 60%.',
    category: CategoryType.Transport,
    potentialSavingKgCo2: 2200,
    difficulty: Difficulty.Medium,
    isRelevant: (p) => p.transport.primaryMode === TransportMode.Car,
  },
  {
    id: 't2',
    title: 'Carpool to work',
    description: 'Sharing rides with one colleague halves your commute emissions.',
    category: CategoryType.Transport,
    potentialSavingKgCo2: 1100,
    difficulty: Difficulty.Easy,
    isRelevant: (p) => p.transport.primaryMode === TransportMode.Car,
  },
  {
    id: 't3',
    title: 'Switch to an electric vehicle',
    description: 'EVs produce ~75% fewer lifecycle emissions than petrol cars.',
    category: CategoryType.Transport,
    potentialSavingKgCo2: 3000,
    difficulty: Difficulty.Hard,
    isRelevant: (p) =>
      p.transport.primaryMode === TransportMode.Car && p.transport.fuelType !== FuelType.Electric,
  },
  {
    id: 't4',
    title: 'Cycle for short commutes',
    description: 'Trips under 8 km are faster by bike in most cities—and zero-emission.',
    category: CategoryType.Transport,
    potentialSavingKgCo2: 800,
    difficulty: Difficulty.Easy,
    isRelevant: (p) => p.transport.weeklyDistanceKm < 60 && p.transport.weeklyDistanceKm > 0,
  },
  {
    id: 't5',
    title: 'Reduce flights by one per year',
    description: 'A single round-trip domestic flight emits ~800 kg CO₂.',
    category: CategoryType.Transport,
    potentialSavingKgCo2: 816,
    difficulty: Difficulty.Medium,
    isRelevant: (p) => p.transport.flightsPerYear > 0,
  },
  {
    id: 't6',
    title: 'Choose direct flights',
    description: 'Layovers add takeoff fuel burn. Direct routes cut flight emissions ~20%.',
    category: CategoryType.Transport,
    potentialSavingKgCo2: 400,
    difficulty: Difficulty.Easy,
    isRelevant: (p) => p.transport.flightsPerYear >= 2,
  },

  // ── Diet ──────────────────────────────────────────────────────
  {
    id: 'd1',
    title: 'Try Meatless Mondays',
    description: 'Skipping meat one day a week saves ~350 kg CO₂/year.',
    category: CategoryType.Diet,
    potentialSavingKgCo2: 350,
    difficulty: Difficulty.Easy,
    isRelevant: (p) =>
      p.diet.dietType === DietType.MeatHeavy || p.diet.dietType === DietType.Average,
  },
  {
    id: 'd2',
    title: 'Shift to a vegetarian diet',
    description: 'Cutting meat entirely reduces food emissions by up to 50%.',
    category: CategoryType.Diet,
    potentialSavingKgCo2: 800,
    difficulty: Difficulty.Medium,
    isRelevant: (p) =>
      p.diet.dietType === DietType.MeatHeavy || p.diet.dietType === DietType.Average,
  },
  {
    id: 'd3',
    title: 'Adopt a vegan diet',
    description: 'Plant-based diets have the lowest food carbon footprint.',
    category: CategoryType.Diet,
    potentialSavingKgCo2: 1200,
    difficulty: Difficulty.Hard,
    isRelevant: (p) => p.diet.dietType !== DietType.Vegan,
  },
  {
    id: 'd4',
    title: 'Buy local and seasonal produce',
    description: 'Locally grown food travels fewer food-miles, cutting ~150 kg CO₂/year.',
    category: CategoryType.Diet,
    potentialSavingKgCo2: 150,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },
  {
    id: 'd5',
    title: 'Reduce food waste',
    description: 'The average household wastes 30% of food—plan meals to save ~200 kg CO₂.',
    category: CategoryType.Diet,
    potentialSavingKgCo2: 200,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },
];
