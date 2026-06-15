/**
 * @fileoverview Personalised recommendation engine for carbon footprint reduction.
 * Filters actions relevant to the user's lifestyle and sorts by potential impact.
 * @module services/recommendations
 */

import { type UserProfile, type CarbonScore, type Action, CategoryType } from '../types';
import { RECOMMENDATION_SEEDS } from '../constants/recommendationSeeds';

/**
 * Generate personalised, impact-ranked recommendations.
 * Filters the master catalogue to actions relevant to the user's
 * profile, then sorts descending by potential CO₂ savings, boosted by largest category.
 *
 * @param profile - The user's lifestyle profile.
 * @param score - The user's calculated carbon score.
 * @returns Sorted array of relevant {@link Action} items.
 * @example
 * ```ts
 * const recs = generateRecommendations(userProfile, carbonScore);
 * ```
 */
export function generateRecommendations(profile: UserProfile, score: CarbonScore): Action[] {
  const dominantCategory = [...score.categories].sort((a, b) => b.annualKgCO2 - a.annualKgCO2)[0]
    ?.category;

  return RECOMMENDATION_SEEDS.filter((seed) => seed.isRelevant(profile))
    .map((seed) => {
      let icon = '💡';
      if (seed.category === CategoryType.Transport) {
        if (seed.id === 't4') icon = '🚲';
        else if (seed.id === 't5' || seed.id === 't6') icon = '✈️';
        else icon = '🚗';
      } else if (seed.category === CategoryType.Diet) {
        if (seed.id === 'd3') icon = '🌱';
        else if (seed.id === 'd2') icon = '🥗';
        else if (seed.id === 'd1') icon = '🥦';
        else icon = '🍎';
      } else if (seed.category === CategoryType.Energy) {
        if (seed.id === 'e2') icon = '🌡️';
        else if (seed.id === 'e3') icon = '💡';
        else if (seed.id === 'e5') icon = '☀️';
        else icon = '⚡';
      } else if (seed.category === CategoryType.Shopping) {
        if (seed.id === 's1') icon = '👕';
        else if (seed.id === 's2') icon = '🛠️';
        else if (seed.id === 's7') icon = '♻️';
        else icon = '🛒';
      }

      return {
        id: seed.id,
        title: seed.title,
        description: seed.description,
        category: seed.category,
        potentialSavingKgCO2: seed.potentialSavingKgCo2,
        difficulty: seed.difficulty,
        icon,
        isCompleted: false,
      };
    })
    .sort((a, b) => {
      const aBoost = a.category === dominantCategory ? 1.5 : 1;
      const bBoost = b.category === dominantCategory ? 1.5 : 1;
      return b.potentialSavingKgCO2 * bBoost - a.potentialSavingKgCO2 * aBoost;
    });
}
