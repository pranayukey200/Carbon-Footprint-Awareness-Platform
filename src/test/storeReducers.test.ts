/**
 * @fileoverview Unit tests for store state reducers.
 * @module test/storeReducers.test
 */

import { describe, it, expect } from 'vitest';
import { runCalculateScore, runToggleActionCompleted } from '../store/storeReducers';
import { DEFAULT_PROFILE, CategoryType, Difficulty, TransportMode, type Action, type TrendDataPoint } from '../types';

const MOCK_ACTION: Action = {
  id: 't1',
  title: 'Mock Public Transit Action',
  description: 'Use public transit instead of car',
  category: CategoryType.Transport,
  potentialSavingKgCO2: 500,
  difficulty: Difficulty.Easy,
  icon: '🚌',
  isCompleted: false,
};

const MOCK_TREND: TrendDataPoint = {
  date: '2026-01-01T00:00:00.000Z',
  totalKgCO2: 4000,
  transport: 1500,
  diet: 1000,
  energy: 1000,
  shopping: 500,
};

describe('runCalculateScore', () => {
  it('correctly calculates the total score and adds a trend data point', () => {
    const result = runCalculateScore(DEFAULT_PROFILE, [MOCK_TREND]);
    expect(result.carbonScore).toBeDefined();
    expect(result.carbonScore.totalAnnualKgCO2).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.trendData.length).toBe(2);
    expect(result.trendData[1]?.totalKgCO2).toBe(result.carbonScore.totalAnnualKgCO2);
  });

  it('keeps trend data array size bounded to maximum 12 items', () => {
    const largeTrendList = Array.from({ length: 15 }, (_, i) => ({
      ...MOCK_TREND,
      date: `2026-01-${i + 1}T00:00:00.000Z`,
    }));
    const result = runCalculateScore(DEFAULT_PROFILE, largeTrendList);
    expect(result.trendData.length).toBe(12);
  });
});

describe('runToggleActionCompleted', () => {
  it('toggles an action status and synchronizes the profile', () => {
    const state = {
      recommendations: [MOCK_ACTION],
      userProfile: DEFAULT_PROFILE,
      trendData: [MOCK_TREND],
    };

    const result = runToggleActionCompleted(state, 't1');
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations?.[0]?.isCompleted).toBe(true);
    expect(result.userProfile).toBeDefined();
    // Action t1 switches primary mode to PublicTransit
    expect(result.userProfile?.transport?.primaryMode).toBe(TransportMode.PublicTransit);
    expect(result.carbonScore).toBeDefined();
    expect(result.trendData?.length).toBe(2);
  });

  it('returns empty object if action ID does not exist', () => {
    const state = {
      recommendations: [MOCK_ACTION],
      userProfile: DEFAULT_PROFILE,
      trendData: [MOCK_TREND],
    };
    const result = runToggleActionCompleted(state, 'non_existent_action');
    expect(result).toEqual({});
  });
});
