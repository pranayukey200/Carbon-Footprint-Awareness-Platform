import type { ReactNode } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { CarbonScore } from './CarbonScore';
import { CategoryBreakdown } from './CategoryBreakdown';
import { TrendChart } from './TrendChart';
import { Card } from '../shared/Card';

export function Dashboard(): ReactNode {
  const carbonScore = useCarbonStore((s) => s.carbonScore);
  const scoreValue = carbonScore ? carbonScore.totalAnnualKgCO2 : 0;

  // Calculations for Equivalency Metrics
  const treesPlanted = Math.round(scoreValue / 22);
  const milesDriven = Math.round(scoreValue / 0.4);
  const phoneCharges = Math.round(scoreValue / 0.008);

  // Grid Intensity calculation based on local time
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
    <div className="dashboard" role="main" aria-label="Carbon footprint dashboard" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <header className="dashboard__header">
        <h1 className="dashboard__title">Your Dashboard</h1>
        <p className="dashboard__subtitle">Track, understand, and reduce your carbon footprint</p>
      </header>

      <div className="dashboard__grid">
        <div className="dashboard__full-width">
          <CarbonScore />
        </div>
        <CategoryBreakdown />
        <TrendChart />
      </div>

      {/* Standout & Retention Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        {/* Equivalency Metrics */}
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
                <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Planted and growing for 10 years to offset</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: '2rem' }}>🚗</span>
              <div>
                <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>{milesDriven.toLocaleString()} Miles</h4>
                <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Driven by a standard gasoline-powered car</p>
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

        {/* Dynamic Grid Intensity */}
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
                color: 'var(--color-text-inverse)'
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
      </div>
    </div>
  );
}
