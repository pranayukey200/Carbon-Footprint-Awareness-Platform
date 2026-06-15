/**
 * @fileoverview Travel inputs panel for Simulator.
 * @module components/Simulator/TravelControls
 */

import React from 'react';
import { TransportMode, FuelType } from '../../types';

interface TravelControlsProps {
  readonly simDist: number;
  readonly setSimDist: (v: number) => void;
  readonly simMode: TransportMode;
  readonly setSimMode: (v: TransportMode) => void;
  readonly simFlights: number;
  readonly setSimFlights: (v: number) => void;
  readonly simFlightHours: number;
  readonly setSimFlightHours: (v: number) => void;
  readonly simFuel: FuelType;
  readonly setSimFuel: (v: FuelType) => void;
}

/**
 * TravelControls component renders vehicle selection, fuel types, and flight sliders for the carbon footprint simulator.
 */
export const TravelControls: React.FC<TravelControlsProps> = ({
  simDist,
  setSimDist,
  simMode,
  setSimMode,
  simFlights,
  setSimFlights,
  simFlightHours,
  setSimFlightHours,
  simFuel,
  setSimFuel,
}) => {
  return (
    <>
      <div className="input-group">
        <label htmlFor="sim-transport-mode" className="input-group__label">Primary Mode</label>
        <select
          id="sim-transport-mode"
          className="input"
          value={simMode}
          onChange={(e) => setSimMode(e.target.value as TransportMode)}
        >
          <option value={TransportMode.Car}>Car 🚗</option>
          <option value={TransportMode.ElectricCar}>Electric Car ⚡</option>
          <option value={TransportMode.PublicTransit}>Public Transit 🚌</option>
          <option value={TransportMode.Motorcycle}>Motorcycle 🏍️</option>
          <option value={TransportMode.Bicycle}>Bicycle 🚲</option>
          <option value={TransportMode.Walking}>Walking 🚶</option>
        </select>
      </div>

      {(simMode === TransportMode.Car || simMode === TransportMode.Motorcycle) && (
        <div className="input-group">
          <label htmlFor="sim-fuel-type" className="input-group__label">Fuel Type</label>
          <select
            id="sim-fuel-type"
            className="input"
            value={simFuel}
            onChange={(e) => setSimFuel(e.target.value as FuelType)}
          >
            <option value={FuelType.Gasoline}>Gasoline</option>
            <option value={FuelType.Diesel}>Diesel</option>
            <option value={FuelType.Hybrid}>Hybrid</option>
            <option value={FuelType.Electric}>Electric</option>
          </select>
        </div>
      )}

      <div className="slider-group">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="sim-weekly-distance" className="slider-group__label">Weekly Commute (km)</label>
          <span>{simDist} km</span>
        </div>
        <input
          id="sim-weekly-distance"
          type="range"
          min="0"
          max="500"
          step="10"
          value={simDist}
          onChange={(e) => setSimDist(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="slider-group">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="sim-flights" className="slider-group__label">Flights per Year</label>
          <span>{simFlights} flights</span>
        </div>
        <input
          id="sim-flights"
          type="range"
          min="0"
          max="20"
          value={simFlights}
          onChange={(e) => setSimFlights(parseInt(e.target.value, 10))}
        />
      </div>

      {simFlights > 0 && (
        <div className="slider-group">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label htmlFor="sim-flight-hours" className="slider-group__label">Avg Flight Duration</label>
            <span>{simFlightHours} hrs</span>
          </div>
          <input
            id="sim-flight-hours"
            type="range"
            min="1"
            max="12"
            value={simFlightHours}
            onChange={(e) => setSimFlightHours(parseInt(e.target.value, 10))}
          />
        </div>
      )}
    </>
  );
};
export default TravelControls;
