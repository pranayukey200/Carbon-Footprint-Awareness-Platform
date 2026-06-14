/**
 * @fileoverview Energy onboarding step component.
 * Collects monthly electricity usage, gas usage, renewable energy
 * percentage, and household size using accessible inputs and sliders.
 * @module components/Onboarding/EnergyStep
 */

import React from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { sanitizeNumber } from '../../utils/sanitize';

/**
 * Onboarding step for gathering household energy data.
 * Renders number inputs for kWh, therms, and household members,
 * plus a percentage slider for renewable sourcing.
 *
 * @returns Energy step form element
 */
export const EnergyStep: React.FC = () => {
  const energy = useCarbonStore((s) => s.userProfile.energy);
  const setEnergy = useCarbonStore((s) => s.setEnergyProfile);

  return (
    <fieldset className="step-content" aria-label="Energy details">
      <legend className="step-content__title">Tell us about your energy use</legend>

      {/* Monthly Electricity */}
      <div className="input-group">
        <label htmlFor="electricityKwh" className="input-group__label">
          Monthly electricity (kWh)
        </label>
        <input
          id="electricityKwh"
          type="number"
          min={0}
          max={2000}
          value={energy.monthlyElectricityKwh}
          onChange={(e) =>
            setEnergy({
              monthlyElectricityKwh: sanitizeNumber(e.target.value, 0),
            })
          }
          aria-label="Monthly electricity in kWh"
        />
      </div>

      {/* Monthly Gas */}
      <div className="input-group">
        <label htmlFor="gasUsage" className="input-group__label">
          Monthly gas (therms)
        </label>
        <input
          id="gasUsage"
          type="number"
          min={0}
          max={200}
          value={energy.monthlyGasUsageTherms}
          onChange={(e) =>
            setEnergy({
              monthlyGasUsageTherms: sanitizeNumber(e.target.value, 0),
            })
          }
          aria-label="Monthly gas usage in therms"
        />
      </div>

      {/* Renewable Percentage */}
      <div className="slider-group">
        <label htmlFor="renewable" className="slider-group__label">
          Renewable energy: {energy.renewablePercentage}%
        </label>
        <input
          id="renewable"
          type="range"
          min={0}
          max={100}
          step={5}
          value={energy.renewablePercentage}
          onChange={(e) =>
            setEnergy({
              renewablePercentage: sanitizeNumber(e.target.value, 0),
            })
          }
          aria-label={`Renewable energy: ${energy.renewablePercentage}%`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={energy.renewablePercentage}
        />
      </div>

      {/* Household Size */}
      <div className="input-group">
        <label htmlFor="householdSize" className="input-group__label">
          Household size
        </label>
        <input
          id="householdSize"
          type="number"
          min={1}
          max={10}
          value={energy.householdSize}
          onChange={(e) =>
            setEnergy({
              householdSize: sanitizeNumber(e.target.value, 1),
            })
          }
          aria-label="Number of people in household"
        />
      </div>
    </fieldset>
  );
};

export default EnergyStep;
