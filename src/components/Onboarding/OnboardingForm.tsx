/**
 * @fileoverview Main onboarding form orchestrator.
 * Manages step navigation, renders the active step component,
 * and handles keyboard-navigable Back / Next / Calculate buttons.
 * @module components/Onboarding/OnboardingForm
 */

import React, { useCallback } from 'react';
import { OnboardingStep } from '../../types';
import { useCarbonStore } from '../../store/carbonStore';
import { StepIndicator } from './StepIndicator';
import { PersonalStep } from './PersonalStep';
import { TransportStep } from './TransportStep';
import { DietStep } from './DietStep';
import { EnergyStep } from './EnergyStep';
import { ShoppingStep } from './ShoppingStep';
import { ReviewSummary } from './ReviewSummary';

/** Map of step index → component */
const STEP_COMPONENTS: Readonly<Record<number, React.FC>> = {
  [OnboardingStep.Personal]: PersonalStep,
  [OnboardingStep.Transport]: TransportStep,
  [OnboardingStep.Diet]: DietStep,
  [OnboardingStep.Energy]: EnergyStep,
  [OnboardingStep.Shopping]: ShoppingStep,
};

/**
 * Main onboarding wizard form.
 *
 * @returns Onboarding form element
 */
export const OnboardingForm: React.FC = () => {
  const currentStep = useCarbonStore((s) => s.currentStep);
  const setCurrentStep = useCarbonStore((s) => s.setCurrentStep);
  const completeOnboarding = useCarbonStore((s) => s.completeOnboarding);
  const userProfile = useCarbonStore((s) => s.userProfile);

  const isReview = currentStep === OnboardingStep.Review;
  const isFirstStep = currentStep === OnboardingStep.Personal;

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
          aria-valuemax={5}
          aria-label={`Onboarding progress: ${Math.round((currentStep / 5) * 100)}%`}
        >
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-tertiary))',
              width: `${(currentStep / 5) * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </header>

      {/* Active step or review */}
      {isReview ? <ReviewSummary profile={userProfile} /> : StepComponent && <StepComponent />}

      <div className="step-actions">
        <button
          type="button"
          className="btn btn--secondary"
          disabled={isFirstStep}
          onClick={handleBack}
          onKeyDown={handleKeyDown(handleBack)}
          aria-label="Go to previous step"
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn--primary"
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

