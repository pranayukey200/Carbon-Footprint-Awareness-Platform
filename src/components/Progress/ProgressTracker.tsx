import { useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { formatCO2, formatNumber } from '../../utils/formatters';
import { Card } from '../shared/Card';
import { ProgressCard } from './ProgressCard';

function calculateStreak(dates: readonly string[]): number {
  if (dates.length === 0) return 0;
  let streak = 0;
  const today = new Date().setHours(0, 0, 0, 0);
  const uniqueDays = Array.from(new Set(dates.map((d) => new Date(d).setHours(0, 0, 0, 0)))).sort(
    (a, b) => b - a,
  );
  if (uniqueDays[0] && (today - uniqueDays[0]) / 86400000 <= 1) {
    streak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      if ((uniqueDays[i - 1]! - uniqueDays[i]!) / 86400000 <= 1) streak++;
      else break;
    }
  }
  return streak;
}

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

  const heatmapDays = useMemo(() => {
    const days = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 83);
    const logged = new Map<string, number>();
    progressLog.forEach((e) => {
      const d = new Date(e.completedAt).toISOString().split('T')[0] || '';
      logged.set(d, (logged.get(d) || 0) + 1);
    });
    for (let i = 0; i < 84; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dStr = d.toISOString().split('T')[0] || '';
      days.push({ date: d, count: logged.get(dStr) || 0 });
    }
    return days;
  }, [progressLog]);

  const milestones = useMemo(
    () => [
      {
        id: '1',
        title: 'First Step',
        desc: 'Log 1st action',
        icon: '🌿',
        unlocked: progressLog.length >= 1,
      },
      {
        id: '2',
        title: 'Carbon Cutter',
        desc: 'Save 100 kg CO₂',
        icon: '📉',
        unlocked: totalSaved >= 100,
      },
      { id: '3', title: 'Eco Routine', desc: '3-day streak', icon: '🔥', unlocked: streak >= 3 },
      {
        id: '4',
        title: 'Champion',
        desc: 'Log 5 actions',
        icon: '🏆',
        unlocked: progressLog.length >= 5,
      },
    ],
    [progressLog.length, totalSaved, streak],
  );

  return (
    <div
      className="progress"
      aria-label="Progress tracker"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
    >
      <header
        className="progress__header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h2 className="progress__title" style={{ margin: 0 }}>
          Your Progress
        </h2>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleLogAction}
          disabled={completedActions.length === 0}
          aria-label="Log a completed action to your progress"
        >
          Log Action
        </button>
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        <Card aria-label="Logging activity heatmap" style={{ padding: 'var(--space-4)' }}>
          <h3 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--font-size-base)' }}>
            Activity Heatmap
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateRows: 'repeat(7, 10px)',
              gridAutoFlow: 'column',
              gap: '3px',
              justifyContent: 'center',
            }}
          >
            {heatmapDays.map((day, idx) => {
              let color = 'var(--color-bg-tertiary)';
              if (day.count > 0) {
                color =
                  day.count === 1
                    ? 'rgba(29, 158, 117, 0.4)'
                    : day.count === 2
                      ? 'rgba(29, 158, 117, 0.7)'
                      : 'var(--color-accent-primary)';
              }
              return (
                <div
                  key={idx}
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: color,
                    borderRadius: '2px',
                  }}
                  title={`${day.count} actions on ${day.date.toLocaleDateString()}`}
                />
              );
            })}
          </div>
        </Card>

        <Card aria-label="Milestones" style={{ padding: 'var(--space-4)' }}>
          <h3 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--font-size-base)' }}>
            Milestones
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-2)',
            }}
          >
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
                  border: m.unlocked
                    ? '1px solid var(--color-accent-primary)'
                    : '1px solid transparent',
                  opacity: m.unlocked ? 1 : 0.4,
                }}
              >
                <span style={{ fontSize: 'var(--font-size-xl)' }}>{m.icon}</span>
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-bold)',
                    }}
                  >
                    {m.title}
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

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
