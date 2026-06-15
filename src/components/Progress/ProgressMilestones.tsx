/**
 * @fileoverview Milestones and Heatmap component for Carbon platform progress.
 * @module components/Progress/ProgressMilestones
 */

import React, { useMemo } from 'react';
import { Card } from '../shared/Card';

interface ProgressMilestonesProps {
  readonly progressLogLength: number;
  readonly totalSaved: number;
  readonly streak: number;
  readonly heatmapDays: readonly { date: Date; count: number }[];
}

/**
 * ProgressMilestones component displays the carbon logging activity heatmap and unlocked milestones.
 */
export const ProgressMilestones: React.FC<ProgressMilestonesProps> = ({
  progressLogLength,
  totalSaved,
  streak,
  heatmapDays,
}) => {
  const milestones = useMemo(
    () => [
      { id: '1', title: 'First Step', desc: 'Log 1st action', icon: '🌿', unlocked: progressLogLength >= 1 },
      { id: '2', title: 'Carbon Cutter', desc: 'Save 100 kg CO₂', icon: '📉', unlocked: totalSaved >= 100 },
      { id: '3', title: 'Eco Routine', desc: '3-day streak', icon: '🔥', unlocked: streak >= 3 },
      { id: '4', title: 'Champion', desc: 'Log 5 actions', icon: '🏆', unlocked: progressLogLength >= 5 },
    ],
    [progressLogLength, totalSaved, streak],
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
      <Card aria-label="Logging activity heatmap" style={{ padding: 'var(--space-4)' }}>
        <h3 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--font-size-base)' }}>Activity Heatmap</h3>
        <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 10px)', gridAutoFlow: 'column', gap: '3px', justifyContent: 'center' }}>
          {heatmapDays.map((day, idx) => {
            let color = 'var(--color-bg-tertiary)';
            if (day.count === 1) {
              color = 'rgba(29, 158, 117, 0.4)';
            } else if (day.count === 2) {
              color = 'rgba(29, 158, 117, 0.7)';
            } else if (day.count > 2) {
              color = 'var(--color-accent-primary)';
            }
            return (
              <div
                key={idx}
                style={{ width: '10px', height: '10px', backgroundColor: color, borderRadius: '2px' }}
                title={`${day.count} actions on ${day.date.toLocaleDateString()}`}
              />
            );
          })}
        </div>
      </Card>

      <Card aria-label="Milestones" style={{ padding: 'var(--space-4)' }}>
        <h3 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--font-size-base)' }}>Milestones</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
          {milestones.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                background: m.unlocked ? 'rgba(29, 158, 117, 0.1)' : 'var(--color-bg-tertiary)',
                border: m.unlocked ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
                opacity: m.unlocked ? 1 : 0.4,
              }}
            >
              <span style={{ fontSize: 'var(--font-size-xl)' }}>{m.icon}</span>
              <div>
                <h4 style={{ margin: 0, fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)' }}>{m.title}</h4>
                <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
export default ProgressMilestones;
