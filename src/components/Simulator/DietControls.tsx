/**
 * @fileoverview Diet inputs panel for Simulator.
 * @module components/Simulator/DietControls
 */

import React from 'react';
import { DietType } from '../../types';

interface DietControlsProps {
  readonly simDiet: DietType;
  readonly setSimDiet: (v: DietType) => void;
  readonly simLocalFood: number;
  readonly setSimLocalFood: (v: number) => void;
  readonly simFoodWaste: number;
  readonly setSimFoodWaste: (v: number) => void;
}

/**
 * DietControls component renders diet options and sliders for the carbon footprint simulator.
 */
export const DietControls: React.FC<DietControlsProps> = ({
  simDiet,
  setSimDiet,
  simLocalFood,
  setSimLocalFood,
  simFoodWaste,
  setSimFoodWaste,
}) => {
  return (
    <>
      <div className="input-group">
        <label htmlFor="sim-diet-type" className="input-group__label">Dietary Pattern</label>
        <select
          id="sim-diet-type"
          className="input"
          value={simDiet}
          onChange={(e) => setSimDiet(e.target.value as DietType)}
        >
          <option value={DietType.MeatHeavy}>Meat Heavy 🥩</option>
          <option value={DietType.Average}>Average Diet 🍽️</option>
          <option value={DietType.Vegetarian}>Vegetarian 🥗</option>
          <option value={DietType.Vegan}>Vegan 🌱</option>
        </select>
      </div>

      <div className="slider-group">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="sim-local-food" className="slider-group__label">Local Food Ratio</label>
          <span>{simLocalFood}%</span>
        </div>
        <input
          id="sim-local-food"
          type="range"
          min="0"
          max="100"
          step="5"
          value={simLocalFood}
          onChange={(e) => setSimLocalFood(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="slider-group">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="sim-food-waste" className="slider-group__label">Food Waste Ratio</label>
          <span>{simFoodWaste}%</span>
        </div>
        <input
          id="sim-food-waste"
          type="range"
          min="0"
          max="100"
          step="5"
          value={simFoodWaste}
          onChange={(e) => setSimFoodWaste(parseInt(e.target.value, 10))}
        />
      </div>
    </>
  );
};
