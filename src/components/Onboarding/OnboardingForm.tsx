/**
 * @fileoverview Main onboarding form orchestrator.
 * Manages step navigation, renders the active step component,
 * displays a review summary on the final step, and handles
 * keyboard-navigable Back / Next / Calculate buttons.
 * @module components/Onboarding/OnboardingForm
 */

import React, { useCallback } from 'react';
import { OnboardingStep } from '../../types';
import type { UserProfile } from '../../types';
import { useCarbonStore } from '../../store/carbonStore';
import { StepIndicator } from './StepIndicator';
import { TransportStep } from './TransportStep';
import { DietStep } from './DietStep';
import { EnergyStep } from './EnergyStep';
import { ShoppingStep } from './ShoppingStep';

/** Map of step index → component */
const STEP_COMPONENTS: Readonly<Record<number, React.FC>> = {
  [OnboardingStep.Transport]: TransportStep,
  [OnboardingStep.Diet]: DietStep,
  [OnboardingStep.Energy]: EnergyStep,
  [OnboardingStep.Shopping]: ShoppingStep,
};

/**
 * Renders the review summary card showing all user-entered profile values.
 * @param props - Object containing the user profile from the store
 */
const ReviewSummary: React.FC<{
  readonly profile: UserProfile;
}> = ({ profile }) => (
  <section className="step-content review-card" aria-label="Review your inputs">
    <h3 className="step-content__title">Review Your Inputs</h3>
    <dl className="review-card__list">
      <dt>Transport</dt>
      <dd>
        {profile.transport.primaryMode} · {profile.transport.weeklyDistanceKm} km/wk ·{' '}
        {profile.transport.flightsPerYear} flights/yr
      </dd>
      <dt>Diet</dt>
      <dd>
        {profile.diet.dietType} · {profile.diet.localFoodPercentage}% local ·{' '}
        {profile.diet.foodWastePercentage}% waste
      </dd>
      <dt>Energy</dt>
      <dd>
        {profile.energy.monthlyElectricityKwh} kWh · {profile.energy.monthlyGasUsageTherms} therms ·{' '}
        {profile.energy.renewablePercentage}% renewable · {profile.energy.householdSize} people
      </dd>
      <dt>Shopping</dt>
      <dd>
        ${profile.shopping.monthlySpendingUsd}/mo · Fashion: {profile.shopping.fastFashionFrequency}
        · {profile.shopping.electronicsPerYear} electronics/yr · {profile.shopping.recyclingRate}%
        recycled
      </dd>
    </dl>
  </section>
);

/**
 * Main onboarding wizard form. Renders the step indicator, the active
 * step component (or review summary), and accessible navigation buttons.
 *
 * @returns Onboarding form element
 */
export const OnboardingForm: React.FC = () => {
  const currentStep = useCarbonStore((s) => s.currentStep);
  const setCurrentStep = useCarbonStore((s) => s.setCurrentStep);
  const completeOnboarding = useCarbonStore((s) => s.completeOnboarding);
  const userProfile = useCarbonStore((s) => s.userProfile);

  const isReview = currentStep === OnboardingStep.Review;
  const isFirstStep = currentStep === OnboardingStep.Transport;

  /** Navigate to the previous step */
  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep((currentStep - 1) as OnboardingStep);
    }
  }, [currentStep, isFirstStep, setCurrentStep]);

  /** Navigate to the next step or complete onboarding */
  const handleNext = useCallback(() => {
    if (isReview) {
      completeOnboarding();
    } else {
      setCurrentStep((currentStep + 1) as OnboardingStep);
    }
  }, [currentStep, isReview, completeOnboarding, setCurrentStep]);

  /** Keyboard handler for button-like key events */
  const handleKeyDown = useCallback(
    (action: () => void) => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        action();
      }
    },
    [],
  );

  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="onboarding" role="form" aria-label="Carbon footprint onboarding">
      <header className="onboarding__header">
        <h2 className="onboarding__title">Calculate Your Carbon Footprint</h2>
        <StepIndicator currentStep={currentStep} />
        <div
          className="onboarding__progress-bar"
          style={{
            height: '4px',
            background: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginTop: 'var(--space-4)',
          }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label={`Onboarding progress: ${Math.round((currentStep / 4) * 100)}%`}
        >
          <div
            style={{
              height: '100%',
              background:
                'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-tertiary))',
              width: `${(currentStep / 4) * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </header>

      {/* Active step or review */}
      {isReview ? <ReviewSummary profile={userProfile} /> : StepComponent && <StepComponent />}

      {/* Navigation */}
      <div className="step-actions">
        <button
          type="button"
          className="step-actions__btn step-actions__btn--back"
          disabled={isFirstStep}
          onClick={handleBack}
          onKeyDown={handleKeyDown(handleBack)}
          aria-label="Go to previous step"
        >
          Back
        </button>
        <button
          type="button"
          className="step-actions__btn step-actions__btn--next"
          onClick={handleNext}
          onKeyDown={handleKeyDown(handleNext)}
          aria-label={isReview ? 'Calculate my carbon footprint' : 'Go to next step'}
        >
          {isReview ? 'Calculate My Footprint' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingForm;
