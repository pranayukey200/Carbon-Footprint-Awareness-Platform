/**
 * @fileoverview State reducers and update helpers for carbonStore.
 * @module store/storeReducers
 */

import type { UserProfile, CarbonScore, TrendDataPoint, Action } from '../types';
import { calculateTotalFootprint } from '../utils/carbonCalculations';
import { generateRecommendations } from '../services/recommendations';
import { syncProfileWithAction } from '../utils/profileSync';

/**
 * Calculates carbon score and generates recommendation updates.
 * @param userProfile - Current UserProfile.
 * @param trendData - Current trend history list.
 * @returns State updates for carbonScore, recommendations, and trendData.
 */
export function runCalculateScore(
  userProfile: UserProfile,
  trendData: readonly TrendDataPoint[],
): {
  carbonScore: CarbonScore;
  recommendations: readonly Action[];
  trendData: readonly TrendDataPoint[];
} {
  const score = calculateTotalFootprint(userProfile);
  const recommendations = generateRecommendations(userProfile, score);

  const trendPoint: TrendDataPoint = {
    date: new Date().toISOString(),
    totalKgCO2: score.totalAnnualKgCO2,
    transport: score.categories[0]?.annualKgCO2 ?? 0,
    diet: score.categories[1]?.annualKgCO2 ?? 0,
    energy: score.categories[2]?.annualKgCO2 ?? 0,
    shopping: score.categories[3]?.annualKgCO2 ?? 0,
  };

  return {
    carbonScore: score,
    recommendations,
    trendData: [...trendData.slice(-11), trendPoint],
  };
}

/**
 * Toggles a recommendation's completed status and synchronizes the profile.
 * @param state - Current recommendations, profile, and trend history.
 * @param actionId - ID of the toggled action.
 * @returns State updates for recommendations, profile, score, and trend history.
 */
export function runToggleActionCompleted(
  state: {
    readonly recommendations: readonly Action[];
    readonly userProfile: UserProfile;
    readonly trendData: readonly TrendDataPoint[];
  },
  actionId: string,
): Partial<{
  recommendations: readonly Action[];
  userProfile: UserProfile;
  carbonScore: CarbonScore;
  trendData: readonly TrendDataPoint[];
}> {
  const action = state.recommendations.find((a) => a.id === actionId);
  if (!action) {return {};}

  const nextIsCompleted = !action.isCompleted;
  const updatedRecommendations = state.recommendations.map((a) =>
    a.id === actionId ? { ...a, isCompleted: nextIsCompleted } : a,
  );

  const updatedProfile = syncProfileWithAction(state.userProfile, actionId, nextIsCompleted);
  const score = calculateTotalFootprint(updatedProfile);
  const trendPoint: TrendDataPoint = {
    date: new Date().toISOString(),
    totalKgCO2: score.totalAnnualKgCO2,
    transport: score.categories[0]?.annualKgCO2 ?? 0,
    diet: score.categories[1]?.annualKgCO2 ?? 0,
    energy: score.categories[2]?.annualKgCO2 ?? 0,
    shopping: score.categories[3]?.annualKgCO2 ?? 0,
  };

  return {
    recommendations: updatedRecommendations,
    userProfile: updatedProfile,
    carbonScore: score,
    trendData: [...state.trendData.slice(-11), trendPoint],
  };
}
