/**
 * @fileoverview Hero score card showing the user's total annual CO₂ footprint
 * with animated value and comparison against global/US/EU averages.
 * @module components/Dashboard/CarbonScore
 */

import type { ReactNode } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { formatCO2 } from '../../utils/formatters';
import { Card } from '../shared/Card';

/** Static comparison benchmarks (kg CO₂/year) */
const BENCHMARKS = [
  { label: 'World Avg', kg: 4000 },
  { label: 'US Avg', kg: 16000 },
  { label: 'EU Avg', kg: 6500 },
] as const;

/**
 * Displays the user's total annual CO₂ footprint with an animated score
 * and a row of global comparison benchmarks.
 * Renders an empty-state prompt when no score has been calculated yet.
 * @returns Rendered score card or empty state
 */
export function CarbonScore(): ReactNode {
  const carbonScore = useCarbonStore((s) => s.carbonScore);

  if (!carbonScore) {
    return (
      <Card className="score-card" aria-label="Carbon footprint score">
        <div className="empty-state">
          <p className="empty-state__icon" aria-hidden="true">
            🌍
          </p>
          <h2 className="empty-state__title">No Score Yet</h2>
          <p className="empty-state__desc">
            Complete the onboarding questionnaire to calculate your carbon footprint.
          </p>
        </div>
      </Card>
    );
  }

  const formattedTotal = formatCO2(carbonScore.totalAnnualKgCO2);

  return (
    <Card className="score-card" aria-label="Your annual carbon footprint score">
      <h2 className="visually-hidden">Your Carbon Footprint</h2>
      <p className="score-card__value" aria-live="polite">
        {formattedTotal}
      </p>
      <p className="score-card__unit">CO₂ per year</p>
      <p className="score-card__label">Your estimated annual carbon footprint</p>

      <div className="score-card__comparison" role="list" aria-label="Global average comparisons">
        {BENCHMARKS.map((b) => (
          <div className="comparison-item" role="listitem" key={b.label}>
            <p className="comparison-item__value">{formatCO2(b.kg)}</p>
            <p className="comparison-item__label">{b.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
