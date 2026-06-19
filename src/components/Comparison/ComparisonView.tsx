/**
 * @fileoverview Comparison view comparing user footprint vs city, national, and global benchmarks.
 * Includes animated progress bars and screen-reader friendly data tables.
 * @module components/Comparison/ComparisonView
 */

import React, { useEffect, useState } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { Card } from '../shared/Card';
import { formatCO2 } from '../../utils/formatters';

interface ComparisonBenchmark {
  readonly label: string;
  readonly kg: number;
}

/**
 * Renders the comparison page with horizontal bar charts.
 * WCAG 2.1 AA compliant with accessible tabular fallbacks.
 */
export const ComparisonView: React.FC = () => {
  const carbonScore = useCarbonStore((s) => s.carbonScore);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animated growth transition after component mounting
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!carbonScore) {
    return (
      <div className="comparison" aria-label="Comparison View Empty State">
        <Card className="score-card">
          <p className="empty-state__title">Calculate your score to compare averages.</p>
        </Card>
      </div>
    );
  }

  const userFootprint = carbonScore.totalAnnualKgCO2;
  const benchmarks: readonly ComparisonBenchmark[] = [
    { label: 'Your Footprint', kg: userFootprint },
    { label: 'Indian National Average', kg: 1900 },
    { label: 'India Urban Average (Estimate)', kg: 3200 },
    { label: 'Global Average', kg: carbonScore.globalComparison.worldAverageKg },
    { label: 'US National Average', kg: carbonScore.globalComparison.usAverageKg },
  ];

  // Find maximum to scale widths to 100%
  const maxKg = Math.max(...benchmarks.map((b) => b.kg), 1);
  const percentBelowUS = Math.max(
    0,
    Math.round(
      ((carbonScore.globalComparison.usAverageKg - userFootprint) /
        carbonScore.globalComparison.usAverageKg) *
        100,
    ),
  );

  const percentVsIndia = Math.round(
    (Math.abs(userFootprint - 1900) / 1900) * 100,
  );
  const isAboveIndia = userFootprint > 1900;

  return (
    <div className="comparison" aria-label="Footprint Comparison Page">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Comparison View</h1>
        <p className="dashboard__subtitle">
          See how your footprint compares to national and global benchmarks
        </p>
      </header>

      <div className="comparison__grid">
        <Card className="comparison__summary-card">
          <h2 className="card__title">How You Rank</h2>
          <p className="comparison__hero-text" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-relaxed)' }}>
            You emit <span className="highlight highlight--yellow">{percentBelowUS}% less</span> than the average US household,
            and are <span className="highlight highlight--green">{percentVsIndia}% {isAboveIndia ? 'above' : 'below'}</span> the average Indian per-capita footprint.
          </p>
          <p className="comparison__desc">
            Your estimated footprint is{' '}
            <strong className="mono-font">{formatCO2(userFootprint)}</strong> of CO₂ per year. The
            global target to limit warming to 1.5°C is under{' '}
            <strong className="mono-font">2,000 kg</strong> per person annually.
          </p>
        </Card>

        <Card className="comparison__chart-card" aria-label="Comparison Bar Chart">
          <h3 className="card__title">Annual Emissions Comparison (kg CO₂/year)</h3>

          <div className="comparison-bars" aria-hidden="true">
            {benchmarks.map((b) => {
              const width = animate ? `${(b.kg / maxKg) * 100}%` : '0%';
              const isUser = b.label === 'Your Footprint';
              return (
                <div key={b.label} className="comparison-bar-group">
                  <div className="comparison-bar-label">
                    <span>{b.label}</span>
                    <span className="mono-font">{formatCO2(b.kg)}</span>
                  </div>
                  <div className="comparison-bar-track">
                    <div
                      className={`comparison-bar-fill ${isUser ? 'comparison-bar-fill--user' : ''}`}
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Accessible screen-reader fallback table */}
          <table className="sr-only">
            <caption>Carbon emissions comparison data table</caption>
            <thead>
              <tr>
                <th scope="col">Entity</th>
                <th scope="col">Annual Emissions (kg CO₂/year)</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b) => (
                <tr key={b.label}>
                  <td>{b.label}</td>
                  <td>{b.kg} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

