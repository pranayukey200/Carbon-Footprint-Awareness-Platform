/**
 * @fileoverview Diet onboarding step component.
 * Collects dietary pattern, local food percentage, and food waste
 * percentage using accessible radio cards and range sliders.
 * @module components/Onboarding/DietStep
 */

import React from 'react';
import { DietType } from '../../types';
import { useCarbonStore } from '../../store/carbonStore';
import { sanitizeNumber } from '../../utils/sanitize';

interface DietOption {
  readonly value: DietType;
  readonly label: string;
  readonly icon: string;
}

/** Diet type options with emoji icons */
const DIET_OPTIONS: readonly DietOption[] = [
  { value: DietType.MeatHeavy, label: 'Meat Heavy', icon: '🥩' },
  { value: DietType.Average, label: 'Average', icon: '🍽️' },
  { value: DietType.Vegetarian, label: 'Vegetarian', icon: '🥗' },
  { value: DietType.Vegan, label: 'Vegan', icon: '🌱' },
];

/**
 * Onboarding step for gathering dietary habits.
 * Renders radio cards for diet selection and percentage sliders
 * for local-food sourcing and food-waste levels.
 *
 * @returns Diet step form element
 */
export const DietStep: React.FC = () => {
  const diet = useCarbonStore((s) => s.userProfile.diet);
  const setDiet = useCarbonStore((s) => s.setDietProfile);

  return (
    <fieldset className="step-content" aria-label="Diet details">
      <legend className="step-content__title">What's your diet like?</legend>

      {/* Diet Type */}
      <div className="radio-group" role="radiogroup" aria-label="Diet type">
        {DIET_OPTIONS.map(({ value, label, icon }) => {
          const isSelected = diet.dietType === value;
          return (
            <label key={value} className={`radio-card${isSelected ? ' radio-card--selected' : ''}`}>
              <input
                type="radio"
                name="dietType"
                value={value}
                checked={isSelected}
                onChange={() => setDiet({ dietType: value })}
                aria-label={`${label} diet`}
              />
              <div className="radio-card__icon" aria-hidden="true">
                {icon}
              </div>
              <span className="radio-card__label">{label}</span>
            </label>
          );
        })}
      </div>

      {/* Local Food Percentage */}
      <div className="slider-group">
        <label htmlFor="localFood" className="slider-group__label">
          Local food sourcing: {diet.localFoodPercentage}%
        </label>
        <input
          id="localFood"
          type="range"
          min={0}
          max={100}
          step={5}
          value={diet.localFoodPercentage}
          onChange={(e) => setDiet({ localFoodPercentage: sanitizeNumber(e.target.value) })}
          aria-label={`Local food percentage: ${diet.localFoodPercentage}%`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={diet.localFoodPercentage}
        />
      </div>

      {/* Food Waste Percentage */}
      <div className="slider-group">
        <label htmlFor="foodWaste" className="slider-group__label">
          Food waste: {diet.foodWastePercentage}%
        </label>
        <input
          id="foodWaste"
          type="range"
          min={0}
          max={100}
          step={5}
          value={diet.foodWastePercentage}
          onChange={(e) => setDiet({ foodWastePercentage: sanitizeNumber(e.target.value) })}
          aria-label={`Food waste percentage: ${diet.foodWastePercentage}%`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={diet.foodWastePercentage}
        />
      </div>
    </fieldset>
  );
};

