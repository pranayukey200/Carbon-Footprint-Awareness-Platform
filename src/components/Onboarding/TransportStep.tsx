/**
 * @fileoverview Transport onboarding step component.
 * Collects transport mode, fuel type, weekly distance, and flight data
 * using accessible radio cards, sliders, and number inputs.
 * @module components/Onboarding/TransportStep
 */

import React from 'react';
import { TransportMode, FuelType } from '../../types';
import { useCarbonStore } from '../../store/carbonStore';
import { sanitizeNumber } from '../../utils/sanitize';

/** Transport mode options with emoji icons */
const TRANSPORT_OPTIONS: readonly { value: TransportMode; label: string }[] = [
  { value: TransportMode.Car, label: 'Car 🚗' },
  { value: TransportMode.PublicTransit, label: 'Public Transit 🚌' },
  { value: TransportMode.Bicycle, label: 'Bicycle 🚲' },
  { value: TransportMode.Walking, label: 'Walking 🚶' },
  { value: TransportMode.Motorcycle, label: 'Motorcycle 🏍️' },
  { value: TransportMode.ElectricCar, label: 'Electric Car ⚡' },
];

/** Fuel type options */
const FUEL_OPTIONS: readonly { value: FuelType; label: string }[] = [
  { value: FuelType.Gasoline, label: 'Gasoline' },
  { value: FuelType.Diesel, label: 'Diesel' },
  { value: FuelType.Hybrid, label: 'Hybrid' },
  { value: FuelType.Electric, label: 'Electric' },
];

/** Modes that require a fuel-type selector */
const FUEL_MODES = new Set<TransportMode>([TransportMode.Car, TransportMode.Motorcycle]);

/**
 * Onboarding step for gathering transportation habits.
 * Renders radio cards for mode selection, an optional fuel-type picker,
 * a distance slider, and flight inputs.
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
      <div className="radio-card" role="radiogroup" aria-label="Transport mode">
        {TRANSPORT_OPTIONS.map(({ value, label }) => (
          <label
            key={value}
            className={`radio-card__option${
              transport.primaryMode === value ? ' radio-card__option--selected' : ''
            }`}
          >
            <input
              type="radio"
              name="transportMode"
              value={value}
              checked={transport.primaryMode === value}
              onChange={() => setTransport({ primaryMode: value })}
              aria-label={label}
            />
            <span className="radio-card__label">{label}</span>
          </label>
        ))}
      </div>

      {/* Fuel Type (conditional) */}
      {showFuel && (
        <div className="radio-card" role="radiogroup" aria-label="Fuel type">
          {FUEL_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className={`radio-card__option${
                transport.fuelType === value ? ' radio-card__option--selected' : ''
              }`}
            >
              <input
                type="radio"
                name="fuelType"
                value={value}
                checked={transport.fuelType === value}
                onChange={() => setTransport({ fuelType: value })}
                aria-label={label}
              />
              <span className="radio-card__label">{label}</span>
            </label>
          ))}
        </div>
      )}

      {/* Weekly Distance */}
      <div className="slider-group">
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
          min={0}
          max={20}
          value={transport.flightsPerYear}
          onChange={(e) =>
            setTransport({
              flightsPerYear: sanitizeNumber(e.target.value, 0),
            })
          }
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
          onChange={(e) =>
            setTransport({
              averageFlightHours: sanitizeNumber(e.target.value, 1),
            })
          }
          aria-label={`Average flight hours: ${transport.averageFlightHours}`}
          aria-valuemin={1}
          aria-valuemax={12}
          aria-valuenow={transport.averageFlightHours}
        />
      </div>
    </fieldset>
  );
};

export default TransportStep;
