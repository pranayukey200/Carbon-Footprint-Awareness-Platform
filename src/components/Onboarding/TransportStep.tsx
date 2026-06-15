/**
 * @fileoverview Onboarding step for gathering transportation habits.
 * @module components/Onboarding/TransportStep
 */

import React from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { sanitizeNumber } from '../../utils/sanitize';
import { TRANSPORT_OPTIONS, FUEL_OPTIONS, FUEL_MODES } from '../../constants/onboardingOptions';

/**
 * Onboarding step for transport habits.
 *
 * @returns Transport step form element
 */
export const TransportStep: React.FC = () => {
  const transport = useCarbonStore((s) => s.userProfile.transport);
  const setTransport = useCarbonStore((s) => s.setTransportProfile);

  const showFuel = FUEL_MODES.has(transport.primaryMode);

  return (
    <fieldset className="step-content" aria-label="Transport details">
      <legend className="step-content__title">How do you get around?</legend>

      {/* Transport Mode */}
      <div className="radio-group" role="radiogroup" aria-label="Transport mode">
        {TRANSPORT_OPTIONS.map(({ value, label, icon }) => {
          const isSelected = transport.primaryMode === value;
          return (
            <label key={value} className={`radio-card${isSelected ? ' radio-card--selected' : ''}`}>
              <input
                type="radio"
                name="transportMode"
                value={value}
                checked={isSelected}
                onChange={() => setTransport({ primaryMode: value })}
                aria-label={`${label} mode`}
              />
              <div className="radio-card__icon" aria-hidden="true">
                {icon}
              </div>
              <span className="radio-card__label">{label}</span>
            </label>
          );
        })}
      </div>

      {/* Fuel Type (conditional) */}
      {showFuel && (
        <div style={{ marginTop: 'var(--space-6)' }}>
          <p className="slider-group__label" style={{ marginBottom: 'var(--space-3)' }}>
            What fuel type does your vehicle use?
          </p>
          <div className="radio-group" role="radiogroup" aria-label="Fuel type">
            {FUEL_OPTIONS.map(({ value, label }) => {
              const isSelected = transport.fuelType === value;
              return (
                <label key={value} className={`radio-card${isSelected ? ' radio-card--selected' : ''}`}>
                  <input
                    type="radio"
                    name="fuelType"
                    value={value}
                    checked={isSelected}
                    onChange={() => setTransport({ fuelType: value })}
                    aria-label={`${label} fuel`}
                  />
                  <span className="radio-card__label">{label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly Distance */}
      <div className="slider-group" style={{ marginTop: 'var(--space-6)' }}>
        <label htmlFor="weeklyDistance" className="slider-group__label">
          Weekly distance: {transport.weeklyDistanceKm} km
        </label>
        <input
          id="weeklyDistance"
          type="range"
          min={0}
          max={500}
          step={10}
          value={transport.weeklyDistanceKm}
          onChange={(e) => setTransport({ weeklyDistanceKm: sanitizeNumber(e.target.value) })}
          aria-label={`Weekly distance: ${transport.weeklyDistanceKm} km`}
          aria-valuemin={0}
          aria-valuemax={500}
          aria-valuenow={transport.weeklyDistanceKm}
        />
      </div>

      {/* Flights per Year */}
      <div className="input-group">
        <label htmlFor="flightsPerYear" className="input-group__label">
          Flights per year
        </label>
        <input
          id="flightsPerYear"
          type="number"
          className="input"
          min={0}
          max={20}
          value={transport.flightsPerYear}
          onChange={(e) => setTransport({ flightsPerYear: sanitizeNumber(e.target.value, 0) })}
          aria-label="Flights per year"
        />
      </div>

      {/* Average Flight Hours */}
      <div className="slider-group">
        <label htmlFor="flightHours" className="slider-group__label">
          Avg flight duration: {transport.averageFlightHours}h
        </label>
        <input
          id="flightHours"
          type="range"
          min={1}
          max={12}
          step={1}
          value={transport.averageFlightHours}
          onChange={(e) => setTransport({ averageFlightHours: sanitizeNumber(e.target.value, 1) })}
          aria-label={`Average flight hours: ${transport.averageFlightHours}`}
          aria-valuemin={1}
          aria-valuemax={12}
          aria-valuenow={transport.averageFlightHours}
        />
      </div>
    </fieldset>
  );
};

