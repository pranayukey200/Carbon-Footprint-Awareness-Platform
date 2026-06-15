/**
 * @fileoverview Score gauge component showing animated annual emissions and global benchmarks.
 * @module components/Dashboard/CarbonScore
 */

import React, { useState, useEffect } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { formatCO2 } from '../../utils/formatters';
import { Card } from '../shared/Card';

const BENCHMARKS = [
  { label: 'India Avg', kg: 1900 },
  { label: 'World Avg', kg: 4000 },
  { label: 'US Avg', kg: 16000 },
] as const;

/**
 * Animated carbon score gauge component.
 *
 * @returns The rendered Carbon Score gauge card.
 */
export function CarbonScore(): React.JSX.Element {
  const carbonScore = useCarbonStore((s) => s.carbonScore);
  const progressLog = useCarbonStore((s) => s.progressLog);
  const [animatedScore, setAnimatedScore] = useState(0);

  const totalSaved = progressLog.reduce((sum, e) => sum + e.kgCO2Saved, 0);
  const netScore = carbonScore ? Math.max(0, carbonScore.totalAnnualKgCO2 - totalSaved) : 0;

  useEffect(() => {
    if (!carbonScore) {return;}
    const start = 0;
    const end = netScore;
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
      const easeProgress = progress * (2 - progress);
      const current = Math.round(start + (end - start) * easeProgress);
      setAnimatedScore(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [carbonScore, netScore]);

  if (!carbonScore) {
    return (
      <Card className="score-card" aria-label="Carbon footprint score">
        <div className="empty-state">
          <p className="empty-state__icon" aria-hidden="true">🌍</p>
          <h2 className="empty-state__title">No Score Yet</h2>
          <p className="empty-state__desc">
            Complete the onboarding questionnaire to calculate your carbon footprint.
          </p>
        </div>
      </Card>
    );
  }

  const circumference = 502.655;
  const maxBudget = 20000;
  const percent = Math.min(100, Math.max(0, (netScore / maxBudget) * 100));
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  let ringColor = 'var(--color-excellent)';
  if (netScore >= 12000) {
    ringColor = 'var(--color-error)';
  } else if (netScore >= 6000) {
    ringColor = 'var(--color-warning)';
  }

  return (
    <Card className="score-card" aria-label="Your annual carbon footprint score">
      <h2 className="visually-hidden">Your Carbon Footprint</h2>
      <div className="score-card__ring-wrapper">
        <svg width="220" height="220" className="score-card__svg" aria-hidden="true">
          <circle cx="110" cy="110" r="80" fill="none" stroke="var(--color-bg-tertiary)" strokeWidth="12" />
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
            style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 1s ease-out' }}
          />
        </svg>
        <div className="score-card__text-content">
          <p className="score-card__value" aria-live="polite">{formatCO2(animatedScore)}</p>
          <p className="score-card__unit">CO₂ per year</p>
        </div>
      </div>
      <p className="score-card__label">Your estimated net annual carbon footprint</p>
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
