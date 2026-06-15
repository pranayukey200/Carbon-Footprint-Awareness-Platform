/**
 * @fileoverview Shopping inputs panel for Simulator.
 * @module components/Simulator/ShoppingControls
 */

import React from 'react';

interface ShoppingControlsProps {
  readonly simSpend: number;
  readonly setSimSpend: (v: number) => void;
  readonly simFashion: 'never' | 'rarely' | 'sometimes' | 'often';
  readonly setSimFashion: (v: 'never' | 'rarely' | 'sometimes' | 'often') => void;
  readonly simElectronics: number;
  readonly setSimElectronics: (v: number) => void;
  readonly simRecycle: number;
  readonly setSimRecycle: (v: number) => void;
}

/**
 * ShoppingControls component renders spending, fashion, and electronics options/sliders for the carbon footprint simulator.
 */
export const ShoppingControls: React.FC<ShoppingControlsProps> = ({
  simSpend,
  setSimSpend,
  simFashion,
  setSimFashion,
  simElectronics,
  setSimElectronics,
  simRecycle,
  setSimRecycle,
}) => {
  return (
    <>
      <div className="slider-group">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="sim-monthly-spending" className="slider-group__label">Monthly Spending</label>
          <span>${simSpend}</span>
        </div>
        <input
          id="sim-monthly-spending"
          type="range"
          min="0"
          max="5000"
          step="100"
          value={simSpend}
          onChange={(e) => setSimSpend(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="input-group">
        <label htmlFor="sim-fashion" className="input-group__label">Fast Fashion Frequency</label>
        <select
          id="sim-fashion"
          className="input"
          value={simFashion}
          onChange={(e) => setSimFashion(e.target.value as 'never' | 'rarely' | 'sometimes' | 'often')}
        >
          <option value="never">Never Buy Fast Fashion</option>
          <option value="rarely">Rarely</option>
          <option value="sometimes">Sometimes</option>
          <option value="often">Often</option>
        </select>
      </div>

      <div className="slider-group">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="sim-electronics" className="slider-group__label">New Electronics/Year</label>
          <span>{simElectronics} devices</span>
        </div>
        <input
          id="sim-electronics"
          type="range"
          min="0"
          max="20"
          value={simElectronics}
          onChange={(e) => setSimElectronics(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="slider-group">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="sim-recycling" className="slider-group__label">Recycling Rate</label>
          <span>{simRecycle}%</span>
        </div>
        <input
          id="sim-recycling"
          type="range"
          min="0"
          max="100"
          step="5"
          value={simRecycle}
          onChange={(e) => setSimRecycle(parseInt(e.target.value, 10))}
        />
      </div>
    </>
  );
};
export default ShoppingControls;
