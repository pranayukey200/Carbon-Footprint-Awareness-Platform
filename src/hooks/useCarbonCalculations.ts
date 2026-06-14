/**
 * @fileoverview Custom React hooks for memoized carbon calculations and chart data.
 * Wraps calculation utilities with React's performance optimizations.
 * @module hooks/useCarbonCalculations
 */

import { useMemo } from 'react';
import type { CarbonScore, UserProfile, TrendDataPoint, ProgressEntry } from '../types';
import { calculateTotalFootprint } from '../utils/carbonCalculations';
import { CategoryType } from '../types';

/** Chart-ready breakdown data for category visualization */
export interface CategoryBreakdownData {
  readonly name: string;
  readonly value: number;
  readonly percentage: number;
  readonly color: string;
}

/** Category color mapping for consistent chart colors */
const CATEGORY_COLORS: Record<CategoryType, string> = {
  [CategoryType.Transport]: '#3B82F6',
  [CategoryType.Diet]: '#10B981',
  [CategoryType.Energy]: '#F59E0B',
  [CategoryType.Shopping]: '#8B5CF6',
};

/** Category display labels */
const CATEGORY_LABELS: Record<CategoryType, string> = {
  [CategoryType.Transport]: 'Transport',
  [CategoryType.Diet]: 'Diet',
  [CategoryType.Energy]: 'Energy',
  [CategoryType.Shopping]: 'Shopping',
};

/**
 * Hook providing memoized carbon score calculations from a user profile.
 * Recalculates only when the profile changes.
 * @param profile - User's lifestyle profile
 * @returns Memoized CarbonScore
 */
export function useCarbonCalculations(profile: UserProfile): CarbonScore {
  return useMemo(() => calculateTotalFootprint(profile), [profile]);
}

/**
 * Hook transforming a CarbonScore into chart-ready category breakdown data.
 * @param score - Calculated carbon score (nullable during loading)
 * @returns Array of labeled, colored data points for pie/donut charts
 */
export function useCategoryBreakdown(score: CarbonScore | null): CategoryBreakdownData[] {
  return useMemo(() => {
    if (!score) return [];

    return score.categories.map((cat) => ({
      name: CATEGORY_LABELS[cat.category] ?? cat.category,
      value: cat.annualKgCO2,
      percentage: cat.percentageOfTotal,
      color: CATEGORY_COLORS[cat.category] ?? '#6B7280',
    }));
  }, [score]);
}

/**
 * Hook transforming progress log + trend data into time-series chart data.
 * @param trendData - Historical trend data points
 * @param progressLog - User's action log entries
 * @returns Formatted data array for Recharts line/area charts
 */
export function useTrendData(
  trendData: readonly TrendDataPoint[],
  progressLog: readonly ProgressEntry[],
): TrendDataPoint[] {
  return useMemo(() => {
    if (trendData.length === 0) return [];

    const totalSaved = progressLog.reduce((sum, entry) => sum + entry.kgCO2Saved, 0);

    return trendData.map((point, index) => {
      const isLatest = index === trendData.length - 1;
      return {
        ...point,
        date: new Date(point.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        totalKgCO2: isLatest ? Math.max(0, point.totalKgCO2 - totalSaved) : point.totalKgCO2,
      };
    });
  }, [trendData, progressLog]);
}
