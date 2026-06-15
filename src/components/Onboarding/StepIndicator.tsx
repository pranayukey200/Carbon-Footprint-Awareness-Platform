/**
 * @fileoverview Step progress indicator for the onboarding wizard.
 * Renders numbered dots with labels, connecting lines, and
 * active/completed visual states for each onboarding step.
 * @module components/Onboarding/StepIndicator
 */

import React from 'react';
import type { OnboardingStep } from '../../types';

/** Labels displayed beneath each step dot */
const STEP_LABELS: readonly string[] = [
  'Personal',
  'Transport',
  'Diet',
  'Energy',
  'Shopping',
  'Review',
] as const;

/** Props for the {@link StepIndicator} component */
interface StepIndicatorProps {
  /** Currently active onboarding step */
  readonly currentStep: OnboardingStep;
  /** Total number of steps to display (defaults to 6) */
  readonly totalSteps?: number;
}

/**
 * Renders a horizontal step-progress bar with numbered dots, connecting
 * lines, and labels. Completed steps show a checkmark; the active step
 * is visually highlighted.
 *
 * @param props - {@link StepIndicatorProps}
 * @returns Accessible step indicator element
 */
export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps = 6 }) => {
  /**
   * Returns the BEM modifier class for a given step index.
   * @param index - Zero-based step index
   */
  const getModifier = (index: number): string => {
    if (index < currentStep) {return 'step-indicator__step--completed';}
    if (index === currentStep) {return 'step-indicator__step--active';}
    return '';
  };

  /**
   * Generates the descriptive ARIA label for a step.
   * @param index - Zero-based step index
   */
  const getAriaLabel = (index: number): string => {
    const label = STEP_LABELS[index] ?? '';
    let status = '';
    if (index < currentStep) {
      status = ' (completed)';
    } else if (index === currentStep) {
      status = ' (current)';
    }
    return `Step ${index + 1}: ${label}${status}`;
  };

  return (
    <nav className="step-indicator" aria-label="Onboarding progress">
      <ol className="step-indicator__list" role="list">
        {Array.from({ length: totalSteps }, (_, index) => (
          <li key={index} className={`step-indicator__step ${getModifier(index)}`}>
            {/* Connecting line before all dots except the first */}
            {index > 0 && (
              <span
                className={`step-indicator__line${
                  index <= currentStep ? ' step-indicator__line--active' : ''
                }`}
                aria-hidden="true"
              />
            )}

            <span
              className={`step-indicator__dot${
                index < currentStep ? ' step-indicator__dot--completed' : ''
              }${index === currentStep ? ' step-indicator__dot--active' : ''}`}
              role="img"
              aria-label={getAriaLabel(index)}
            >
              {index < currentStep ? '✓' : index + 1}
            </span>

            <span className="step-indicator__label" aria-hidden="true">
              {STEP_LABELS[index]}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepIndicator;
