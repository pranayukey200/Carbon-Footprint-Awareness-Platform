import React from 'react';
import { Card } from '../shared/Card';
import { formatCO2, formatNumber } from '../../utils/formatters';

interface ProgressStatsProps {
  readonly logCount: number;
  readonly totalSaved: number;
  readonly streak: number;
}

/**
 * ProgressStats component renders the overview cards for total actions, CO2 saved, and streak.
 */
export const ProgressStats: React.FC<ProgressStatsProps> = ({
  logCount,
  totalSaved,
  streak,
}) => {
  return (
    <div className="progress__stats" role="list" aria-label="Progress statistics">
      <Card className="stat-card" aria-label="Total actions logged">
        <p className="stat-card__value">{formatNumber(logCount)}</p>
        <p className="stat-card__label">Actions Logged</p>
      </Card>
      <Card className="stat-card" aria-label="Total CO₂ saved">
        <p className="stat-card__value">{formatCO2(totalSaved)}</p>
        <p className="stat-card__label">CO₂ Saved</p>
      </Card>
      <Card className="stat-card" aria-label="Current streak in days">
        <p className="stat-card__value">{streak}</p>
        <p className="stat-card__label">Day Streak</p>
      </Card>
    </div>
  );
};

export default ProgressStats;
