/**
 * @fileoverview Progress tracker page showing stats (total actions, CO₂ saved,
 * streak), a list of progress entries, and a "Log Action" button.
 * @module components/Progress/ProgressTracker
 */

import { useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { formatCO2, formatNumber } from '../../utils/formatters';
import { Card } from '../shared/Card';
import { ProgressCard } from './ProgressCard';

/**
 * Calculates a simple daily streak from chronologically-ordered entries.
 * A streak is consecutive calendar days with at least one logged action.
 */
function calculateStreak(dates: readonly string[]): number {
  if (dates.length === 0) return 0;
  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const latest = new Date(dates[0] ?? '');
  latest.setHours(0, 0, 0, 0);
  const diffToday = Math.floor((today.getTime() - latest.getTime()) / 86_400_000);
  if (diffToday > 1) return 0;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] ?? '');
    const curr = new Date(dates[i] ?? '');
    prev.setHours(0, 0, 0, 0);
    curr.setHours(0, 0, 0, 0);
    const gap = Math.floor((prev.getTime() - curr.getTime()) / 86_400_000);
    if (gap <= 1) streak++;
    else break;
  }
  return streak;
}

/**
 * Full progress tracking page with summary stats, the "Log Action" button,
 * and a chronological list of completed action entries.
 * Shows an empty state when no progress has been logged.
 * @returns Rendered progress tracker
 */
export function ProgressTracker(): ReactNode {
  const progressLog = useCarbonStore((s) => s.progressLog);
  const recommendations = useCarbonStore((s) => s.recommendations);
  const addProgressEntry = useCarbonStore((s) => s.addProgressEntry);

  const totalSaved = useMemo(
    () => progressLog.reduce((sum, e) => sum + e.kgCO2Saved, 0),
    [progressLog],
  );

  const streak = useMemo(
    () => calculateStreak(progressLog.map((e) => e.completedAt)),
    [progressLog],
  );

  const completedActions = useMemo(
    () => recommendations.filter((a) => a.isCompleted),
    [recommendations],
  );

  const handleLogAction = useCallback((): void => {
    const action = completedActions[0];
    if (!action) return;
    addProgressEntry({
      actionId: action.id,
      actionTitle: action.title,
      category: action.category,
      kgCO2Saved: action.potentialSavingKgCO2,
      notes: '',
    });
  }, [completedActions, addProgressEntry]);

  return (
    <div className="progress" aria-label="Progress tracker">
      <header className="progress__header">
        <h2 className="progress__title">Your Progress</h2>
      </header>

      <div className="progress__stats" role="list" aria-label="Progress statistics">
        <Card className="stat-card" aria-label="Total actions logged">
          <p className="stat-card__value">{formatNumber(progressLog.length)}</p>
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

      <button
        type="button"
        className="btn btn--primary btn--lg"
        onClick={handleLogAction}
        disabled={completedActions.length === 0}
        aria-label="Log a completed action to your progress"
      >
        Log Action
      </button>

      {progressLog.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__icon" aria-hidden="true">
            🌱
          </p>
          <h3 className="empty-state__title">No Progress Yet</h3>
          <p className="empty-state__desc">
            Complete actions and log them here to track your impact.
          </p>
        </div>
      ) : (
        <div className="progress__list" role="list" aria-label="Progress entries">
          {progressLog.map((entry) => (
            <div role="listitem" key={entry.id}>
              <ProgressCard entry={entry} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
