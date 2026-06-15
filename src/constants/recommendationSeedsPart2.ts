/**
 * @fileoverview Part 2 of recommendation seeds: Energy and Shopping.
 * @module constants/recommendationSeedsPart2
 */

import { Difficulty, CategoryType } from '../types';
import type { RecommendationSeed } from './recommendationSeeds';

/**
 * Recommendation seeds for Energy and Shopping categories.
 */
export const ENERGY_AND_SHOPPING_SEEDS: readonly RecommendationSeed[] = [
  // ── Energy ────────────────────────────────────────────────────
  {
    id: 'e1',
    title: 'Switch to a green energy tariff',
    description: 'Renewable electricity reduces grid emissions to near zero.',
    category: CategoryType.Energy,
    potentialSavingKgCo2: 2500,
    difficulty: Difficulty.Easy,
    isRelevant: (p) => p.energy.monthlyElectricityKwh > 0 && p.energy.renewablePercentage < 100,
  },
  {
    id: 'e2',
    title: 'Install a smart thermostat',
    description: 'Optimised heating schedules cut gas use by ~15%.',
    category: CategoryType.Energy,
    potentialSavingKgCo2: 500,
    difficulty: Difficulty.Medium,
    isRelevant: (p) => p.energy.monthlyGasUsageTherms > 0,
  },
  {
    id: 'e3',
    title: 'Upgrade to LED lighting',
    description: 'LEDs use 75% less energy than incandescents across your home.',
    category: CategoryType.Energy,
    potentialSavingKgCo2: 200,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },
  {
    id: 'e4',
    title: 'Insulate your home',
    description: 'Proper insulation reduces heating/cooling energy by up to 40%.',
    category: CategoryType.Energy,
    potentialSavingKgCo2: 1200,
    difficulty: Difficulty.Hard,
    isRelevant: (p) => p.energy.monthlyGasUsageTherms > 20,
  },
  {
    id: 'e5',
    title: 'Install solar panels',
    description: 'Rooftop solar can offset 80%+ of household electricity emissions.',
    category: CategoryType.Energy,
    potentialSavingKgCo2: 3000,
    difficulty: Difficulty.Hard,
    isRelevant: (p) => p.energy.monthlyElectricityKwh > 0 && p.energy.renewablePercentage < 80,
  },
  {
    id: 'e6',
    title: 'Air-dry laundry',
    description: 'Skipping the dryer saves ~200 kWh/year—easy and free.',
    category: CategoryType.Energy,
    potentialSavingKgCo2: 80,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },

  // ── Shopping ──────────────────────────────────────────────────
  {
    id: 's1',
    title: 'Buy second-hand clothing',
    description: 'Thrifting avoids the ~10 kg CO₂ embedded in each new garment.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 400,
    difficulty: Difficulty.Easy,
    isRelevant: (p) => p.shopping.monthlySpendingInr > 8000,
  },
  {
    id: 's2',
    title: 'Repair instead of replace',
    description: 'Extending product life by a year cuts lifecycle emissions significantly.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 300,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },
  {
    id: 's3',
    title: 'Choose durable goods',
    description: 'Investing in quality products reduces replacement frequency.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 250,
    difficulty: Difficulty.Medium,
    isRelevant: (p) => p.shopping.monthlySpendingInr > 16000,
  },
  {
    id: 's4',
    title: 'Cancel unused subscriptions',
    description: 'Digital services have data-centre footprints—keep only what you use.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 50,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },
  {
    id: 's5',
    title: 'Reduce impulse purchases',
    description: 'A 48-hour rule before buying cuts unnecessary consumption by ~30%.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 350,
    difficulty: Difficulty.Easy,
    isRelevant: (p) => p.shopping.monthlySpendingInr > 12000,
  },
  {
    id: 's6',
    title: 'Buy refurbished electronics',
    description: 'Refurb devices avoid ~80% of manufacturing emissions.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 500,
    difficulty: Difficulty.Medium,
    isRelevant: (p) => p.shopping.monthlySpendingInr > 8000,
  },
  {
    id: 's7',
    title: 'Use reusable bags and containers',
    description: 'Eliminates single-use packaging waste and its production footprint.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 30,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },
];
