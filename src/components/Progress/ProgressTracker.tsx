/**
 * @fileoverview Coordinator component for the Carbon platform progress tracking view.
 * Renders stats summary cards, CSV exporters, and action log dialogs.
 * @module components/Progress/ProgressTracker
 */

import { useMemo, useCallback, useState, type ReactNode } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { ProgressCard } from './ProgressCard';
import { calculateStreak } from '../../utils/streak';
import { LogActionModal } from './LogActionModal';
import { ProgressMilestones } from './ProgressMilestones';
import { ProgressStats } from './ProgressStats';
import { exportProgressToCSV } from '../../utils/csvExport';

/**
 * Main Progress Tracker view.
 * Displays stats overview, milstone challenges, and progress log history.
 */
export function ProgressTracker(): ReactNode {
  const progressLog = useCarbonStore((s) => s.progressLog);
  const recommendations = useCarbonStore((s) => s.recommendations);
  const addProgressEntry = useCarbonStore((s) => s.addProgressEntry);
  const [isLogging, setIsLogging] = useState(false);

  const totalSaved = useMemo(() => progressLog.reduce((sum, e) => sum + e.kgCO2Saved, 0), [progressLog]);
  const streak = useMemo(() => calculateStreak(progressLog.map((e) => e.completedAt)), [progressLog]);

  const handleLogSubmit = useCallback((actionId: string, qty: number, noteText: string) => {
    const act = recommendations.find((a) => a.id === actionId);
    if (!act) {return;}
    addProgressEntry({
      actionId,
      actionTitle: act.title,
      category: act.category,
      kgCO2Saved: act.potentialSavingKgCO2 * qty,
      notes: noteText,
    });
    if (!act.isCompleted) {useCarbonStore.getState().toggleActionCompleted(actionId);}
    setIsLogging(false);
  }, [recommendations, addProgressEntry]);

  const handleExportCSV = useCallback(() => exportProgressToCSV(progressLog), [progressLog]);

  const heatmapDays = useMemo(() => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 83);
    const logged = new Map<string, number>();
    progressLog.forEach((e) => {
      const d = new Date(e.completedAt).toISOString().split('T')[0] || '';
      logged.set(d, (logged.get(d) || 0) + 1);
    });
    return Array.from({ length: 84 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dStr = d.toISOString().split('T')[0] || '';
      return { date: d, count: logged.get(dStr) || 0 };
    });
  }, [progressLog]);

  return (
    <div className="progress" aria-label="Progress tracker" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <header className="progress__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="progress__title" style={{ margin: 0 }}>Your Progress</h2>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button type="button" className="btn btn--secondary" onClick={handleExportCSV} disabled={progressLog.length === 0} aria-label="Export progress log to CSV">
            📥 Export CSV
          </button>
          <button type="button" className="btn btn--primary" onClick={() => setIsLogging(true)} disabled={recommendations.length === 0} aria-label="Log an action to your progress">
            Log Action
          </button>
        </div>
      </header>

      <ProgressStats logCount={progressLog.length} totalSaved={totalSaved} streak={streak} />
      <ProgressMilestones progressLogLength={progressLog.length} totalSaved={totalSaved} streak={streak} heatmapDays={heatmapDays} />

      <div className="progress__log" aria-label="Action log history">
        <h3 style={{ margin: 'var(--space-2) 0 var(--space-4) 0', fontSize: 'var(--font-size-base)' }}>Action Log History</h3>
        {progressLog.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
            No actions logged yet. Go to recommendations and commit to some changes!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {progressLog.map((entry) => <ProgressCard key={entry.id} entry={entry} />)}
          </div>
        )}
      </div>

      <LogActionModal isOpen={isLogging} onClose={() => setIsLogging(false)} recommendations={recommendations} onSubmit={handleLogSubmit} />
      <button type="button" className="fab-button" onClick={() => setIsLogging(true)} disabled={recommendations.length === 0} aria-label="Quick log action" title="Quick log action">
        ➕
      </button>
    </div>
  );
}

export default ProgressTracker;
