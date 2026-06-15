import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { VirtualPlanet } from './VirtualPlanet';
import { SimulatorCharts } from './SimulatorCharts';
import { formatCO2 } from '../../utils/formatters';

interface SimulatorProjectionCardProps {
  readonly simulatedScore: number;
  readonly chartData: readonly { name: string; Baseline: number; Simulated: number }[];
  readonly pieData: readonly { name: string; value: number; fill: string }[];
  readonly savings: number;
}

/**
 * SimulatorProjectionCard component shows the VirtualPlanet and simulator charts/metrics.
 */
export const SimulatorProjectionCard: React.FC<SimulatorProjectionCardProps> = ({
  simulatedScore,
  chartData,
  pieData,
  savings,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'bar' | 'pie'>('bar');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <VirtualPlanet simulatedScore={simulatedScore} />

      <Card style={{ padding: 'var(--space-4)' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-4)',
          }}
        >
          <h3 style={{ margin: 0 }}>Simulated Projection</h3>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--color-bg-secondary)', padding: '2px', borderRadius: 'var(--radius-md)' }}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setActiveChartTab('bar')}
              style={{
                padding: 'var(--space-1) var(--space-2)',
                fontSize: 'var(--font-size-xs)',
                background: activeChartTab === 'bar' ? 'var(--color-bg-tertiary)' : 'transparent',
              }}
              aria-label="Compare Chart View"
            >
              Compare
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setActiveChartTab('pie')}
              style={{
                padding: 'var(--space-1) var(--space-2)',
                fontSize: 'var(--font-size-xs)',
                background: activeChartTab === 'pie' ? 'var(--color-bg-tertiary)' : 'transparent',
              }}
              aria-label="Proportions Chart View"
            >
              Proportions
            </button>
          </div>
        </header>

        <SimulatorCharts activeChartTab={activeChartTab} chartData={chartData} pieData={pieData} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'var(--space-4)',
            borderTop: '1px solid var(--color-border)',
            paddingTop: 'var(--space-3)',
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Simulated Footprint
            </p>
            <p style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
              {formatCO2(simulatedScore)}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Annual Savings
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'bold',
                color: savings >= 0 ? 'var(--color-success)' : 'var(--color-error)',
              }}
            >
              {savings >= 0 ? '-' : '+'}
              {formatCO2(Math.abs(savings))}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
