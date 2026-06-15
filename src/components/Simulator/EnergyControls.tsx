/**
 * @fileoverview Energy inputs panel for Simulator.
 * @module components/Simulator/EnergyControls
 */

import React from 'react';

interface EnergyControlsProps {
  readonly simElec: number;
  readonly setSimElec: (v: number) => void;
  readonly simGas: number;
  readonly setSimGas: (v: number) => void;
  readonly simRenew: number;
  readonly setSimRenew: (v: number) => void;
  readonly simHouseSize: number;
  readonly setSimHouseSize: (v: number) => void;
}

/**
 * EnergyControls component renders energy input controls and sliders for the carbon footprint simulator.
 */
export const EnergyControls: React.FC<EnergyControlsProps> = ({
  simElec,
  setSimElec,
  simGas,
  setSimGas,
  simRenew,
  setSimRenew,
  simHouseSize,
  setSimHouseSize,
}) => {
  return (
    <>
      <div className="slider-group">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="sim-electricity" className="slider-group__label">Electricity (kWh/month)</label>
          <span>{simElec} kWh</span>
        </div>
        <input
          id="sim-electricity"
          type="range"
          min="0"
          max="2000"
          step="50"
          value={simElec}
          onChange={(e) => setSimElec(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="slider-group">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="sim-natural-gas" className="slider-group__label">Natural Gas (therms/month)</label>
          <span>{simGas} therms</span>
        </div>
        <input
          id="sim-natural-gas"
          type="range"
          min="0"
          max="200"
          step="5"
          value={simGas}
          onChange={(e) => setSimGas(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="slider-group">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="sim-renewable" className="slider-group__label">Clean Energy Tariff</label>
          <span>{simRenew}%</span>
        </div>
        <input
          id="sim-renewable"
          type="range"
          min="0"
          max="100"
          step="5"
          value={simRenew}
          onChange={(e) => setSimRenew(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="slider-group">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="sim-household-size" className="slider-group__label">Household Size</label>
          <span>{simHouseSize} persons</span>
        </div>
        <input
          id="sim-household-size"
          type="range"
          min="1"
          max="10"
          value={simHouseSize}
          onChange={(e) => setSimHouseSize(parseInt(e.target.value, 10))}
        />
      </div>
    </>
  );
};
export default EnergyControls;
