/**
 * @fileoverview Main container rendering recommended carbon reduction actions.
 * @module components/Actions/ActionList
 */

import { useState, useMemo, type ReactNode } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import type { CategoryType } from '../../types';
import { ActionCard } from './ActionCard';
import { SmartCarbonTools } from './SmartCarbonTools';

/**
 * Renders the filterable recommended action items and sustainability utility tools.
 *
 * @returns The rendered Action list page.
 */
export function ActionList(): ReactNode {
  const recommendations = useCarbonStore((s) => s.recommendations);
  const setEnergyProfile = useCarbonStore((s) => s.setEnergyProfile);
  const calculateScore = useCarbonStore((s) => s.calculateScore);

  const [activeFilter, setActiveFilter] = useState<CategoryType | 'all'>('all');

  const filtered = useMemo(() => {
    return activeFilter === 'all'
      ? recommendations
      : recommendations.filter((a) => a.category === activeFilter);
  }, [recommendations, activeFilter]);

  const completedCount = useMemo(() => {
    return recommendations.filter((a) => a.isCompleted).length;
  }, [recommendations]);

  return (
    <div
      className="actions"
      aria-label="Action recommendations"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
    >
      <header
        className="actions__header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h2 className="actions__title" style={{ margin: 0 }}>
          Recommended Actions
        </h2>
        <p aria-live="polite" aria-atomic="true" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
          {completedCount} of {recommendations.length} completed
        </p>
      </header>

      <nav
        className="actions__filters"
        aria-label="Filter actions by category"
        style={{ display: 'flex', gap: 'var(--space-2)' }}
      >
        {['all', 'transport', 'diet', 'energy', 'shopping'].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`btn btn--ghost${activeFilter === cat ? ' btn--primary' : ''}`}
            onClick={() => setActiveFilter(cat as CategoryType | 'all')}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </nav>

      {filtered.length > 0 && (
        <div className="actions__grid" role="list" aria-label="Action cards">
          {filtered.map((action) => (
            <div role="listitem" key={action.id}>
              <ActionCard action={action} />
            </div>
          ))}
        </div>
      )}

      <h3 style={{ margin: 'var(--space-4) 0 0 0', fontSize: 'var(--font-size-xl)' }}>
        ⚡ Smart Carbon Tools
      </h3>
      <SmartCarbonTools setEnergyProfile={setEnergyProfile} calculateScore={calculateScore} />
    </div>
  );
}

export default ActionList;
