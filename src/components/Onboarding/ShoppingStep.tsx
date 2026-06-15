/**
 * @fileoverview Shopping onboarding step component.
 * Collects monthly spending, fast-fashion frequency, electronics
 * purchases, and recycling rate using accessible inputs and controls.
 * @module components/Onboarding/ShoppingStep
 */

import React from 'react';
import type { ShoppingProfile } from '../../types';
import { useCarbonStore } from '../../store/carbonStore';
import { sanitizeNumber } from '../../utils/sanitize';

interface FashionOption {
  readonly value: ShoppingProfile['fastFashionFrequency'];
  readonly label: string;
  readonly icon: string;
}

/** Fast fashion frequency options */
const FASHION_OPTIONS: readonly FashionOption[] = [
  { value: 'never', label: 'Never', icon: '🌿' },
  { value: 'rarely', label: 'Rarely', icon: '🛒' },
  { value: 'sometimes', label: 'Sometimes', icon: '👕' },
  { value: 'often', label: 'Often', icon: '🛍️' },
];

/**
 * Onboarding step for gathering shopping and consumption habits.
 * Renders number inputs, radio cards for fast fashion frequency,
 * and a recycling-rate slider.
 *
 * @returns Shopping step form element
 */
export const ShoppingStep: React.FC = () => {
  const shopping = useCarbonStore((s) => s.userProfile.shopping);
  const setShopping = useCarbonStore((s) => s.setShoppingProfile);

  return (
    <fieldset className="step-content" aria-label="Shopping details">
      <legend className="step-content__title">Your shopping &amp; consumption</legend>

      {/* Monthly Spending */}
      <div className="input-group">
        <label htmlFor="monthlySpending" className="input-group__label">
          Monthly spending (USD)
        </label>
        <input
          id="monthlySpending"
          type="number"
          className="input"
          min={0}
          max={5000}
          value={shopping.monthlySpendingUsd}
          onChange={(e) =>
            setShopping({
              monthlySpendingUsd: sanitizeNumber(e.target.value, 0),
            })
          }
          aria-label="Monthly spending in USD"
        />
      </div>

      {/* Fast Fashion Frequency */}
      <div style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <p className="slider-group__label" style={{ marginBottom: 'var(--space-3)' }}>
          Fast fashion frequency
        </p>
        <div className="radio-group" role="radiogroup" aria-label="Fast fashion frequency">
          {FASHION_OPTIONS.map(({ value, label, icon }) => {
            const isSelected = shopping.fastFashionFrequency === value;
            return (
              <label
                key={value}
                className={`radio-card${isSelected ? ' radio-card--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="fastFashion"
                  value={value}
                  checked={isSelected}
                  onChange={() => setShopping({ fastFashionFrequency: value })}
                  aria-label={`Fast fashion: ${label}`}
                />
                <div className="radio-card__icon" aria-hidden="true">
                  {icon}
                </div>
                <span className="radio-card__label">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Electronics per Year */}
      <div className="input-group">
        <label htmlFor="electronicsPerYear" className="input-group__label">
          Electronics purchased per year
        </label>
        <input
          id="electronicsPerYear"
          type="number"
          className="input"
          min={0}
          max={20}
          value={shopping.electronicsPerYear}
          onChange={(e) =>
            setShopping({
              electronicsPerYear: sanitizeNumber(e.target.value, 0),
            })
          }
          aria-label="Electronics purchased per year"
        />
      </div>

      {/* Recycling Rate */}
      <div className="slider-group">
        <label htmlFor="recyclingRate" className="slider-group__label">
          Recycling rate: {shopping.recyclingRate}%
        </label>
        <input
          id="recyclingRate"
          type="range"
          min={0}
          max={100}
          step={5}
          value={shopping.recyclingRate}
          onChange={(e) => setShopping({ recyclingRate: sanitizeNumber(e.target.value, 0) })}
          aria-label={`Recycling rate: ${shopping.recyclingRate}%`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={shopping.recyclingRate}
        />
      </div>
    </fieldset>
  );
};

