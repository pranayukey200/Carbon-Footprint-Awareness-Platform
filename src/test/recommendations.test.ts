/**
 * @fileoverview Unit tests for the recommendation engine.
 * @module test/recommendations.test
 */

import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../services/recommendations';
import { calculateTotalFootprint } from '../utils/carbonCalculations';
import { DEFAULT_PROFILE, TransportMode, DietType, CategoryType, type UserProfile } from '../types';

describe('generateRecommendations', () => {
  const defaultScore = calculateTotalFootprint(DEFAULT_PROFILE);

  it('returns an array of actions', () => {
    const result = generateRecommendations(DEFAULT_PROFILE, defaultScore);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('each action has required fields', () => {
    const result = generateRecommendations(DEFAULT_PROFILE, defaultScore);
    for (const action of result) {
      expect(action).toHaveProperty('id');
      expect(action).toHaveProperty('title');
      expect(action).toHaveProperty('description');
      expect(action).toHaveProperty('category');
      expect(action).toHaveProperty('potentialSavingKgCO2');
      expect(action).toHaveProperty('difficulty');
      expect(action).toHaveProperty('icon');
      expect(action).toHaveProperty('isCompleted');
    }
  });

  it('actions are sorted by impact (highest first)', () => {
    const result = generateRecommendations(DEFAULT_PROFILE, defaultScore);
    const dominantCategory = [...defaultScore.categories].sort((a, b) => b.annualKgCO2 - a.annualKgCO2)[0]?.category;

    for (let i = 1; i < result.length; i++) {
      const prev = result[i - 1];
      const current = result[i];
      if (prev && current) {
        const prevBoost = prev.category === dominantCategory ? 1.5 : 1;
        const currBoost = current.category === dominantCategory ? 1.5 : 1;
        expect(prev.potentialSavingKgCO2 * prevBoost).toBeGreaterThanOrEqual(current.potentialSavingKgCO2 * currBoost);
      }
    }
  });

  it('filters out public transit suggestion for transit users', () => {
    const transitProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      transport: {
        ...DEFAULT_PROFILE.transport,
        primaryMode: TransportMode.PublicTransit,
      },
    };
    const score = calculateTotalFootprint(transitProfile);
    const result = generateRecommendations(transitProfile, score);
    const hasTransitSwitch = result.some((a) => a.id === 't1');
    expect(hasTransitSwitch).toBe(false);
  });

  it('filters out vegan suggestion for vegan users', () => {
    const veganProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      diet: {
        ...DEFAULT_PROFILE.diet,
        dietType: DietType.Vegan,
      },
    };
    const score = calculateTotalFootprint(veganProfile);
    const result = generateRecommendations(veganProfile, score);
    const hasVeganSwitch = result.some((a) => a.id === 'd3');
    expect(hasVeganSwitch).toBe(false);
  });

  it('includes actions from all categories', () => {
    const result = generateRecommendations(DEFAULT_PROFILE, defaultScore);
    const categories = new Set(result.map((a) => a.category));
    expect(categories.has(CategoryType.Transport)).toBe(true);
    expect(categories.has(CategoryType.Diet)).toBe(true);
    expect(categories.has(CategoryType.Energy)).toBe(true);
    expect(categories.has(CategoryType.Shopping)).toBe(true);
  });

  it('all actions start as not completed', () => {
    const result = generateRecommendations(DEFAULT_PROFILE, defaultScore);
    for (const action of result) {
      expect(action.isCompleted).toBe(false);
    }
  });

  it('returns at least 15 recommendations', () => {
    const result = generateRecommendations(DEFAULT_PROFILE, defaultScore);
    expect(result.length).toBeGreaterThanOrEqual(15);
  });
});
