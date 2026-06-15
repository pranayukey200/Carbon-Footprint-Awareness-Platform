/**
 * @fileoverview Combines and re-exports all recommendation seeds.
 * @module constants/recommendationSeeds
 */

import type { UserProfile, Difficulty, CategoryType } from '../types';
import { TRANSPORT_AND_DIET_SEEDS } from './recommendationSeedsPart1';
import { ENERGY_AND_SHOPPING_SEEDS } from './recommendationSeedsPart2';

export interface RecommendationSeed {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: CategoryType;
  readonly potentialSavingKgCo2: number;
  readonly difficulty: Difficulty;
  readonly isRelevant: (profile: UserProfile) => boolean;
}

/** Master catalog of 24 actionable recommendations combined from split files. */
export const RECOMMENDATION_SEEDS: readonly RecommendationSeed[] = [
  ...TRANSPORT_AND_DIET_SEEDS,
  ...ENERGY_AND_SHOPPING_SEEDS,
];
