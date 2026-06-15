/**
 * @fileoverview Main sliders panel for Simulator.
 * Integrates category subtabs and delegates to specific control sets.
 * @module components/Simulator/SimulatorControls
 */

import React from 'react';
import { TravelControls } from './TravelControls';
import { DietControls } from './DietControls';
import { EnergyControls } from './EnergyControls';
import { ShoppingControls } from './ShoppingControls';
import type { SimState } from './types';

interface SimulatorControlsProps {
  readonly activeCategoryTab: 'transport' | 'diet' | 'energy' | 'shopping';
  readonly setActiveCategoryTab: (tab: 'transport' | 'diet' | 'energy' | 'shopping') => void;
  readonly simState: SimState;
  readonly updateSimState: <K extends keyof SimState>(key: K, val: SimState[K]) => void;
}

const TAB_LABELS: Record<string, string> = {
  transport: '🚗 Travel',
  diet: '🥗 Diet',
  energy: '⚡ Energy',
  shopping: '🛒 Shop',
};

/**
 * SimulatorControls renders tab switches and mounts the active lifestyle inputs component.
 */
export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  activeCategoryTab,
  setActiveCategoryTab,
  simState,
  updateSimState,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <nav
        style={{
          display: 'flex',
          gap: 'var(--space-1)',
          background: 'var(--color-bg-secondary)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
        aria-label="Behavior Categories"
      >
        {(['transport', 'diet', 'energy', 'shopping'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className="header__nav-btn"
            style={{
              flex: 1,
              padding: 'var(--space-2)',
              fontSize: 'var(--font-size-xs)',
              background: activeCategoryTab === tab ? 'var(--color-bg-tertiary)' : 'transparent',
              color: activeCategoryTab === tab ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontWeight: activeCategoryTab === tab ? 'bold' : 'normal',
            }}
            onClick={() => setActiveCategoryTab(tab)}
          >
            {TAB_LABELS[tab] ?? tab}
          </button>
        ))}
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {activeCategoryTab === 'transport' && (
          <TravelControls
            simDist={simState.dist}
            setSimDist={(v) => updateSimState('dist', v)}
            simMode={simState.mode}
            setSimMode={(v) => updateSimState('mode', v)}
            simFlights={simState.flights}
            setSimFlights={(v) => updateSimState('flights', v)}
            simFlightHours={simState.flightHours}
            setSimFlightHours={(v) => updateSimState('flightHours', v)}
            simFuel={simState.fuel}
            setSimFuel={(v) => updateSimState('fuel', v)}
          />
        )}

        {activeCategoryTab === 'diet' && (
          <DietControls
            simDiet={simState.diet}
            setSimDiet={(v) => updateSimState('diet', v)}
            simLocalFood={simState.localFood}
            setSimLocalFood={(v) => updateSimState('localFood', v)}
            simFoodWaste={simState.foodWaste}
            setSimFoodWaste={(v) => updateSimState('foodWaste', v)}
          />
        )}

        {activeCategoryTab === 'energy' && (
          <EnergyControls
            simElec={simState.elec}
            setSimElec={(v) => updateSimState('elec', v)}
            simGas={simState.gas}
            setSimGas={(v) => updateSimState('gas', v)}
            simRenew={simState.renew}
            setSimRenew={(v) => updateSimState('renew', v)}
            simHouseSize={simState.houseSize}
            setSimHouseSize={(v) => updateSimState('houseSize', v)}
          />
        )}

        {activeCategoryTab === 'shopping' && (
          <ShoppingControls
            simSpend={simState.spend}
            setSimSpend={(v) => updateSimState('spend', v)}
            simFashion={simState.fashion}
            setSimFashion={(v) => updateSimState('fashion', v)}
            simElectronics={simState.electronics}
            setSimElectronics={(v) => updateSimState('electronics', v)}
            simRecycle={simState.recycle}
            setSimRecycle={(v) => updateSimState('recycle', v)}
          />
        )}
      </div>
    </div>
  );
};

