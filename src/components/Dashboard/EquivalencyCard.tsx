/**
 * @fileoverview Card component rendering relatable environmental equivalency indicators.
 * @module components/Dashboard/EquivalencyCard
 */

import React from 'react';
import { Card } from '../shared/Card';

interface EquivalencyCardProps {
  readonly scoreValue: number;
}

/**
 * EquivalencyCard component showing relatable metrics like trees planted, flights, and phone charges for a given carbon score.
 */
export const EquivalencyCard: React.FC<EquivalencyCardProps> = ({ scoreValue }) => {
  // 1 flight Mumbai-Delhi is approx 200 kg CO2. 1 Bangalore tree absorbs 22 kg CO2/year.
  const flightsSaved = Math.round(scoreValue / 200);
  const treesPlanted = Math.round(scoreValue / 22);
  const phoneCharges = Math.round(scoreValue / 0.008);

  return (
    <Card aria-label="Carbon equivalency metrics" style={{ padding: 'var(--space-4)' }}>
      <h3 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--font-size-lg)' }}>🌿 Impact Equivalency</h3>
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
        Your annual carbon footprint ({scoreValue.toLocaleString()} kg CO₂) is equivalent to:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: '2rem' }}>🌳</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>{treesPlanted.toLocaleString()} Trees</h4>
            <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Planted and growing for 10 years in Bangalore to offset</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: '2rem' }}>✈️</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>{flightsSaved.toLocaleString()} Flights</h4>
            <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Round-trip passenger flights between Mumbai and Delhi</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: '2rem' }}>📱</span>
          <div>
            <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>{phoneCharges.toLocaleString()} Charges</h4>
            <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Smartphones charged fully from empty</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
