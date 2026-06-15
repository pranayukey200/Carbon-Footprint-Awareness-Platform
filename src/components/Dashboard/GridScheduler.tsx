/**
 * @fileoverview Scheduler card warning users about local power grid carbon loads.
 * @module components/Dashboard/GridScheduler
 */

import React from 'react';
import { Card } from '../shared/Card';

export const GridScheduler: React.FC = () => {
  const currentHour = new Date().getHours();
  let gridStatus = 'Moderate';
  let gridColor = 'var(--color-warning)';
  let recommendation = 'Run heavy appliances later in the evening or tomorrow morning.';

  if (currentHour >= 10 && currentHour <= 15) {
    gridStatus = 'Clean (Low Carbon)';
    gridColor = 'var(--color-excellent)';
    recommendation = 'Perfect time to charge your EV, run the washer, or cook!';
  } else if (currentHour >= 18 && currentHour <= 22) {
    gridStatus = 'Dirty (High Peak)';
    gridColor = 'var(--color-error)';
    recommendation = 'Avoid running heavy appliances. Grid is using fossil fuels.';
  } else {
    gridStatus = 'Optimal (Base Load)';
    gridColor = 'var(--color-excellent)';
    recommendation = 'Grid emissions are stable. Normal usage is fine.';
  }

  return (
    <Card aria-label="Dynamic Grid Intensity Scheduler" style={{ padding: 'var(--space-4)' }}>
      <h3 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--font-size-lg)' }}>⚡ Grid Intensity Scheduler</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Current Grid State:</span>
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-bold)',
            padding: 'var(--space-1) var(--space-3)',
            borderRadius: 'var(--radius-full)',
            background: gridColor,
            color: 'var(--color-text-inverse)',
          }}
        >
          {gridStatus}
        </span>
      </div>
      <p style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 var(--space-4) 0', lineHeight: 'var(--line-height-relaxed)' }}>
        {recommendation}
      </p>
      <h4 style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Grid Cleanliness Outlook Today:</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)' }}>
          <span>🌅 Morning (6am - 10am)</span>
          <span style={{ color: 'var(--color-warning)' }}>Moderate</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)' }}>
          <span>☀️ Mid-day (10am - 3pm)</span>
          <span style={{ color: 'var(--color-excellent)', fontWeight: 'bold' }}>Clean (Solar peak)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)' }}>
          <span>🌇 Evening (6pm - 10pm)</span>
          <span style={{ color: 'var(--color-error)' }}>Dirty (Peak demand)</span>
        </div>
      </div>
    </Card>
  );
};
export default GridScheduler;
