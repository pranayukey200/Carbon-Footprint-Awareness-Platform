/**
 * @fileoverview Interactive carbon footprint simulator view.
 * Coordinates input controls, Recharts graphs, and 2D canvas environmental visualizations.
 * @module components/Simulator/SimulatorView
 */

import React from 'react';
import { Card } from '../shared/Card';
import { SimulatorControls } from './SimulatorControls';
import { SimulatorProjectionCard } from './SimulatorProjectionCard';
import { useSimulatorState } from './useSimulatorState';

/**
 * Main Simulator coordinator page.
 * Manages local simulated state for all 12 input sliders and pushes updates on commit.
 */
export const SimulatorView: React.FC = () => {
  const {
    activeCategoryTab,
    setActiveCategoryTab,
    simState,
    updateSimState,
    simulatedScore,
    savings,
    chartData,
    pieData,
    successMessage,
    handleApply,
  } = useSimulatorState();

  return (
    <div
      className="simulator"
      aria-label="Carbon Footprint Simulator"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Card style={{ padding: 'var(--space-4)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-4)' }}>
            Modify Behavior
          </h2>
          <SimulatorControls
            activeCategoryTab={activeCategoryTab}
            setActiveCategoryTab={setActiveCategoryTab}
            simState={simState}
            updateSimState={updateSimState}
          />
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleApply}
            style={{ marginTop: 'var(--space-4)', width: '100%' }}
            aria-label="Commit simulated changes to permanent profile"
          >
            Apply to My Profile
          </button>
          {successMessage && (
            <p style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--color-success)', fontSize: 'var(--font-size-xs)' }}>
              {successMessage}
            </p>
          )}
        </Card>
      </div>

      <SimulatorProjectionCard
        simulatedScore={simulatedScore}
        chartData={chartData}
        pieData={pieData}
        savings={savings}
      />
    </div>
  );
};

export default SimulatorView;
