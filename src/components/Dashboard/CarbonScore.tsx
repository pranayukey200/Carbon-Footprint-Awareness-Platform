import React, { useState, useEffect } from 'react';
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
export function CarbonScore(): React.JSX.Element {
  const carbonScore = useCarbonStore((s) => s.carbonScore);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!carbonScore) return;
    const start = 0;
    const end = carbonScore.totalAnnualKgCO2;
    if (start === end) {
      setAnimatedScore(end);
      return;
    }

    const duration = 1000;
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress); // easeOutQuad
      const current = Math.round(start + (end - start) * easeProgress);
      setAnimatedScore(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [carbonScore]);

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

  // Circular calculations: radius 80 -> circumference approx 502.65
  const circumference = 502.655;
  const maxBudget = 20000; // 20 tonnes maximum scale
  const percent = Math.min(100, Math.max(0, (carbonScore.totalAnnualKgCO2 / maxBudget) * 100));
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  let ringColor = 'var(--color-excellent)';
  if (carbonScore.totalAnnualKgCO2 >= 12000) {
    ringColor = 'var(--color-error)';
  } else if (carbonScore.totalAnnualKgCO2 >= 6000) {
    ringColor = 'var(--color-warning)';
  }

  return (
    <Card className="score-card" aria-label="Your annual carbon footprint score">
      <h2 className="visually-hidden">Your Carbon Footprint</h2>

      <div
        className="score-card__ring-wrapper"
        style={{
          position: 'relative',
          width: '220px',
          height: '220px',
          margin: '0 auto var(--space-6) auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="220"
          height="220"
          style={{
            transform: 'rotate(-90deg)',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx="110"
            cy="110"
            r="80"
            fill="none"
            stroke="var(--color-bg-tertiary)"
            strokeWidth="12"
          />
          {/* Foreground animated circle */}
          <circle
            cx="110"
            cy="110"
            r="80"
            fill="none"
            stroke={ringColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-out, stroke 1s ease-out',
            }}
          />
        </svg>

        <div style={{ zIndex: 1, textAlign: 'center' }}>
          <p
            className="score-card__value"
            aria-live="polite"
            style={{ fontSize: 'var(--font-size-3xl)', margin: 0 }}
          >
            {formatCO2(animatedScore)}
          </p>
          <p
            className="score-card__unit"
            style={{
              margin: 0,
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
            }}
          >
            CO₂ per year
          </p>
        </div>
      </div>

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
