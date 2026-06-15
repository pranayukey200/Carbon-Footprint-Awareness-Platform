/**
 * @fileoverview Integration test for the complete onboarding-to-dashboard user flow.
 * Tests that a user can fill out the onboarding form and see their carbon score.
 * @module test/integration.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useCarbonStore } from '../store/carbonStore';
import { calculateTotalFootprint } from '../utils/carbonCalculations';
import { generateRecommendations } from '../services/recommendations';
import { TransportMode, FuelType, DietType, OnboardingStep, DEFAULT_PROFILE, type CategoryType, type UserProfile } from '../types';

describe('Full User Flow Integration', () => {
  beforeEach(() => {
    /** Reset store state before each test */
    const store = useCarbonStore.getState();
    store.resetProfile();
  });

  it('completes the full onboarding-to-score flow', () => {
    const store = useCarbonStore.getState();

    /** Step 1: Verify initial state */
    expect(store.isOnboarded).toBe(false);
    expect(store.carbonScore).toBeNull();
    expect(store.currentStep).toBe(OnboardingStep.Transport);

    /** Step 2: Fill transport profile */
    store.setTransportProfile({
      primaryMode: TransportMode.Car,
      fuelType: FuelType.Gasoline,
      weeklyDistanceKm: 150,
      flightsPerYear: 2,
      averageFlightHours: 4,
    });
    store.setCurrentStep(OnboardingStep.Diet);

    /** Step 3: Fill diet profile */
    store.setDietProfile({
      dietType: DietType.Average,
      localFoodPercentage: 30,
      foodWastePercentage: 15,
    });
    store.setCurrentStep(OnboardingStep.Energy);

    /** Step 4: Fill energy profile */
    store.setEnergyProfile({
      monthlyElectricityKwh: 800,
      monthlyGasUsageTherms: 40,
      renewablePercentage: 10,
      householdSize: 3,
    });
    store.setCurrentStep(OnboardingStep.Shopping);

    /** Step 5: Fill shopping profile */
    store.setShoppingProfile({
      monthlySpendingInr: 30000,
      fastFashionFrequency: 'rarely',
      electronicsPerYear: 1,
      recyclingRate: 40,
    });
    store.setCurrentStep(OnboardingStep.Review);

    /** Step 6: Complete onboarding */
    store.completeOnboarding();

    /** Verify results */
    const updatedState = useCarbonStore.getState();
    expect(updatedState.isOnboarded).toBe(true);
    const score = updatedState.carbonScore;
    expect(score).not.toBeNull();
    if (score) {
      expect(score.totalAnnualKgCO2).toBeGreaterThan(0);
      expect(score.categories).toHaveLength(4);
    }
    expect(updatedState.recommendations.length).toBeGreaterThan(0);
    expect(updatedState.trendData.length).toBeGreaterThan(0);
  });

  it('tracks progress after completing actions', () => {
    const store = useCarbonStore.getState();

    /** Complete onboarding first */
    store.completeOnboarding();
    const afterOnboarding = useCarbonStore.getState();
    expect(afterOnboarding.progressLog).toHaveLength(0);

    /** Log a progress entry */
    store.addProgressEntry({
      actionId: 'tr-02',
      actionTitle: 'Carpool to work',
      category: 'transport' as CategoryType,
      kgCO2Saved: 100,
      notes: 'Started carpooling with a colleague',
    });

    const afterProgress = useCarbonStore.getState();
    expect(afterProgress.progressLog).toHaveLength(1);
    const entry = afterProgress.progressLog[0];
    expect(entry).toBeDefined();
    if (entry) {
      expect(entry.kgCO2Saved).toBe(100);
      expect(entry.actionTitle).toBe('Carpool to work');
    }
  });

  it('toggles action completion status', () => {
    const store = useCarbonStore.getState();
    store.completeOnboarding();

    const afterOnboarding = useCarbonStore.getState();
    const firstAction = afterOnboarding.recommendations[0];
    expect(firstAction).toBeDefined();
    if (firstAction) {
      expect(firstAction.isCompleted).toBe(false);

      /** Toggle action */
      store.toggleActionCompleted(firstAction.id);
      const afterToggle = useCarbonStore.getState();
      const toggledAction = afterToggle.recommendations.find((a) => a.id === firstAction.id);
      expect(toggledAction).toBeDefined();
      if (toggledAction) {
        expect(toggledAction.isCompleted).toBe(true);
      }

      /** Toggle back */
      store.toggleActionCompleted(firstAction.id);
      const afterSecondToggle = useCarbonStore.getState();
      const retoggledAction = afterSecondToggle.recommendations.find((a) => a.id === firstAction.id);
      expect(retoggledAction).toBeDefined();
      if (retoggledAction) {
        expect(retoggledAction.isCompleted).toBe(false);
      }
    }
  });

  it('calculation results match standalone function', () => {
    const profile: UserProfile = {
      ...DEFAULT_PROFILE,
      transport: {
        ...DEFAULT_PROFILE.transport,
        weeklyDistanceKm: 100,
        flightsPerYear: 1,
        averageFlightHours: 3,
      },
    };

    /** Store calculation */
    const store = useCarbonStore.getState();
    store.setUserProfile(profile);
    store.calculateScore();
    const storeScore = useCarbonStore.getState().carbonScore;

    /** Direct calculation */
    const directScore = calculateTotalFootprint(profile);

    expect(storeScore).not.toBeNull();
    if (storeScore) {
      expect(storeScore.totalAnnualKgCO2).toBe(directScore.totalAnnualKgCO2);
      expect(storeScore.categories.length).toBe(directScore.categories.length);
    }
  });

  it('recommendations are filtered based on user profile', () => {
    /** Vegan user should not see "go vegan" recommendation */
    const veganProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      diet: {
        ...DEFAULT_PROFILE.diet,
        dietType: DietType.Vegan,
      },
    };

    const score = calculateTotalFootprint(veganProfile);
    const recommendations = generateRecommendations(veganProfile, score);

    const hasGoVegan = recommendations.some((r) => r.id === 'dt-05');
    expect(hasGoVegan).toBe(false);

    /** But should still see vegetarian-related ones */
    const hasDietActions = recommendations.some((r) => r.category === 'diet');
    expect(hasDietActions).toBe(true);
  });

  it('resets profile to initial state', () => {
    const store = useCarbonStore.getState();
    store.completeOnboarding();

    const afterOnboarding = useCarbonStore.getState();
    expect(afterOnboarding.isOnboarded).toBe(true);

    store.resetProfile();

    const afterReset = useCarbonStore.getState();
    expect(afterReset.isOnboarded).toBe(false);
    expect(afterReset.carbonScore).toBeNull();
    expect(afterReset.recommendations).toHaveLength(0);
    expect(afterReset.progressLog).toHaveLength(0);
  });
});
